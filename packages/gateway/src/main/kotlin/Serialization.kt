package app.pluralbuddy

import app.pluralbuddy.anyOrPacketTypes
import app.pluralbuddy.packets.AuthenticatedSessionPacket
import app.pluralbuddy.packets.AuthenticationPacket
import app.pluralbuddy.packets.BasePacket
import app.pluralbuddy.packets.ReminderPacket
import app.pluralbuddy.structure.description.Description
import app.pluralbuddy.structure.description.MessageDescription
import app.pluralbuddy.structure.description.TextDescription
import io.ktor.server.application.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonBuilder
import kotlinx.serialization.modules.PolymorphicModuleBuilder
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.polymorphic
import kotlinx.serialization.modules.subclass

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }
}

fun JsonBuilder.withOpenSchedulingSettings() {
    ignoreUnknownKeys = true
    encodeDefaults = true
    classDiscriminator = "$"
    serializersModule = SerializersModule {
        polymorphic(BasePacket::class) {
            subclass(AuthenticationPacket::class)
            subclass(ReminderPacket::class)
            anyOrPacketTypes()
        }
        polymorphic(Description::class) {
            subclass(MessageDescription::class)
            subclass(TextDescription::class)
        }
        polymorphic(Any::class) {
            anyOrPacketTypes()
        }
    }
}

fun PolymorphicModuleBuilder<BasePacket>.anyOrPacketTypes() {
    subclass(AuthenticatedSessionPacket::class)
}