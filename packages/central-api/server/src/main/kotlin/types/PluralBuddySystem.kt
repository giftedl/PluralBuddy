package app.pluralbuddy.types

import kotlinx.serialization.Serializable
import kotlin.time.Instant

@Serializable
data class PluralBuddySystem(
    val associatedUserId: String,
    val systemName: String,
    val systemDisplayTag: String? = null,
    val displayTagMap: Map<String, String>? = emptyMap(),
    val systemDescription: String? = null,
    val systemAvatar: String? = null,
    val systemBanner: String? = null,
    val systemPronouns: String? = null,
    val nicknameFormat: String? = null,
    val alterIds: List<String>? = emptyList(),
    val tagIds: List<String>? = emptyList(),
    val createdAt: Instant? = null,
    val systemAutoproxy: List<PluralBuddyAutoProxy>,
    val systemOperationDM: Boolean? = false,
    val latchExpiration: Int? = 0,
    val public: Int,
    val flags: Int = 0,
    val disabledGuilds: List<String>? = emptyList(),
    val disabled: Boolean? = false,
    val subAccounts: List<String>? = emptyList(),
)