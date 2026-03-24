import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import type { PAutoProxy } from "@/types/auto-proxy";

export default class OffDMsButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.AutoProxy.Off.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        const [ guildId ] = InteractionIdentifier.Systems.AutoProxy.Off.substring(ctx.customId);
		if (guildId === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const { system } = await ctx.retrievePUser();
		const guild = await ctx.client.guilds.fetch(guildId);

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

        await ctx.interaction.message.delete();

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
