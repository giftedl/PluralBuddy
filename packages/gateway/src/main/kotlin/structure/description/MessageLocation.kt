package app.pluralbuddy.structure.description

import kotlinx.serialization.Serializable

@Serializable
class MessageLocation(
    val messageId: String,
    val channelId: String,
    val guildId: String
)