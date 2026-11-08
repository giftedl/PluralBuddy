package app.pluralbuddy.services

import app.pluralbuddy.util.db.MongoSessionStorage
import app.pluralbuddy.util.getApplicationConfig
import app.pluralbuddy.util.toHex
import io.ktor.http.auth.DigestAlgorithm
import io.ktor.http.auth.KeyAlgorithm
import io.ktor.http.auth.SignatureAlgorithm
import io.ktor.http.path
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.authenticateWith
import io.ktor.server.auth.authentication
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.auth.oidc.Oidc
import io.ktor.server.auth.oidc.OidcEnvConfig
import io.ktor.server.auth.oidc.OidcStateEncryptionKey
import io.ktor.server.auth.principal
import io.ktor.server.auth.roles
import io.ktor.server.config.getAs
import io.ktor.server.response.respond
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.sessions.SessionStorage
import io.ktor.server.sessions.sameSite
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.serialization.json.Json
import java.security.SecureRandom
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.seconds

@OptIn(ExperimentalKtorApi::class)
suspend fun Application.configureAuthenticationSecurity() {
    val oidc = install(Oidc)
    val env = environment.config
        .property("ktor.oidc.pluralbuddy")
        .getAs<OidcEnvConfig>()
    val central = getApplicationConfig()
    val mongoCollection = mongo()

    val pluralbuddy = oidc.identityProvider("pluralbuddy") {
        issuer = "https://pluralbuddy.app/api/auth"

        jwt {
            clockSkew = 30.seconds
            jwkCache(maxEntries = 10, duration = 1.hours)
            jwkRateLimit(bucketSize = 10)
        }


        oauth {
            resourceIndicators = listOf("https://pluralbuddy.app")
            sessions {
                storage = MongoSessionStorage(
                    mongoCollection.getCollection(
                        "sessions",
                        MongoSessionStorage.RealSession::class.java
                    )
                )
                cookie {
                    cookie.sameSite = "Lax"
                }
            }

            stateEncryptionKey = OidcStateEncryptionKey.of(central.ktorEncryption.hexToByteArray())
            clientId = env.clientId
            clientSecret = env.clientSecret

            scopes = env.scopes
            loginUri = { path("api", "v1", "authentication", "to-login") }
            redirectUri = { path("api", "callback") }
            onAuthenticated { t,  ->
                call.respondRedirect("${central.clientUrl}/auth/callback")
            }
            onAuthenticationFailed { cause ->
                println(cause)
            }
        }
    }


    routing {
        authenticateWith(pluralbuddy.session) {
            get("/api/v1/authentication/profile") {
                val user = call.principal.userInfo

                call.respond(user)
            }
        }
    }
}