import { Client, MemoryAdapter } from "seyfert";

const client = new Client();

client.setServices({
    cache: {
        disabledCache: {
            channels: true,
            overwrites: true,
            bans: true,
            emojis: true,
            members: true,
            messages: true,
            presences: true,
            roles: true,
            stageInstances: true,
            stickers: true,
            users: true,
            voiceStates: true,
            // enabled
            onPacket: false,
            guilds: false
        },
        adapter: new MemoryAdapter()
    }
});

export function startDiscordBot() {

    client.start();

}