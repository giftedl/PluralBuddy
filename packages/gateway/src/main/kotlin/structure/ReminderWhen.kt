package app.pluralbuddy.structure

import kotlinx.serialization.Serializable

@Serializable
class ReminderWhen(
    val timeMs: String? = null,
    val whenAlterFronts: String? = null,
    val frontingDefinedAs: FrontingDefinedAs? = null,
)