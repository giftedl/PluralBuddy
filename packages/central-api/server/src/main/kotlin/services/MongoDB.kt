package app.pluralbuddy.services

import app.pluralbuddy.util.db.connectToMongoDB
import com.mongodb.client.MongoDatabase
import io.ktor.server.application.Application

var mongoClient: MongoDatabase? = null;

fun Application.configureMongo() {
    val mongoDatabase = connectToMongoDB()

    mongoClient = mongoDatabase;
}

fun Application.mongo(): MongoDatabase {
    return mongoClient!!;
}