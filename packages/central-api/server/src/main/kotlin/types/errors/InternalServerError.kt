package app.pluralbuddy.types.errors

import app.pluralbuddy.types.HTTPError
import kotlinx.serialization.Serializable

@Serializable
class InternalServerError : HTTPError(description = "An internal error occurred while doing that operation.")