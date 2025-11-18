/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { BaseErrorSubCommand } from "@/base-error-subcommand";
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	type CommandContext,
	Container,
	createBooleanOption,
	createStringOption,
	Declare,
	Options,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"alter-name": createStringOption({
		description: "The name of the alter to modify.",
		required: true,
		autocomplete: autocompleteAlters,
	}),
	"alter-description": createStringOption({
		description: "The new description for the alter.",
		max_length: 2000,
	}),
};

@Declare({
	name: "description",
	description: "Edit the description of an alter",
	aliases: ["desc", "d"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditAlterDisplayNameCommand extends BaseErrorSubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const {
			"alter-name": alterName,
			"alter-description": alterDescription,
		} = ctx.options;

		const systemId = ctx.author.id;
		const query = Number.isNaN(Number.parseInt(alterName))
			? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
			: alterCollection.findOne({
					$or: [{ username: alterName }, { alterId: Number(alterName) }],
					systemId,
				});
		const alter = await query;

		if (alter === null) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (alterDescription === undefined) {
			return await ctx.ephemeral({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(`\`\`\`
${alter.description}
\`\`\``),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			}, true);
		}

			await alterCollection.updateOne(
				{ alterId: alter.alterId },
				{ $set: { description: alterDescription } },
			);
		

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations().ALTER_SUCCESS_DESC.replace(
							"%alter%",
							alter.username,
						),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
