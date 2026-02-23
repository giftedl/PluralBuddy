import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	CommandContext,
	createNumberOption,
	Declare,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"proxy-delay": createNumberOption({
		max_value: 2.5,
		min_value: 0,
		description: "New proxy delay. Default is 0.",
		required: true,
	}),
};

@Declare({
	name: "set-proxy-delay",
	aliases: ["set-proxydelay", "setproxydelay", "spd"],
	description: "Set delay before proxying on this guild.",
})
@Options(options)
@Middlewares(["ensureGuildPermissions"])
export default class SetProxyDelay extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "proxy-delay": proxyDelay } = ctx.options;
		const guild = await ctx.retrievePGuild();

		await guildCollection.updateOne(
			{ guildId: guild.guildId },
			{
				$set: { proxyDelay: proxyDelay * 1000 },
			},
		);
		ctx.client.cache.pguild.remove(guild.guildId)

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.DELAY_CHANGED.replaceAll("%seconds%", String(proxyDelay))
					.replaceAll("%ms%", String(proxyDelay * 1000)),
			),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
		});
	}
}
