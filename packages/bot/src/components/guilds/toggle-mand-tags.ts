import { ComponentCommand, Middlewares, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { GuildFlags, PGuildObject } from "plurography";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class ToggleMandatoryTags extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.ToggleSystemTagRequirement.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {

		const guildObj = await ctx.retrievePGuild();
        const nativeGuild = await ctx.guild()
        const newValue = !guildObj.getFeatures().requiresGuildTag;

		guildObj.flags = guildObj.getFeatures().bool(GuildFlags.MANDATORY_GUILD_TAG, newValue);

        if (!nativeGuild) throw new Error("What.")

		await guildCollection.updateOne(
			{ guildId: ctx.guildId },
			{ $set: { flags: guildObj.flags } },
			{ upsert: true },
		);
		ctx.client.cache.pguild.remove(guildObj.guildId)

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"general",
					guildObj.guildId,
				),
				...await new ServerConfigView(ctx.userTranslations()).generalSettings(
					PGuildObject.parse(guildObj),
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
    }
}
