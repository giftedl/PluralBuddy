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
	"new-name": createStringOption({
		description: "The new name to set as the system",
        required: true
	}),
};

@Declare({
	name: "name",
	description: "Set the name of the system",
	aliases: ["n", "dn", "display-name"],
})
@Options(options)
export default class NameSetSystemCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "new-name": newSystemName } = ctx.options;
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
				systemName: newSystemName as string,
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
				ctx.userTranslations().SYSTEM_SET_NAME.replace("%name%", newSystemName),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
