import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { userCollection } from "@/mongodb";
import type { PAutoProxy } from "@/types/auto-proxy";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";

export default class OffAutoProxy extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Selection.AutoProxyModes.Off.startsWith(
			context.interaction.values[0] as string,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
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

		const existingGuildPolicies = system.systemAutoproxy.some(
			(ap) => ap.serverId === guild?.id,
		);

		if (existingGuildPolicies) {
			await userCollection.updateOne(
				{ userId: system.associatedUserId },
				{
					$set: {
						"system.systemAutoproxy.$[serverEntry].autoproxyMode": "off",
                        "system.systemAutoproxy.$[serverEntry].autoproxyAlter": null
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
							autoproxyMode: "off",
							autoproxyAlter: undefined,
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
			"off",
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SET_AUTO_PROXY.replaceAll("%server_name%", guild?.name ?? "??")
					.replaceAll("%mode%", "off"),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
