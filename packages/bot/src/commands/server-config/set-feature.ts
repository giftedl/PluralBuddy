import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { friendlyFeatureIndex, ServerConfigView } from "@/views/server-cfg";
import { GuildFlags } from "plurography";
import {
	CommandContext,
	createStringOption,
	Declare,
	IgnoreCommand,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	feature: createStringOption({
		description: "What feature to enable/disable",
		required: true,
		choices: Object.entries(friendlyFeatureIndex).map((c) => ({
			name: c[1].title,
			value: c[0],
		})),
	}),
	set: createStringOption({
		description: "What to set it to",
		choices: [
			{ name: "on", value: "on" },
			{ name: "off", value: "off" },
		],
		required: true,
	}),
};

@Declare({
	name: "set-feature",
	description: "Disable/enable a feature on PluralBuddy.",
	aliases: ["log", "channel"],
	ignore: IgnoreCommand.Message,
})
@Middlewares(["ensureGuildPermissions"])
@Options(options)
export default class SetLogChannel extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const featureFlag = ctx.options.feature;

		if (!featureFlag) throw new Error("No feature flag.");

		// @ts-ignore
		const flagParsed = GuildFlags[featureFlag];

		const guildObj = await ctx.retrievePGuild();
		const nativeGuild = await ctx.guild();
		const newValue = ctx.options.set === "on";

		guildObj.flags = guildObj.getFeatures().bool(flagParsed, newValue);

		if (!nativeGuild) throw new Error("What.");

		await guildCollection.updateOne(
			{ guildId: ctx.guildId },
			{ $set: { flags: guildObj.flags } },
			{ upsert: true },
		);
		ctx.client.cache.pguild.remove(nativeGuild.id)

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					[newValue ? "ENABLED_FEATURE" : "DISABLED_FEATURE"].replace(
						"%name%",
						Object.entries(friendlyFeatureIndex).find(
							(c) => c[0] === featureFlag,
						)?.[1].title ?? "??",
					).replace(
						"%description%",
						Object.entries(friendlyFeatureIndex).find(
							(c) => c[0] === featureFlag,
						)?.[1].description ?? "??",
					),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
