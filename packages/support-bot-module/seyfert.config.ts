<<<<<<< HEAD
/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ import { config } from "seyfert";

=======
/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */import { config } from "seyfert";
 
>>>>>>> 2bc1cfa15f9539ae844af4a92ea7b0715d42df63
export default config.bot({
  token: process.env.BOT_TOKEN ?? "",
  locations: {
    base: "src",
    commands: "commands",
    components: "components",
  },
  intents: ["Guilds", "MessageContent", "GuildMessages", "GuildWebhooks", "DirectMessages"],
});
