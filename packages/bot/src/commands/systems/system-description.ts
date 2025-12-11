/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { SubCommand } from "seyfert"
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
import { createSystemOperation } from "@/lib/system-operation";

const options = {
	"system-description": createStringOption({
		description: "The new description for the system.",
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
export default class EditAlterDisplayNameCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const {
			"system-description": systemDescription,
		} = ctx.options;

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (systemDescription === undefined) {
			return await ctx.ephemeral({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(`\`\`\`
${user.system.systemDescription ?? "⛔ Your system has no description."}
\`\`\``),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			}, true);
		}
		
		await createSystemOperation(user.system, { systemDescription }, ctx.userTranslations(), "discord")

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations().ALTER_SUCCESS_DESC.replace(
							"@%alter%",
							"your system",
						),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
