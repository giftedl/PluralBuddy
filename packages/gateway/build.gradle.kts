
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(ktorLibs.plugins.ktor)
    alias(libs.plugins.kotlin.serialization)
}

group = "app.pluralbuddy"
version = "1.0.0-SNAPSHOT"

application {
    mainClass = "io.ktor.server.netty.EngineMain"
}

kotlin {
    jvmToolchain(21)
}
dependencies {
    implementation(ktorLibs.serialization.kotlinx.json)
    implementation(ktorLibs.server.config.yaml)
    implementation(ktorLibs.server.contentNegotiation)
    implementation(ktorLibs.server.core)
    implementation(ktorLibs.server.netty)
    implementation(ktorLibs.server.websockets)
    implementation(libs.hayden.khealth)
    implementation(libs.logback.classic)

    implementation("org.mongodb:mongodb-driver-core:5.9.0")
    implementation("org.mongodb:mongodb-driver-sync:5.9.0")
    implementation("org.mongodb:bson:5.9.0")
    implementation("com.github.dotenv-org:dotenv-vault-kotlin:0.0.2")

    testImplementation(kotlin("test"))
    testImplementation(ktorLibs.server.testHost)
}

application {
    mainClass = "app.pluralbuddy.MainKt"
}