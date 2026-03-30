/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import {
	CommandContext,
	createBooleanOption,
	createStringOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"new-display-tag": createStringOption({
		description: "New system tag to set to",
		max_length: 90,
	}),
	se: createBooleanOption({
		description: "Whether the system tag is server-specific or not",
		flag: true,
	}),
};

@Declare({
	name: "display-tag",
	description: "Set the display tag of a system",
	aliases: ["tag", "t", "dt"],
})
@Options(options)
export default class SystemDisplayTagCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { "new-display-tag": systemTag, se } = ctx.options;
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (se && ctx.guildId === undefined) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const updatedSystem = await createSystemOperation(
			user.system,
			se && ctx.guildId
				? {
						displayTagMap: {
							...user.system.displayTagMap,
							[ctx.guildId]: (systemTag as string) ?? null,
						},
					}
				: {
						systemDisplayTag: (systemTag as string) ?? null,
					},
			(await ctx.userTranslations()),
			"discord",
		);

		if (updatedSystem === undefined) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await ctx.editResponse({
			components: new AlertView((await ctx.userTranslations())).successViewCustom(
				((await ctx.userTranslations()))
					.SYSTEM_SET_SYSTEM_TAG.replace("%tag%", systemTag ?? "_Unset_"),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
