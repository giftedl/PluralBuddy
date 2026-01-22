import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { GuildFlags, PGuildObject } from "plurography";
import { ServerConfigView } from "@/views/server-cfg";
import { MessageFlags } from "seyfert/lib/types";

export default class ToggleFeatureFlag extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.FeaturesTab.ToggleFeature.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {

        const featureFlag = InteractionIdentifier.Guilds.FeaturesTab.ToggleFeature.substring(ctx.customId)[0]

        if (!featureFlag) throw new Error("No feature flag.")

        // @ts-ignore
        const flagParsed = GuildFlags[featureFlag];

		const guildObj = await ctx.retrievePGuild();
        const nativeGuild = await ctx.guild()
        const newValue = !guildObj.getFeatures().has(flagParsed);

		guildObj.flags = guildObj.getFeatures().bool(flagParsed, newValue);

        if (!nativeGuild) throw new Error("What.")

		await guildCollection.updateOne(
			{ guildId: ctx.guildId },
			{ $set: { flags: guildObj.flags } },
			{ upsert: true },
		);

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"features",
					guildObj.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).featuresTab(
					PGuildObject.parse(guildObj),
                    nativeGuild
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
    }
}
