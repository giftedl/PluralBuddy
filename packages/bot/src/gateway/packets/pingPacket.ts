import type { BasePacket } from "./basePacket";

export interface PingPacket extends BasePacket {
    $: "app.pluralbuddy.packets.PingPacket",
    now: number
} 

export interface PongPacket extends BasePacket {
    $: "app.pluralbuddy.packets.PongPacket",
    msSince: number;
}

export function PingPacket() {
    return JSON.stringify({ $: "app.pluralbuddy.packets.PingPacket", now: Date.now() })
}

