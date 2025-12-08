/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

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
	"first-alter": createStringOption({
		description: "The alter to latch onto first.",
		autocomplete: autocompleteAlters,
	}),
};

@Declare({
	name: "latch",
	description: "Use latch mode in auto-proxy",
	aliases: ["l", "lch"],
	contexts: ["Guild"],
})
@Options(options)
export default class AlterProxyMode extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "first-alter": alterName } = ctx.options;

		const systemId = ctx.author.id;
		let alter = null;
		const { system } = await ctx.retrievePUser();

		if (alterName) {
			const query = Number.isNaN(Number.parseInt(alterName))
				? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
				: alterCollection.findOne({
						$or: [{ username: alterName }, { alterId: Number(alterName) }],
						systemId,
					});
			alter = await query;

			if (alter === null || system === undefined) {
				return await ctx.write({
					components: new AlertView(ctx.userTranslations()).errorView(
						"ERROR_ALTER_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			}
		}
		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
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
						"system.systemAutoproxy.$[serverEntry].autoproxyMode": "latch",
						...(alter !== null
							? {
									"system.systemAutoproxy.$[serverEntry].autoproxyAlter":
										alter.alterId.toString(),
								}
							: {
									"system.systemAutoproxy.$[serverEntry].autoproxyAlter": null,
								}),
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
							autoproxyMode: "latch",
							...(alter !== null
								? {
										autoproxyAlter: alter.alterId.toString(),
									}
								: {}),
							serverId: ctx.guildId,
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
			"latch",
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SET_AUTO_PROXY.replaceAll("%server_name%", guild.name)
					.replaceAll("%mode%", "latch"),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
