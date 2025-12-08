/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { alterCollection, userCollection } from "@/mongodb";
import type { PAutoProxy } from "@/types/auto-proxy";
import { AlertView } from "@/views/alert";
import {
	CommandContext,
	createStringOption,
	Declare,
	SubCommand,
	Options,
	User,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	alter: createStringOption({
		description: "The alter to automatically proxy.",
		autocomplete: autocompleteAlters,
		required: true,
	}),
};

@Declare({
	name: "alter",
	description: "Use alter mode in auto-proxy",
	aliases: ["a"],
	contexts: ["Guild"],
})
@Options(options)
export default class AlterProxyMode extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { alter: alterName } = ctx.options;

		const systemId = ctx.author.id;
		const query = Number.isNaN(Number.parseInt(alterName))
			? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
			: alterCollection.findOne({
					$or: [{ username: alterName }, { alterId: Number(alterName) }],
					systemId,
				});
		const alter = await query;
		const { system } = await ctx.retrievePUser();

		if (alter === null || system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const guild = await ctx.guild();

		if (guild === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const existingGuildPolicies = system.systemAutoproxy.some(
			(ap) => ap.serverId === guild.id,
		);

		if (existingGuildPolicies) {
			await userCollection.updateOne(
				{ userId: system.associatedUserId },
				{
					$set: {
						"system.systemAutoproxy.$[serverEntry].autoproxyMode": "alter",
						"system.systemAutoproxy.$[serverEntry].autoproxyAlter":
							alter.alterId.toString(),
					},
				},
				{
					arrayFilters: [{ "serverEntry.serverId": ctx.guildId }],
				},
			);
		} else {
			// Append a new mapping to the nameMap array
			await userCollection.updateOne(
				{ userId: system.associatedUserId },
				{
					$push: {
						"system.systemAutoproxy": {
							autoproxyMode: "alter",
							autoproxyAlter: alter.alterId.toString(),
                            serverId: ctx.guildId
						} satisfies Partial<PAutoProxy>,
					},
				},
			);
		}

		await sendAutoproxyOperationDM(
			system,
			guild,
			ctx.userTranslations(),
			"discord",
			"alter",
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SET_AUTO_PROXY.replaceAll("%server_name%", guild.name)
					.replaceAll("%mode%", "alter"),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
