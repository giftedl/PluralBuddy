import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
import { SystemSettingsView } from "@/views/system-settings";
import {
	ActionRow,
	Button,
	CommandContext,
	Declare,
	SubCommand,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "import",
	description: "Import data from another source.",
})
export default class ImportCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return ctx.ephemeral({
				components: new PluralBuddyIntro(ctx.userTranslations()).pageTwo(await ctx.getDefaultPrefix() ?? "pb;"),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral ,
			}, undefined, undefined, ctx);
		}

		return await ctx.ephemeral({
			components: new SystemSettingsView(ctx.userTranslations()).importSettings(
				user.system,
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		}, undefined, undefined, ctx);
	}
}
