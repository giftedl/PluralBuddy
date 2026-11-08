package app.pluralbuddy.types

import kotlinx.serialization.Serializable

@Serializable
abstract class HTTPError(val description: String)