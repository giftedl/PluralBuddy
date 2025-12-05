/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { AutoLoad, Command, Options, type CommandContext, createStringOption, Declare, createBooleanOption, ActionRow, Button } from "seyfert";
import { alterCollection } from "../mongodb";
import { AlterView } from "../views/alters";
import { AlertView } from "../views/alert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    "alter-name": createStringOption({
        description: "Name of the alter to query. You can use `<user-id>/<alter>` for alters from other systems.",
        required: true
    }),
    public: createBooleanOption({
        description: 'Do you want to expose this publicly? (non-ephemeral)',
        flag: true
    })
}

@Declare({
	name: "alter",
	description: "Query an alter",
    aliases: ["a", "m", "member"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class SystemCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
        const { "alter-name": alterName } = ctx.options;
        const systemId = ctx.author.id;

        let query = null;
        const userAlterMatch = /^(\d+)\/(.+)$/.exec(alterName);
        if (userAlterMatch) {
            // If format is <user-id>/<alter>, query from another system
            const [_, otherSystemId, otherAlterName] = userAlterMatch;
            query = alterCollection.findOne({
                $or: [
                    { username: otherAlterName },
                    { alterId: Number(otherAlterName) }
                ],
                systemId: otherSystemId
            });
        } else {
            // Otherwise, query for current user's alters
            query = Number.isNaN(Number.parseInt(alterName))
                ? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
                : alterCollection.findOne({ $or: [{ username: alterName }, { alterId: Number(alterName) }], systemId });
        }
        const alter = await query;

        if (alter === null && userAlterMatch) {
            return await ctx.ephemeral({
                components: [
                    ...new AlertView(ctx.userTranslations()).errorView("INVISIBLE_ALTER")
                ],
                flags: MessageFlags.IsComponentsV2 + (ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
                allowed_mentions: { parse: [] }
            }, true)
        }

        if (alter === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.ephemeral({
            components: [
                ...(await new AlterView(ctx.userTranslations()).alterProfileView(alter, alter.systemId !== ctx.author.id)),
                ...(alter.systemId === ctx.author.id ? new AlterView(ctx.userTranslations()).alterConfigureButton(alter) : [])
            ],
            flags: MessageFlags.IsComponentsV2 + (ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
            allowed_mentions: { parse: [] }
        }, true)
        
    }
}