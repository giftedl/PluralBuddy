import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ServerConfigView } from "@/views/server-cfg";
import { GuildFlags } from "plurography";
import {
	CommandContext,
	createStringOption,
	Declare,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { GuildFeature, MessageFlags } from "seyfert/lib/types";

const options = {
	option: createStringOption({
		description: "Whether to require the tag or not.",
		choices: [
			{ name: "on", value: "on" },
			{ name: "off", value: "off" },
		],
		required: true,
	}),
};

@Declare({
	name: "require-tag",
	description: "Require system tags when proxying with PluralBuddy.",
})
@Middlewares(["ensureGuildPermissions"])
@Options(options)
export default class RequireSystemTags extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const pluralGuild = await ctx.retrievePGuild();
		const { option } = ctx.options;

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{
				$set: {
					flags: pluralGuild
						.getFeatures()
						.bool(GuildFlags.MANDATORY_GUILD_TAG, option === "on"),
				},
			},
		);
		ctx.client.cache.pguild.remove(pluralGuild.guildId)

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successView(
				pluralGuild.getFeatures().requiresGuildTag
					? "REQUIRE_TAG_ENABLED"
					: "REQUIRE_TAG_DISABLED",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
