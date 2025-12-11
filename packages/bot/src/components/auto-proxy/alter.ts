/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import type { PAutoProxy } from "@/types/auto-proxy";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";

export default class AlterAutoProxySelectMenu extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Selection.AutoProxyModes.Alter.startsWith(
			context.interaction.values[0] as string,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const [alterId] =
			InteractionIdentifier.Selection.AutoProxyModes.Alter.substring(
				ctx.interaction.values[0] ?? "",
			);
		const { system } = await ctx.retrievePUser();
		const guild = await ctx.guild();

		if (guild === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const systemId = ctx.author.id;
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		const alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const existingGuildPolicies = system.systemAutoproxy.some(
			(ap) => ap.serverId === guild?.id,
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
			"alter",
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SET_AUTO_PROXY.replaceAll("%server_name%", guild?.name ?? "??")
					.replaceAll("%mode%", "alter"),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
