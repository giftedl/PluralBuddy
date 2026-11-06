package app.pluralbuddy.services

import io.ktor.http.auth.DigestAlgorithm
import io.ktor.http.auth.KeyAlgorithm
import io.ktor.http.auth.SignatureAlgorithm
import io.ktor.http.path
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.oidc.Oidc
import io.ktor.server.auth.oidc.OidcEnvConfig
import io.ktor.server.config.getAs
import io.ktor.utils.io.ExperimentalKtorApi
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.seconds

@OptIn(ExperimentalKtorApi::class)
suspend fun Application.configureAuthenticationSecurity() {

    val oidc = install(Oidc)
    val env = environment.config
        .property("ktor.oidc.pluralbuddy")
        .getAs<OidcEnvConfig>()

    oidc.identityProvider("pluralbuddy") {
        issuer = "https://pluralbuddy.app/api/auth"

        jwt {
            clockSkew = 30.seconds
            jwkCache(maxEntries = 10, duration = 1.hours)
            jwkRateLimit(bucketSize = 10)

// Same error, with or without this being commented out.
//            allowedAlgorithms = setOf(
//                SignatureAlgorithm(
//                    name = "EdDSA",
//                    jcaAlgorithm = "Ed25519",
//                    digestAlgorithm = DigestAlgorithm.SHA_512,
//                    keyAlgorithm = KeyAlgorithm.OKP,
//                    jwaName = "EdDSA"
//                )
//            )
        }

        oauth {
            clientId = env.clientId
            clientSecret = env.clientSecret
            scopes = env.scopes
            loginUri = { path("api", "authentication", "to-login") }
            redirectUri = { path("api", "callback") }
            onAuthenticationFailed { cause ->
                cause // io.ktor.server.auth.AuthenticationFailedCause { message: "JWT algorithm EdDSA is not accepted" }
            }
        }
    }

}