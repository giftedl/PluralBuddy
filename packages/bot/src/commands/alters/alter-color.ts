/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Attachment, type CommandContext, Container, createStringOption, Declare, MediaGallery, MediaGalleryItem, Options, type OKFunction } from "seyfert";
import { SubCommand } from "seyfert"
import { alterCollection } from "../../mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../views/alert";
import { autocompleteAlters } from "../../lib/autocomplete-alters";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-color": createStringOption({
        description: "The color to use for the alter. (leave blank to clear)",
        value(data, ok: OKFunction<string>, fail) {
            if (!/^#[0-9A-F]{6}$/i.test(data.value))
                fail("This is not a valid hex color.")
            ok(data.value)
        },
    })
}

@Declare({
	name: "color",
	description: "Set an alter's color.",
    aliases: ["c"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class EditAlterColorCommand extends SubCommand {

	override async run(ctx: CommandContext<typeof options>) {
        const { "alter-name": alterName, "alter-color": color } = ctx.options;
        const systemId = ctx.author.id;

        const alter = ctx.contextAlter() ?? await (Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId }))

        if (alter === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        if (color === undefined) {
            await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { color: null }})

            return await ctx.write({
                components: [
                    ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().COLOR_SUCCESS
                        .replace("%alter%", alter.username))
                ],
                flags: MessageFlags.IsComponentsV2
    
            })
        }

        await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { color }})

        return await ctx.write({
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().COLOR_SUCCESS
                    .replace("%alter%", alter.username))
            ],
            flags: MessageFlags.IsComponentsV2

        })
    }
}