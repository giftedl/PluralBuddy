package app.pluralbuddy.types.response

import app.pluralbuddy.types.PluralBuddySystem
import kotlinx.serialization.Serializable

@Serializable
data class GetSystemResponse(val data: PluralBuddySystem)