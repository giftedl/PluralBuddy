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
	"new-pronouns": createStringOption({
		description: "The new pronouns to set for the system",
        max_length: 100
	}),
};

@Declare({
	name: "pronouns",
	description: "Set the pronouns of the system",
	aliases: ["pn"],
})
@Options(options)
export default class NameSetSystemCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "new-pronouns": newSystemPronouns } = ctx.options;
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
				systemPronouns: newSystemPronouns as string ?? null,
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
				ctx.userTranslations().SYSTEM_SET_PRONOUNS.replace("%pronouns%", newSystemPronouns ?? "_Unset_"),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
