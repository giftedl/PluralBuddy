package app.pluralbuddy.structure

import app.pluralbuddy.structure.description.Description
import kotlinx.serialization.Serializable

@Serializable
data class Reminder(
    val id: String,
    val authorId: String,
    val description: Array<Description>,
    val `when`: String
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Reminder

        if (id != other.id) return false
        if (authorId != other.authorId) return false
        if (!description.contentEquals(other.description)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + authorId.hashCode()
        result = 31 * result + description.contentHashCode()
        return result
    }
}