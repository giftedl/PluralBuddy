import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { Middlewares, ModalCommand, ModalContext, type AllChannels } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class RemoveCategoryForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.RemoveBlacklistCategoryForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const categoryId =
			(ctx.interaction.getInputValue(
				InteractionIdentifier.Guilds.FormSelection.RemoveBlacklistCategorySelection.create(),
			) as string);
		const pluralGuild = await ctx.retrievePGuild();

		pluralGuild.blacklistedCategories = pluralGuild.blacklistedCategories.filter((c) => c !== categoryId);

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $pull: { blacklistedCategories: categoryId } },
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
