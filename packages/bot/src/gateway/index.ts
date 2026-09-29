import { build, client } from "..";
import { type AuthenticatedSessionPacket, AuthenticationPacket } from "./packets/authenticationPacket";
import type { BasePacket } from "./packets/basePacket";
import { PingPacket, type PongPacket } from "./packets/pingPacket";

export class PluralBuddyGateway {
    apiKey: string;
    websocket: WebSocket;
    lastPing: number = 100;
    authenticationState: boolean = false;

    constructor(apiKey: string) {
        this.apiKey = apiKey;

        if (!process.env.GATEWAY_LOCATION)
            throw new Error("Gateway location is not specified.")

        this.websocket = new WebSocket(process.env.GATEWAY_LOCATION)
    }

    waitToOpen() {
        return new Promise<void>((r, e) => { this.websocket.addEventListener("open", () => r()); this.websocket.addEventListener("error", (r) => e(r)) })
    }

    authenticate() {
        return new Promise<void>((r) => {
            const toResolve = (information: Bun.BunMessageEvent<any>) => {
                console.log("info", information)
                const parsedData = JSON.parse(information.data) as BasePacket

                if (parsedData.$ === "app.pluralbuddy.packets.AuthenticatedSessionPacket" && (parsedData as AuthenticatedSessionPacket).success) {
                    this.authenticationState = true;

                    this.websocket.removeEventListener("message", toResolve)
                    return r()
                }

            }

            this.websocket.addEventListener("message", toResolve)
            this.websocket.send(AuthenticationPacket(this.apiKey, `PluralBuddy ${build}`))
        })
    }

    heartbeat() {
        let ponged = false;

        const toResolve = (information: Bun.BunMessageEvent<any>) => {
            console.log("info", information)
            const parsedData = JSON.parse(information.data) as BasePacket

            if (parsedData.$ === "app.pluralbuddy.packets.PongPacket") {
                this.lastPing = (parsedData as PongPacket).msSince
                client.logger.info("(Ping/Pong) Pong! (Server -> Client)", this.lastPing)
                ponged = true;
                this.websocket.removeEventListener("message", toResolve)

                setTimeout(() => {
                    this.heartbeat()
                }, 10000);
            }

        }

        if (this.authenticationState) {
            this.websocket.addEventListener("message", toResolve)
            client.logger.info("(Ping/Pong) Ping! (Client -> Server)")
            this.websocket.send(PingPacket())

            setTimeout(() => {
                if (ponged === false) {
                    client.logger.warn("Ping hasn't succeed in 2 seconds? Is the gateway down?")

                    setTimeout(async () => {
                        if (ponged === false) {
                            client.logger.warn("Ping hasn't succeed in 10 seconds. Attempting to reconnect...")

                            this.websocket = new WebSocket(process.env.GATEWAY_LOCATION ?? "")

                            client.logger.info("Starting gateway")
                            const gateway = new PluralBuddyGateway(process.env.GATEWAY_TOKEN ?? "");
                            client.logger.info("Waiting for stream to open...")
                            await gateway.waitToOpen().catch(v => {
                                client.logger.fatal(`Process cannot continue if gateway is not properly connected. Exiting.`)
                                client.logger.fatal(v)
                                process.exit();
                            })
                            client.logger.info("Authenticating...")
                            await gateway.authenticate()
                            gateway.heartbeat()
                            client.logger.info("Authenticated w/ PluralBuddy Gateway")
                        }
                    }, 8000);
                }
            }, 2000);
        }
    }
}