package app.pluralbuddy.util

import app.pluralbuddy.services.mongo
import app.pluralbuddy.util.db.MongoSessionStorage
import com.mongodb.client.model.Filters
import com.mongodb.client.model.Updates
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpStatusCode
import io.ktor.server.auth.PrincipalContext
import io.ktor.server.auth.oidc.OidcProvider
import io.ktor.server.auth.oidc.OidcToken
import io.ktor.server.auth.principal
import io.ktor.server.request.requireCookie
import io.ktor.server.routing.RoutingContext
import io.ktor.utils.io.ExperimentalKtorApi

fun HttpResponse.requireOkay(): HttpResponse {
    if (this.status != HttpStatusCode.OK)
        throw IllegalStateException("Response not okay.")
    return this;
}


/**
 * This function will automatically refresh tokens if the callback fails and rerun it.
 */
@OptIn(ExperimentalKtorApi::class)
context(principal: PrincipalContext<OidcToken.Id>)
suspend fun <V> RoutingContext.refreshRerunBoundary(provider: OidcProvider, callback: suspend RoutingContext.(accessToken: String) -> V): V? {
    return runCatching {
        callback(call.principal.accessToken)
    }.getOrNull() ?: run {
        val refreshedToken = call.principal.refreshToken?.let { provider.refreshToken(it) }
        val database = mongo().getCollection(
            "sessions",
            MongoSessionStorage.RealSession::class.java
        )

        if (refreshedToken == null)
            throw Error("refreshedToken is null")

        database.updateOne(
            Filters.eq(MongoSessionStorage.RealSession::sessionId.name, call.requireCookie("PLURALBUDDY_SESSION")),
            Updates.combine(
                listOf(
                    Updates.set("sessionData.refreshToken", refreshedToken.refreshToken),
                    Updates.set("sessionData.accessToken", refreshedToken.accessToken),
                    Updates.set("sessionData.value", refreshedToken.idToken!!.value)
                )
            ),
        )

        runCatching {
            callback(call.principal.accessToken)
        }.getOrNull()
    }
}