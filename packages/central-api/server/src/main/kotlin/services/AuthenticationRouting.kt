package app.pluralbuddy.services

import app.pluralbuddy.UserSession
import io.ktor.client.HttpClient
import io.ktor.client.engine.apache.Apache
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.HttpMethod
import io.ktor.http.auth.DigestAlgorithm
import io.ktor.http.auth.KeyAlgorithm
import io.ktor.http.auth.SignatureAlgorithm
import io.ktor.http.path
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.OAuthAccessTokenResponse
import io.ktor.server.auth.OAuthServerSettings
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.authentication
import io.ktor.server.auth.install
import io.ktor.server.auth.jwt.jwt
import io.ktor.server.auth.oauth
import io.ktor.server.auth.oidc.Oidc
import io.ktor.server.auth.oidc.OidcEnvConfig
import io.ktor.server.auth.roles
import io.ktor.server.config.getAs
import io.ktor.server.netty.Netty
import io.ktor.server.response.respondRedirect
import io.ktor.server.routing.get
import io.ktor.server.routing.routing
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import io.ktor.util.collections.ConcurrentMap
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.serialization.json.Json
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.seconds

val applicationHttpClient = HttpClient(Apache) {
    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
        })
    }
}

@OptIn(ExperimentalKtorApi::class)
suspend fun Application.configureAuthenticationSecurity(httpClient: HttpClient = applicationHttpClient) {
//    val oidc = install(Oidc)
//    val env = environment.config
//        .property("ktor.oidc.pluralbuddy")
//        .getAs<OidcEnvConfig>()
//
//    val pluralbuddy = oidc.identityProvider("pluralbuddy") {
//        issuer = env.issuer
//
//        jwt {
//            allowedAlgorithms = setOf(
//                SignatureAlgorithm(
//                    name = "EdDSA",
//                    jcaAlgorithm = "Ed25519",
//                    digestAlgorithm = null, // or the model's “none” value
//                    keyAlgorithm = KeyAlgorithm.EdDSA,
//                    xmlUri = "urn:ietf:params:xml:ns:cpxmlsec:algorithms:eddsa-ed25519",
//                    jwaName = "EdDSA"
//                )
//            )
//            jwkCache(maxEntries = 10, duration = 1.hours)
//            jwkRateLimit(bucketSize = 10)
//        }
//
//        oauth {
//            clientId = env.clientId
//            clientSecret = env.clientSecret
//            scopes = env.scopes
//
//            loginUri = { path("api", "authentication", "to-login") }
//            redirectUri = { path("api", "callback") }
//            logout(path = "/api/authentication/logout")
//            refresh(path = "/api/authentication/refresh")
//
//            onAuthenticationFailed { cause ->
//                println(cause)
//            }
//        }
//    }


    val oidc = install(Oidc)


    oidc.identityProvider("pluralbuddy") {
        issuer = "https://pluralbuddy.app"
        jwt {
            clockSkew = 30.seconds
            allowedAlgorithms = setOf(
                SignatureAlgorithm.RSA_SHA_256
            )
            jwkCache(maxEntries = 10, duration = 1.hours)
            jwkRateLimit(bucketSize = 10)
        }
    }

}