import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ServerConfigView } from "@/views/server-cfg";
import { Middlewares, ModalCommand, ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class SetProxyDelayForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.SetProxyDelayForm.startsWith(
			context.customId,
		);
	}
	override async run(ctx: ModalContext) {
		const proxyDelay = Number(ctx.interaction.getInputValue(
			InteractionIdentifier.Guilds.FormSelection.SetProxyDelaySelection.create(),
            true
		));
		const guild = await ctx.retrievePGuild();

        if (Number.isNaN(proxyDelay) || proxyDelay > 2.5 || proxyDelay < 0) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_INVALID_NUMBER"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

		await guildCollection.updateOne(
			{ guildId: guild.guildId },
			{
				$set: { proxyDelay: proxyDelay * 1000 },
			},
		);
		ctx.client.cache.pguild.remove(guild.guildId)
        
        guild.proxyDelay = proxyDelay * 1000;

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"general",
					guild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).generalSettings(
					guild,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
