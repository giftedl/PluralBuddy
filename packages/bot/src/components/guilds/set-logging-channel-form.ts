import {
	ComponentCommand,
	Middlewares,
	ModalCommand,
	ModalContext,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class GuildPrefixesForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.LoggingChannelForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const guildObj = await ctx.retrievePGuild();
		const newChannel = (
			ctx.interaction.getInputValue(
				InteractionIdentifier.Guilds.FormSelection.LoggingChannelSelection.create(),
				true,
			) as string[]
		);

		guildObj.logChannel = newChannel[0];

		await guildCollection.updateOne(
			{ guildId: ctx.guildId },
			{ $set: { logChannel: newChannel[0] }},
			{ upsert: true },
		);

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"general",
					guildObj.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).generalSettings(
					guildObj,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
