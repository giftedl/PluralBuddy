package app.pluralbuddy.structure.description

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
@SerialName("message")
class MessageDescription(
    val location: MessageLocation,
) : Description()
