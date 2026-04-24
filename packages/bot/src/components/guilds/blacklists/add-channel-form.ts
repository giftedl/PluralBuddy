import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { Middlewares, ModalCommand, ModalContext, type AllChannels } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class AddChannelForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.AddBlacklistChannelForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const newChannels =
			(ctx.interaction.getChannels(
				InteractionIdentifier.Guilds.FormSelection.AddBlacklistChannelSelection.create(),
			) as AllChannels[]).map(v => v.id) ?? [];
		const pluralGuild = await ctx.retrievePGuild();

		pluralGuild.blacklistedChannels = newChannels;

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $set: { blacklistedChannels: newChannels } },
			{ upsert: true }
		);
		ctx.client.cache.pguild.remove(pluralGuild.guildId)

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView((await ctx.userTranslations())).topView(
					"general",
					pluralGuild.guildId,
				),
				...await new ServerConfigView((await ctx.userTranslations())).generalSettings(
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
