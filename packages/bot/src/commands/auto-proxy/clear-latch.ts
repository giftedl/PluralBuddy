/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { type CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "clear-latch",
	description: "Clear latch data from auto-proxy.",
	aliases: ["cl"],
	contexts: ["Guild"],
})
export default class ClearLatchAutoProxy extends SubCommand {
    override async run(ctx: CommandContext) {
		const { system } = await ctx.retrievePUser();
        
		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const guild = await ctx.guild();

		if (guild === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

        const existingGuildPolicies = system.systemAutoproxy.some(
			(ap) => ap.autoproxyMode === "latch" && ap.serverId === ctx.guildId,
		);

        if (existingGuildPolicies) {
			await userCollection.updateOne(
				{ userId: system.associatedUserId },
				{
					$set: {
						"system.systemAutoproxy.$[serverEntry].autoproxyAlter": null
					},
				},
				{
					arrayFilters: [{ "serverEntry.serverId": ctx.guildId }],
				},
			);
		} else {
            return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"NOT_IN_LATCH",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
            })
        }

        return await ctx.write({
            components: new AlertView(ctx.userTranslations()).successViewCustom(
                ctx.userTranslations().CLEARED_LATCH.replaceAll("%server_name%", guild.name)
            ),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
        })
    }
}