package app.pluralbuddy.services

import app.pluralbuddy.util.db.MongoSessionStorage
import app.pluralbuddy.util.getApplicationConfig
import app.pluralbuddy.util.refreshRerunBoundary
import app.pluralbuddy.util.requireOkay
import app.pluralbuddy.util.toHex
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.bearerAuth
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.client.statement.request
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.URLProtocol
import io.ktor.http.auth.DigestAlgorithm
import io.ktor.http.auth.KeyAlgorithm
import io.ktor.http.auth.SignatureAlgorithm
import io.ktor.http.headers
import io.ktor.http.path
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.authenticateWith
import io.ktor.server.auth.authentication
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.auth.oidc.Oidc
import io.ktor.server.auth.oidc.OidcEnvConfig
import io.ktor.server.auth.oidc.OidcProvider
import io.ktor.server.auth.oidc.OidcStateEncryptionKey
import io.ktor.server.auth.principal
import io.ktor.server.auth.roles
import io.ktor.server.config.getAs
import io.ktor.server.request.host
import io.ktor.server.response.respond
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.sessions.SessionStorage
import io.ktor.server.sessions.sameSite
import io.ktor.server.util.url
import io.ktor.utils.io.ExperimentalKtorApi
import io.netty.handler.codec.http.HttpResponseStatus
import kotlinx.serialization.json.Json
import java.security.SecureRandom
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.seconds

@OptIn(ExperimentalKtorApi::class)
var installedPlugin: OidcProvider? = null;

@OptIn(ExperimentalKtorApi::class)
suspend fun Application.configureAuthenticationSecurity(): OidcProvider {
    installedPlugin?.let { return it }

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
//                cookie {
//                    cookie.domain = central.cookieDomain
//                }
            }

            stateEncryptionKey = OidcStateEncryptionKey.of(central.ktorEncryption.hexToByteArray())
            clientId = env.clientId
            clientSecret = env.clientSecret

            scopes = env.scopes
            loginUri = { path("api", "v1", "authentication", "to-login") }
            redirectUri = {
                path("api", "callback")
            }
            onAuthenticated { t,  ->
                call.respondRedirect("${central.clientUrl}/auth/callback")
            }
            onAuthenticationFailed { cause ->
                println(cause)
            }
        }
    }

    installedPlugin = pluralbuddy;

    return pluralbuddy;
}

@OptIn(ExperimentalKtorApi::class)
suspend fun Application.configureAuthenticationRouter() {
    val pluralbuddy = configureAuthenticationSecurity()

    routing {
        authenticateWith(pluralbuddy.session) {
            get("/api/v1/authentication/profile") {
                val client = HttpClient(CIO)
                val userInfoResponse = refreshRerunBoundary(pluralbuddy) { user ->
                    client.get("https://pluralbuddy.app/api/auth/oauth2/userinfo") {
                        headers {
                            bearerAuth(user)
                        }
                    }.requireOkay()
                }

                if (userInfoResponse == null) {
                    call.respond(HttpStatusCode.Unauthorized)
                    return@get
                }

                call.response.headers.append(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                call.respond(userInfoResponse.bodyAsText())
            }
        }
    }
}