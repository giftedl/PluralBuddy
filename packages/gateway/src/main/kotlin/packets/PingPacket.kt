package app.pluralbuddy.packets

import kotlinx.serialization.Serializable

@Serializable
class PingPacket(val now: Long) : BasePacket()

@Serializable
class PongPacket(val msSince: Long) : BasePacket()

@Serializable
class NudgePacket(val msSinceLastPing: Long) : BasePacket()