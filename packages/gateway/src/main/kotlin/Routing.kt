package app.pluralbuddy

import app.pluralbuddy.packets.AuthenticatedSessionPacket
import app.pluralbuddy.packets.AuthenticationPacket
import app.pluralbuddy.packets.BasePacket
import app.pluralbuddy.packets.ReminderPacket
import app.pluralbuddy.structure.Reminder
import app.pluralbuddy.structure.description.Description
import app.pluralbuddy.structure.description.MessageDescription
import app.pluralbuddy.structure.description.TextDescription
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
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclass
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

    routing {
        get("/") {
            call.respondText(homePage, contentType = ContentType.Text.Html)
        }
        webSocket("/bot") { // websocketSession
            val authKey = System.getenv("BOT_API_KEY")
            val contentConverter = KotlinxWebsocketSerializationConverter(Json {
                withOpenSchedulingSettings()
            })
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
                            logger.info("Application with user agent ${authenticationPacket.userAgent} authenticated.")
                        }

                        if (authenticated) {
                            possibleSessionJob = launch {
                                sharedFlow.collect { message ->
                                    sendSerialized(message)
                                }
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
        get("/json/kotlinx-serialization") {
            call.respond(mapOf("hello" to "world"))
        }
    }
}