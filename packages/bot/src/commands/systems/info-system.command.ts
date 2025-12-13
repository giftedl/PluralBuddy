/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import {
	Declare,
	Options,
	type CommandContext,
	SubCommand,
	createBooleanOption,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { SystemView } from "../../views/system";
import { AlertView } from "../../views/alert";

const options = {
	public: createBooleanOption({
		description: "Do you want to expose this publicly? (non-ephemeral)",
		flag: true,
	}),
};

@Declare({
	name: "info",
	description: "Get information about the system",
	aliases: ["i"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class SystemInfoCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return ctx.ephemeral(
			{
				components: [
					...new SystemView(ctx.userTranslations()).systemProfileView(
						user.system,

						user.system.associatedUserId !== ctx.author.id,
					),
					...new SystemView(ctx.userTranslations()).systemConfigureButton(
						user.system,
					),
				],
				flags:
					MessageFlags.IsComponentsV2 +
					(ctx.options.public !== true ? MessageFlags.Ephemeral : 0),

				allowed_mentions: { parse: [] },
			},
			true,
		);
	}
}
