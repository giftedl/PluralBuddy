/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */import { config } from "seyfert";
 
export default config.bot({
    token: process.env.BOT_TOKEN ?? "",
    locations: {
        base: "src",
        commands: "commands",
        components: "components"
    },
    intents: ["Guilds", "MessageContent", "GuildMessages", "GuildWebhooks", "DirectMessages"]
});