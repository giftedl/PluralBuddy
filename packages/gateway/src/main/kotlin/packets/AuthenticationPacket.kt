package app.pluralbuddy.packets

import kotlinx.serialization.Serializable

@Serializable
data class AuthenticationPacket(val token: String, val userAgent: String) : BasePacket()

@Serializable
data class AuthenticatedSessionPacket(val success: Boolean = true) : BasePacket()