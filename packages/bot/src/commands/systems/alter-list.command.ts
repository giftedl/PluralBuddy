/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { has } from "@/lib/privacy-bitmask";
import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";
import { SystemProtectionFlags } from "plurography";
import {
	type CommandContext,
	createUserOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";

const options = {
	"other-user": createUserOption({
		description: "Find alters of another user's system.",
		required: false,
	}),
};

@Declare({
	name: "alters",
	description: "See system alters",
	aliases: ["a", "m", "members", "l", "list"],
	contexts: ["BotDM", "Guild"],
})
@Shortcut()
@Options(options)
export default class AlterListCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();
		const { "other-user": otherUser } = ctx.options;

		if (otherUser) {
			const user = await userCollection.findOne({ userId: otherUser.id });

			if (user?.system === undefined || !has(SystemProtectionFlags.ALTERS, user?.system?.public)) {
				return await ctx.ephemeral({
					components: new AlertView((await ctx.userTranslations())).errorView(
						"ERROR_SYSTEM_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				}, undefined, undefined, ctx);
			}

			return await ctx.ephemeral({
				components: [
					...(await new SystemSettingsView((await ctx.userTranslations())).otherAltersSettings(
						user.system,
					)),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			}, undefined, undefined, ctx);
		}

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			}, undefined, undefined, ctx);
		}

		return await ctx.ephemeral({
			components: [
				...(await new SystemSettingsView((await ctx.userTranslations())).altersSettings(
					user.system,
				)),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		}, undefined, undefined, ctx);
	}
}
