import { guildCollection } from "@/mongodb";
import { getGuildFromId } from "@/types/guild";
import { AlertView } from "@/views/alert";
import {
	Middlewares,
	Group,
	SubCommand,
	Declare,
	CommandContext,
	createStringOption,
	Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	prefix: createStringOption({
		description: "New prefix to use.",
		required: true,
		autocomplete: async (ctx) => {
			if (ctx.guildId === undefined) {
				return await ctx.respond([
					{ value: "no-perms", name: "This is not a guild." },
				]);
			}

			const member = await ctx.client.members
				.fetch(ctx.guildId, ctx.user.id, true)
				.catch(() => null);
			const pluralGuild = await getGuildFromId(ctx.guildId ?? "??");
			const apiGuild = await ctx.client.guilds
				.fetch(ctx.guild?.id ?? "??")
				.catch(() => null);

			if (!member) throw new Error("no member");
			if (!apiGuild) throw new Error("no guild");

			const memberPermissions = await member.fetchPermissions();
			const memberRoles = (await member.roles.list(true)).map((c) => c.id);
			const managerRolesIntersect =
				memberRoles.filter((c) => pluralGuild.managerRoles.includes(c))
					.length >= 1;

			if (
				!(
					memberPermissions.has(["Administrator"]) ||
					memberPermissions.has(["ManageGuild"]) ||
					apiGuild.ownerId === member.id ||
					managerRolesIntersect ||
					// this is NOT used in production. this is NOT a backdoor.
					(process.env.SRV_CFG_TEST_USER_ID &&
						process.env.SRV_CFG_TEST_USER_ID === member.id)
				)
			) {
				return await ctx.respond([
					{
						value: "no-perms",
						name: "You do not have permissions to use this command.",
					},
				]);
			}

			return await ctx.respond(
				pluralGuild.prefixes.map((c) => {
					return { value: c, name: c };
				}),
			);
		},
	}),
};

@Declare({
	name: "remove",
	description: "Remove a server prefix.",
	aliases: ["a"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("prefixes")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guildObj = await ctx.retrievePGuild();
		const { prefix: prefix } = ctx.options;

		guildObj.prefixes = guildObj.prefixes.filter((c) => c !== prefix);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $pull: { prefixes: prefix } },
		);
		ctx.client.cache.pguild.remove(guildObj.guildId)

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SUCCESS_CHANGED_SERVER_PREFIXES.replace(
						"%prefixes%",
						guildObj.prefixes.map((c) => `> - ${c}`).join("\n"),
					),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
