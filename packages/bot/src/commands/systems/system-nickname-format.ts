import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";
import {
	CommandContext,
	createStringOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"new-nickname-format": createStringOption({
		description:
			'Where "%username%" is your alter username & "%display%" is your alter display name.',
		min_length: 1,
		max_length: 40,
		required: true,
	}),
};

@Declare({
	name: "nickname-format",
	description: "Set the nickname format of the system",
	aliases: ["nick", "n", "nf"],
})
@Options(options)
export default class NameSetSystemCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "new-nickname-format": newNicknameFormat } = ctx.options;
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const updatedSystem = await createSystemOperation(
			user.system,
			{
				nicknameFormat: newNicknameFormat as string,
			},
			ctx.userTranslations(),
			"discord",
		);

		if (updatedSystem === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SYSTEM_SET_NAME.replace("%name%", newNicknameFormat),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
