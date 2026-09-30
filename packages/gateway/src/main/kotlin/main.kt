package app.pluralbuddy

import app.pluralbuddy.database.BotClientManager

const val version = "0.11"
val botManager = BotClientManager();

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}
