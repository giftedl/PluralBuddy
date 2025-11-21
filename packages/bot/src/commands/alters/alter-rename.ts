/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, createStringOption, Declare, type OKFunction, Options } from "seyfert";
import { SubCommand } from "seyfert"
import { alterCollection } from "../../mongodb";
import { AlertView } from "../../views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { getUserById } from "../../types/user";
import type { Document } from "mongodb";
import { autocompleteAlters } from "../../lib/autocomplete-alters";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter to modify.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-new-name": createStringOption({
        description: "The new username for the alter.",
        required: true,
        max_length: 20,
        value: (data, ok: OKFunction<string>, no) => {
            if (data.value.includes(" "))
                no("contains a space; yet usernames do not contain a space")
            ok(data.value);
        }
    })
}


@Declare({
	name: "rename",
	description: "Modify the username of an alter",
    aliases: ["name", "rn", "n"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class EditAlterNameCommand extends SubCommand {

	override async run(ctx: CommandContext<typeof options>) {

        const { "alter-name": alterName, "alter-new-name": alterNewName } = ctx.options;
        const systemId = ctx.author.id;
        const query = Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId })
        const alter = await query;

        if (alter === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { username: alterNewName }})

        return await ctx.write({
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().RENAME_SUCCESS
                    .replace("%alter%", alter.username))
            ],
            flags: MessageFlags.IsComponentsV2

        })
    }
}