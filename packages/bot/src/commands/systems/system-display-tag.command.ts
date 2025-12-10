/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { CommandContext, createStringOption, Declare, Options, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    "new-display-tag": createStringOption({
        description: "New system tag to set to",
        max_length: 90,
        required: true
    })
}

@Declare({
    name: "display-tag",
    description: "Set the display tag of a system",
    aliases: ["tag", "t", "dt"]
})
@Options(options)
export default class SystemDisplayTagCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const { "new-display-tag": systemTag } = ctx.options;
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
				systemDisplayTag: systemTag as string,
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
				ctx.userTranslations().SYSTEM_SET_SYSTEM_TAG.replace("%tag%", systemTag),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
    }
}