package app.pluralbuddy.services

import app.pluralbuddy.types.HTTPError
import app.pluralbuddy.types.HTTPErrorResponse
import app.pluralbuddy.types.errors.InternalServerError
import app.pluralbuddy.types.errors.UnauthorizedError
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*

fun Application.configureStatusPages() {
    install(StatusPages) {
        exception<Throwable> { call, cause ->
            cause.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError,
                HTTPErrorResponse(errors = listOf(InternalServerError())) )
        }
        status(HttpStatusCode.Unauthorized) { call, status ->
            call.respond(status,
                HTTPErrorResponse(errors = listOf(UnauthorizedError())))
        }
    }
}
