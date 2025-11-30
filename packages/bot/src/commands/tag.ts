/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";
import { createBooleanOption } from "seyfert";
import { Command, type CommandContext, createStringOption, Declare, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    "tag-name": createStringOption({
        description: "Name of the tag to query. You can use `<user-id>/<tag>` for tags from other systems.",
        required: true
    }),
    public: createBooleanOption({
        description: 'Do you want to expose this publicly? (non-ephemeral)',
        flag: true
    })
}

@Declare({
	name: "tag",
	description: "Query a tag",
    aliases: ["t"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class TagCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
        const { "tag-name": tagFriendlyName } = ctx.options;
        const systemId = ctx.author.id;

        let query = null;
        const userTagMatch = /^(\d+)\/(.+)$/.exec(tagFriendlyName);
        if (userTagMatch) {
            // If format is <user-id>/<tag>, query from another system
            const [_, otherSystemId, otherAlterName] = userTagMatch;
            query = tagCollection.findOne({
                $or: [
                    { tagFriendlyName: otherAlterName },
                    { tagId: otherAlterName }
                ],
                systemId: otherSystemId
            });
        } else {
            // Otherwise, query for current user's tags
            query = Number.isNaN(Number.parseInt(tagFriendlyName))
                ? tagCollection.findOne({ $or: [{ tagFriendlyName: tagFriendlyName }], systemId })
                : tagCollection.findOne({ $or: [{ tagFriendlyName: tagFriendlyName }, { tagId: tagFriendlyName }], systemId });
        }
        const tag = await query;
        
        if (tag === null && userTagMatch) {
            return await ctx.ephemeral({
                components: [
                    ...new AlertView(ctx.userTranslations()).errorView("INVISIBLE_TAG")
                ],
                flags: MessageFlags.IsComponentsV2 + (ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
                allowed_mentions: { parse: [] }
            }, true)
        }

        if (tag === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_TAG_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.ephemeral({
            components: [
                ...(new TagView(ctx.userTranslations()).tagProfileView(tag, tag.systemId !== ctx.author.id)),
                ...(tag.systemId === ctx.author.id ? new TagView(ctx.userTranslations()).tagConfigureButton(tag) : [])
            ],
            flags: MessageFlags.IsComponentsV2 + (ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
            allowed_mentions: { parse: [] }
        }, true)

    }

}