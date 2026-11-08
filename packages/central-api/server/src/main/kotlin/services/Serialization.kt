package app.pluralbuddy.services

import app.pluralbuddy.types.HTTPError
import app.pluralbuddy.types.errors.InternalServerError
import app.pluralbuddy.types.errors.UnauthorizedError
import io.ktor.server.application.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclass

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json(Json {
            classDiscriminator = "_type"
            serializersModule = SerializersModule {
                polymorphic(HTTPError::class) {
                    subclass(UnauthorizedError::class)
                    subclass(InternalServerError::class)
                }
            }
        })
    }
}