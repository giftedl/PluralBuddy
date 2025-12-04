/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, tagCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlterView } from "@/views/alters";
import { AlertView } from "@/views/alert";
import { TagView } from "@/views/tags";

export default class ConfigureAlter extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.ConfigureTag.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const tagId =
			InteractionIdentifier.Systems.Configuration.ConfigureTag.substring(
				ctx.customId,
			)[0];
		const systemId = ctx.author.id;
		const query = tagCollection.findOne({
			$and: [{ tagId }, { systemId }],
		});
		const tag = await query;

		if (tag === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.update({
			components: [
				...new TagView(ctx.userTranslations()).tagTopView(
					"general",
					tag.tagId,
					tag.tagFriendlyName,
				),
				...new TagView(ctx.userTranslations()).tagGeneral(tag, await ctx.getDefaultPrefix() ?? "pb;", 
				ctx.interaction.message.messageReference === undefined,),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
