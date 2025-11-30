
import { Client } from "seyfert";
import SupportBuddyHandleCommand from "./handle-command";
import { setupDatabases, setupMongoDB } from "./mongodb";

export const client = new Client({
    commands: {
        prefix: () => {
            return ["?!"]
        },
		reply: (ctx) => true,
    }
});

await setupMongoDB();
await setupDatabases();

await client.start();
await client.uploadCommands({ cachePath: "./commands.json" });

client.setServices({
	handleCommand: SupportBuddyHandleCommand,
})