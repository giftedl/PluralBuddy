package app.pluralbuddy.database

import app.pluralbuddy.structure.Bot
import java.util.UUID

class BotClientManager {
    var authenticatedClients: MutableMap<String, Bot> = mutableMapOf()

    fun addAuthenticatedClient(clientBrand: String): String {
        val id = UUID.randomUUID().toString();

        authenticatedClients[id] = Bot(
            id = id,
            clientBrand = clientBrand,
            connectedSince = System.currentTimeMillis(),
            lastPing = 100,
            lastPingEpoch = System.currentTimeMillis()
        )

        return id;
    }

    fun setLastPing(editId: String, num: Long?) {
        val client = authenticatedClients[editId] ?: throw Error("Client doesn't exist?")

        client.lastPing = num;
        client.lastPingEpoch = System.currentTimeMillis();
    }
}