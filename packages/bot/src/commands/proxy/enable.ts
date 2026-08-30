import { CommandContext, Declare, Options, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

@Declare({
	name: "enable",
	description: "Enabling proxying in this server.",
	aliases: ["e", "on"],
	contexts: ["Guild"]
})
export default class EnableProxying extends SubCommand {
	override async run(ctx: CommandContext) {

		await ctx.deferReply(true);
		const guild = await ctx.guild();

		if (guild === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const { system } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (!(system.disabledGuilds ?? []).includes(guild.id)) {
			return await ctx.editResponse({
				components: [
					...new AlertView(await ctx.userTranslations()).errorView(
						"PROXYING_ALREADY_ENABLED",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		await userCollection.updateOne(
			{
				userId: system.associatedUserId,
			},
			{
				$pull: {
					"system.disabledGuilds": guild.id,
				},
			},
		);

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).SUCCESS_ENABLE_GUILD.replace(
						"{{ guild }}",
						guild.name,
					),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
		});
	}
}
