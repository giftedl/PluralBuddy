package app.pluralbuddy.types

import kotlinx.serialization.Serializable

@Serializable
data class PluralBuddyAutoProxy(
    val autoproxyMode: AutoProxyMode,
    val autoproxyAlter: String? = null,
    val serverId: String,
    val lastLatchTimestamp: String? = null,
) {
    enum class AutoProxyMode {
        off, latch, alter
    }
}