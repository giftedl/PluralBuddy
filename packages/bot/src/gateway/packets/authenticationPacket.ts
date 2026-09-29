import type { BasePacket } from "./basePacket";

export interface AuthenticationPacket extends BasePacket {
    $: "app.pluralbuddy.packets.AuthenticationPacket",
    token: string;
    userAgent: string;
} 

export interface AuthenticatedSessionPacket extends BasePacket {
    $: "app.pluralbuddy.packets.AuthenticatedSessionPacket",
    success: true;
}

export function AuthenticationPacket(token: string, userAgent: string) {
    return JSON.stringify({ $: "app.pluralbuddy.packets.AuthenticationPacket", token, userAgent })
}

