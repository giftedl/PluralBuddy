package app.pluralbuddy.structure

import kotlinx.serialization.Serializable

@Serializable
data class Bot(
    val id: String,
    val clientBrand: String,
    val connectedSince: Long?,
    var lastPing: Long?,
    var lastPingEpoch: Long?,
)
