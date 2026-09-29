package app.pluralbuddy.structure.description

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
@SerialName("text")
class TextDescription(
    val content: String
) : Description()