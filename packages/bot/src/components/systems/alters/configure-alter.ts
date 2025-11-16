/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ComponentCommand,
	Container,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "../../../views/system-settings";
import { AlertView } from "../../../views/alert";
import { alterCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";

export default class ConfigureAlter extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Alters.ConfigureAlter.startsWith(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		const originalUserId =
			ctx.interaction.message.referencedMessage?.author.id ??
			ctx.interaction.message.interactionMetadata?.user.id;
		const alterId =
			InteractionIdentifier.Systems.Configuration.ConfigureAlter.substring(
				ctx.customId,
			)[0];

		if (ctx.author.id !== originalUserId) {
			return ctx.write({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(
							"You are not the original recipient of the message.",
						),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
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

		return await ctx.update({
			components: [
				...new AlterView(ctx.userTranslations()).alterTopView(
					"public-settings",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(ctx.userTranslations()).altersPublicView(
					alter,
					(await ctx.guild()) ?? { name: "", id: "" },
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
