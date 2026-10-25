/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
	type CommandContext,
	Container,
	createBooleanOption,
	createStringOption,
	Declare,
	Options,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { writeBack } from "@/lib/pk-sync-engine";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { w } from "@/webhooks";

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
export default class EditAlterDisplayNameCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { "alter-name": alterName, "alter-pronouns": alterPronouns } =
			ctx.options;

		const systemId = ctx.author.id;
		const alter =
			ctx.contextAlter() ??
			(await (Number.isNaN(Number.parseInt(alterName))
				? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
				: alterCollection.findOne({
						$or: [{ username: alterName }, { alterId: Number(alterName) }],
						systemId,
					})));

		if (alter === null) {
			return await ctx.ephemeral(
				{
					components: new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_ALTER_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		if (alterPronouns === undefined) {
			return await ctx.ephemeral(
				{
					components: [
						new Container().setComponents(
							new TextDisplay().setContent(`\`\`\`
${alter.pronouns ?? "⛔ Your alter has no pronouns."}
\`\`\``),
						),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				},
				true,
				undefined,
				ctx,
			);
		}

		await alterCollection.updateOne(
			{ $and: [{ alterId: alter.alterId }, { systemId: systemId }] },
			{ $set: { pronouns: alterPronouns } },
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				pronouns: alterPronouns,
			},
		});
		if (alter.fields["@/converter/pk"])
			writeBack({
				type: "alter",
				id: alter.fields["@/converter/pk"],
				change: { pronouns: alterPronouns },
				syncConfig: (await ctx.retrievePUser()).syncConfiguration,
			});

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).ALTER_SUCCESS_PRONOUNS.replace(
						"%alter%",
						alter.username,
					).replace("%new%", alterPronouns),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
