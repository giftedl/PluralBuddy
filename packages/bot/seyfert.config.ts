import { config } from "seyfert";
 
export default config.bot({
    token: process.env.BOT_TOKEN ?? "",
    locations: {
        base: "src",
        commands: "commands",
        components: "components",
        events: "events"
    },
    intents: ["Guilds", "MessageContent", "GuildMessages", "GuildWebhooks", "DirectMessages", "GuildMessageReactions"]
});