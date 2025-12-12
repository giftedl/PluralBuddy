import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { SystemSettingsView } from "@/views/system-settings";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";

export default class PublicProfileBtn extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.PublicProfile.Index.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

        console.log("...")

		return await ctx.update({
			components: [
				...new SystemSettingsView(ctx.userTranslations()).topView(
					"public-settings",
					user.system.associatedUserId,
				),
				...new SystemSettingsView(ctx.userTranslations()).publicProfile(
					user.system,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction.message.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
