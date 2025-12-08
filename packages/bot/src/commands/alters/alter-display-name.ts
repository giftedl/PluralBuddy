/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

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

const options = {
	"alter-name": createStringOption({
		description: "The name of the alter to modify.",
		required: true,
		autocomplete: autocompleteAlters,
	}),
	"alter-new-name": createStringOption({
		description: "The new display name for the alter.",
		max_length: 100,
	}),
	"server-specific": createBooleanOption({
		description: "Is this display name specific to this server?",
		aliases: ["se"]
	}),
};

@Declare({
	name: "display-name",
	description: "Edit the display name of an alter",
	aliases: ["dn"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditAlterDisplayNameCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const {
			"alter-name": alterName,
			"alter-new-name": alterNewName,
			"server-specific": se,
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

		if (se && ctx.guildId === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

        if (se && alterNewName === undefined) {

			return await ctx.ephemeral({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(`\`\`\`
${alter.nameMap.find(c => c.server === (ctx.guildId ?? ""))?.name ?? alter.displayName}
\`\`\``),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			}, true);
        }

		if (alterNewName === undefined) {
			return await ctx.ephemeral({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(`\`\`\`
${alter.displayName}
\`\`\``),
					),
				],
				flags: MessageFlags.IsComponentsV2,
			}, true);
		}

		if (se) {
			// Server specific
			const nameMapHasServer = alter.nameMap.some(
				(nm) => nm.server === ctx.guildId,
			);

			if (nameMapHasServer) {
				// Update the name for this server using $[<identifier>] and pass arrayFilters outside $set
				await alterCollection.updateOne(
					{ alterId: Number(alter.alterId), systemId },
					{
						$set: {
							"nameMap.$[serverEntry].name": alterNewName as string,
						},
					},
					{
						arrayFilters: [{ "serverEntry.server": ctx.guildId }],
					},
				);
			} else {
				// Append a new mapping to the nameMap array
				await alterCollection.updateOne(
					{ alterId: Number(alter.alterId), systemId },
					{
						$push: {
							nameMap: {
								server: ctx.guildId as string,
								name: alterNewName as string,
							}
						}
					},
				);
			}
		} else {
			// Not server specific
			await alterCollection.updateOne(
				{ alterId: alter.alterId },
				{ $set: { displayName: alterNewName } },
			);
		}

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						[se ? "DN_SUCCESS_SS" : "DN_SUCCESS"].replace(
							"%alter%",
							alter.username,
						)
						.replace("%new-display%", alterNewName)
						.replace("%server%", (await ctx.guild())?.name ?? ""),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
