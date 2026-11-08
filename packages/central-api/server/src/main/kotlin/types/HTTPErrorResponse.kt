package app.pluralbuddy.types

import kotlinx.serialization.Serializable

@Serializable
data class HTTPErrorResponse(val errors: List<HTTPError>)