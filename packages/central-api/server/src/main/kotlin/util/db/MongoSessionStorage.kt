package app.pluralbuddy.util.db

import com.mongodb.client.MongoCollection
import com.mongodb.client.model.Filters
import io.ktor.server.auth.oidc.OidcToken
import io.ktor.server.sessions.SessionStorage
import io.ktor.utils.io.ExperimentalKtorApi
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@OptIn(ExperimentalKtorApi::class)
class MongoSessionStorage(val collection: MongoCollection<RealSession>) : SessionStorage {
    val jsonSerializer = Json

    @Serializable
    class RealSession @OptIn(ExperimentalKtorApi::class) constructor(val sessionId: String, @SerialName("sessionData") val sessionData: OidcToken.Id)

    override suspend fun write(id: String, value: String) {
        collection.insertOne(
            RealSession(id,
                jsonSerializer.decodeFromString<OidcToken.Id>(value)
            )
        )
    }

    override suspend fun invalidate(id: String) {
        collection.deleteOne(Filters.eq("sessionId", id))
    }

    override suspend fun read(id: String): String {
        val session = collection.find(Filters.eq("sessionId", id))
            .limit(1)
            .toList()

        return jsonSerializer.encodeToString(session[0].sessionData);
    }
}