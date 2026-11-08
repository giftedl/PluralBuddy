package app.pluralbuddy.util

import io.ktor.server.application.Application
import io.ktor.server.config.getAs
import kotlinx.serialization.Serializable

@Serializable
data class EnvApplicationConfig(
    val ktorEncryption: String,
    val clientUrl: String
)

fun Application.getApplicationConfig(): EnvApplicationConfig
    = environment.config
        .property("ktor.central")
        .getAs<EnvApplicationConfig>()