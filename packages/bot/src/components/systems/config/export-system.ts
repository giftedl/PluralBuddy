/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	AttachmentBuilder,
	ComponentCommand,
	type ComponentContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { buildExportPayload } from "@/lib/export";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";

export default class ExportSystemButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.GeneralTab.ExportSystem.equals(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.write({
			components: new LoadingView(await ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editOrReply({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await ctx.followup({
			files: [
				new AttachmentBuilder()
					.setName("system.json")
					.setFile(
						"buffer",
						Buffer.from(await buildExportPayload(user.system)),
					),
			],
			flags: MessageFlags.Ephemeral,
		});

		return await ctx.editOrReply({
			components: new AlertView(await ctx.userTranslations()).successView(
				"SYSTEM_EXPORT_FINISHED",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
