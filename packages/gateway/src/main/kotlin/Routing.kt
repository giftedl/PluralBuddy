package app.pluralbuddy

import app.pluralbuddy.packets.AuthenticatedSessionPacket
import app.pluralbuddy.packets.AuthenticationPacket
import app.pluralbuddy.packets.BasePacket
import app.pluralbuddy.packets.PingPacket
import app.pluralbuddy.packets.PongPacket
import app.pluralbuddy.packets.ReminderPacket
import app.pluralbuddy.structure.Bot
import app.pluralbuddy.structure.Reminder
import app.pluralbuddy.structure.description.Description
import app.pluralbuddy.structure.description.MessageDescription
import app.pluralbuddy.structure.description.TextDescription
import io.github.cdimascio.dotenv.dotenv
import io.ktor.http.ContentType
import io.ktor.http.invoke
import io.ktor.serialization.deserialize
import io.ktor.serialization.kotlinx.KotlinxWebsocketSerializationConverter
import io.ktor.serialization.serialize
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.Job
import kotlinx.coroutines.channels.consumeEach
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.PolymorphicSerializer
import kotlinx.serialization.json.Json
import org.intellij.lang.annotations.Language
import org.slf4j.LoggerFactory
import java.time.Duration

fun Application.configureRouting() {
    val logger = LoggerFactory.getLogger("routing")
    @Language("html")
    val homePage = """
<small style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;">
  PluralBuddy Gateway v$version / as part of the PluralBuddy project <br>
  <a href='https://pluralbuddy.app'>Looking for PluralBuddy?</a>
</small>"""

    val messageResponseFlow = MutableSharedFlow<BasePacket>()
    val sharedFlow = messageResponseFlow.asSharedFlow()
    val dotenv = runCatching { dotenv {
        /* When running via the NPM task,   the actual .env is two directories behind. */
        directory = "../../"
    } }

    routing {
        get("/") {
            call.respondText(homePage, contentType = ContentType.Text.Html)
        }
        get("/bot/statuses") {
            call.respond<Array<Bot>>(botManager.authenticatedClients.values.toTypedArray())
        }
        webSocket("/bot") { // websocketSession
            val authKey = (dotenv.getOrNull()?.get("BOT_API_KEY")) ?: System.getenv("BOT_API_KEY")
            val contentConverter = KotlinxWebsocketSerializationConverter(Json {
                withOpenSchedulingSettings()
            })
            var clientId: String? = null;
            var authenticated = false;
            var possibleSessionJob: Job? = null;

            if (authKey == null) {
                logger.error("Auth token not found.")

                return@webSocket close(
                    CloseReason(
                        CloseReason.Codes.INTERNAL_ERROR,
                        "Authentication token is not properly configured, something is very wrong."
                    )
                )
            }

            logger.info("Bot-adjacent websocket flow opened.")


            runCatching {
                outgoing.invokeOnClose {
                    if (authenticated && clientId != null) {
                        botManager.closeClient(clientId!!)
                        possibleSessionJob?.cancel()
                    }
                }

                incoming.consumeEach { frame ->
                    if (frame is Frame.Text) {
                        val text = runCatching { contentConverter.deserialize<BasePacket>(frame) }

                        if (text.isFailure) {
                            println(text.exceptionOrNull()?.message)
                            return@webSocket close(
                                CloseReason(
                                    CloseReason.Codes.VIOLATED_POLICY,
                                    message = "Invalid JSON."
                                )
                            )
                        }

                        if (text.getOrNull() is AuthenticationPacket) {
                            val authenticationPacket = contentConverter.deserialize<AuthenticationPacket>(frame)

                            if (authenticationPacket.token != authKey) {
                                logger.error("Application with user agent ${authenticationPacket.userAgent} attempted to authenticate.")
                                return@webSocket close(
                                    CloseReason(
                                        CloseReason.Codes.VIOLATED_POLICY,
                                        message = "Not authenticated."
                                    )
                                )
                            }

                            authenticated = true
                            send(contentConverter.serialize(AuthenticatedSessionPacket(success = true) as BasePacket))
                            clientId = botManager.addAuthenticatedClient(authenticationPacket.userAgent)
                            logger.info("Application with user agent ${authenticationPacket.userAgent} authenticated.")
                        }

                        if (authenticated && clientId != null) {
                            possibleSessionJob = launch {
                                sharedFlow.collect { message ->
                                    sendSerialized(message)
                                }
                            }

                            if (text.getOrNull() is PingPacket) {
                                val pingPacket = text.getOrNull() as PingPacket
                                val ping = System.currentTimeMillis() - pingPacket.now

                                botManager.setLastPing(clientId, ping)
                                send(contentConverter.serialize(PongPacket(msSince = ping) as BasePacket))
                            }
                        }
                    }
                }
            }.onFailure { exception ->
                logger.error(exception.message, exception)
            }.also {
                possibleSessionJob?.cancel()
            }
        }
    }
}