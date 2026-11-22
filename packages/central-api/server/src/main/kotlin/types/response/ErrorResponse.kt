package app.pluralbuddy.types.response

import kotlinx.serialization.Serializable

@Serializable
data class ErrorResponse(val errors: List<PluralBuddyError>) {
    @Serializable
    data class PluralBuddyError(val type: String, val friendly: String)
}