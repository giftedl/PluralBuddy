/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, User, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlterView } from "@/views/alters";
import { AlertView } from "@/views/alert";

export default class ConfigureAlter extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.ConfigureAlter.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.ConfigureAlter.substring(
				ctx.customId,
			)[0];
		const systemId = ctx.author.id;
		const query = alterCollection.findOne({
			$and: [{ alterId: Number(alterId) }, { systemId }],
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
					"general",
					alter.alterId.toString(),
					alter.username,
				),
				...await new AlterView(ctx.userTranslations()).alterGeneralView(alter,  ctx.guildId),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
