package app.pluralbuddy.types.errors

import app.pluralbuddy.types.HTTPError
import kotlinx.serialization.Serializable

@Serializable
class UnauthorizedError : HTTPError("You aren't authorized to do that.")