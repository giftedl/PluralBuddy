import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ServerConfigView } from "@/views/server-cfg";
import { GuildFlags } from "plurography";
import {
	CommandContext,
	createChannelOption,
	createStringOption,
	Declare,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { ChannelType, GuildFeature, MessageFlags } from "seyfert/lib/types";

const options = {
	channel: createChannelOption({
		description: "The channel to use for logging.",
		required: true,
        channel_types: [ ChannelType.GuildText ]
	}),
};

@Declare({
	name: "set-log-channel",
	description: "Set the log channel used on PluralBuddy.",
	aliases: ["log", "channel"],
})
@Middlewares(["ensureGuildPermissions"])
@Options(options)
export default class SetLogChannel extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const pluralGuild = await ctx.retrievePGuild();
		const { channel } = ctx.options;

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{
				$set: {
					logChannel: channel.id,
				},
			},
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successView(
				"LOGGING_CHANNEL_SET",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
