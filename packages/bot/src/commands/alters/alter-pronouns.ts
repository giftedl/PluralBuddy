/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

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
	"alter-pronouns": createStringOption({
		description: "The new pronouns for the alter.",
		max_length: 100,
	}),
};

@Declare({
	name: "pronouns",
	description: "Edit the pronouns of an alter",
	aliases: ["pn"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditAlterDisplayNameCommand extends BaseErrorSubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const {
			"alter-name": alterName,
			"alter-pronouns": alterPronouns,
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

		if (alterPronouns === undefined) {
			return await ctx.ephemeral({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(`\`\`\`
${alter.pronouns}
\`\`\``),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			}, true);
		}

			await alterCollection.updateOne(
				{ alterId: alter.alterId },
				{ $set: { pronouns: alterPronouns } },
			);
		

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations().ALTER_SUCCESS_PRONOUNS.replace(
							"%alter%",
							alter.username,
						)
						.replace("%new%", alterPronouns),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
