import {
	type CommandContext,
	Declare,
	Interaction,
	Middlewares,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { policyModal } from "@/policyModal";
import { AlertView } from "@/views/alert";
import { ServerConfigView } from "@/views/server-cfg";

@Declare({
	name: "view",
	description: "View server configuration in PluralBuddy.",
})
@Middlewares(["ensureGuildPermissions"])
export default class ViewServerConfig extends SubCommand {
	override async run(ctx: CommandContext) {
		const user = await ctx.retrievePUser();

		if (user.policyStatus !== 1 && ctx.interaction) {
			return ctx.interaction.modal(
				await policyModal(
					ctx,
					InteractionIdentifier.Guilds.GeneralTab.Index.create(),
				),
			);
		}

		await ctx.deferReply(true);

		const pluralGuild = await ctx.retrievePGuild();

		return await ctx.ephemeral(
			{
				components: [
					...new ServerConfigView(await ctx.userTranslations()).topView(
						"general",
						pluralGuild.guildId,
					),
					...(await new ServerConfigView(
						await ctx.userTranslations(),
					).generalSettings(
						pluralGuild,
						(await ctx.getDefaultPrefix()) ?? "",
						ctx.interaction?.message?.messageReference === undefined,
					)),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				allowed_mentions: { parse: [] },
			},
			undefined,
			undefined,
			ctx,
		);
	}
}
