package app.pluralbuddy.packets

import app.pluralbuddy.structure.Reminder
import kotlinx.serialization.Serializable

@Serializable
data class ReminderPacket(val newState: String, val reminderId: String, val reminderData: Reminder) : BasePacket()