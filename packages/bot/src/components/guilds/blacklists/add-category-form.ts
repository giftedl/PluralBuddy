import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { Middlewares, ModalCommand, ModalContext, type AllChannels } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class AddChannelForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.AddBlacklistCategoryForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const newCategory =
			(ctx.interaction.getInputValue(
				InteractionIdentifier.Guilds.FormSelection.AddBlacklistCategorySelection.create(),
			) as string);
		const pluralGuild = await ctx.retrievePGuild();

		pluralGuild.blacklistedCategories = [newCategory,  ...pluralGuild.blacklistedCategories];

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $push: { blacklistedCategories: newCategory } },
		);
		ctx.client.cache.pguild.remove(pluralGuild.guildId)

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"general",
					pluralGuild.guildId,
				),
				...await new ServerConfigView(ctx.userTranslations()).generalSettings(
					pluralGuild,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
