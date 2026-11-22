package app.pluralbuddy.routing

import app.pluralbuddy.services.configureAuthenticationSecurity
import app.pluralbuddy.types.PluralBuddySystem
import app.pluralbuddy.types.response.GetSystemResponse
import app.pluralbuddy.util.refreshRerunBoundary
import app.pluralbuddy.util.requireOkay
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.get
import io.ktor.http.headers
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.utils.io.*

@OptIn(ExperimentalKtorApi::class)
suspend fun Application.systemRouting() {
    val pluralbuddy = configureAuthenticationSecurity()

    routing {
        authenticateWith(pluralbuddy.session) {
            get("/api/v1/system/{systemId}") {
                val client = HttpClient(CIO) {
                    install(ContentNegotiation) {
                        json()
                    }
                }
                val userSystemResponse = refreshRerunBoundary(pluralbuddy) { user ->
                    client.get("https://pluralbuddy.app/api/v1/users/${call.parameters["systemId"]}/system") {
                        headers {
                            bearerAuth(user)
                        }
                    }.requireOkay()
                }

                call.respond(userSystemResponse!!.body<GetSystemResponse>().data)
            }
        }
    }
}