import { build } from "..";
import { type AuthenticatedSessionPacket, AuthenticationPacket } from "./packets/authenticationPacket";
import type { BasePacket } from "./packets/basePacket";

export class PluralBuddyGateway {
    apiKey: string;
    websocket: WebSocket;
    authenticationState: boolean = false;

    constructor(apiKey: string) {
        this.apiKey = apiKey;

        if (!process.env.GATEWAY_LOCATION)
            throw new Error("Gateway location is not specified.")
    
        this.websocket = new WebSocket(process.env.GATEWAY_LOCATION)
    }

    waitToOpen() {
        return new Promise<void>((r) => this.websocket.addEventListener("open", () => r()))
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

}