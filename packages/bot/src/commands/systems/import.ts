import {
	ActionRow,
	Button,
	type CommandContext,
	Declare,
	SubCommand,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
import { SystemSettingsView } from "@/views/system-settings";
@Declare({
	name: "import",
	description: "Import data from another source.",
})
export default class ImportCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return ctx.ephemeral(
				{
					components: new PluralBuddyIntro(
						await ctx.userTranslations(),
					).pageTwo((await ctx.getDefaultPrefix()) ?? "pb;"),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		return await ctx.ephemeral(
			{
				components: new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(user.system)?.preferAccessiblity,
				).importSettings(user.system),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			undefined,
			undefined,
			ctx,
		);
	}
}
