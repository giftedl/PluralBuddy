import { ActionRow, Button, ComponentCommand, ComponentContext } from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { tagCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

export default class ConfigureAlter extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Tags.AssureDeleteTag.startsWith(
			context.customId,
		);
	}
	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const tagId =
			InteractionIdentifier.Systems.Configuration.Tags.AssureDeleteTag.substring(
				ctx.customId,
			)[0];

		const systemId = ctx.author.id;
		const query = tagCollection.findOne({
			tagId,
			systemId,
		});
		const tag = await query;

		if (tag === null) {
			return await ctx.interaction.update({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		await tagCollection.deleteOne({ tagId: tag.tagId });
		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{ $pull: { "system.tagIds": tag.tagId } },
		);

		return await ctx.interaction.update({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).SUCCESSFULLY_DELETED_TAG.replace(
						"{{ tag }}",
						tag.tagFriendlyName,
					),
				),
				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
						)
						.setLabel((await ctx.userTranslations()).TOP_BACK_LABEL)
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.wrenchWhite),
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
