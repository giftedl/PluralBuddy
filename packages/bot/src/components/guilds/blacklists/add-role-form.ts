import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { GuildRole, Middlewares, ModalCommand, ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class AddRoleForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.AddBlockRoleForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {

		const newRoles =
			(ctx.interaction.getRoles(
				"guilds/form/add-blocked-role"
			) as GuildRole[]).map(v => v.id) ?? [];
		const pluralGuild = await ctx.retrievePGuild();

		pluralGuild.blockedRoles = newRoles;

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $set: { blockedRoles: newRoles } },
			{ upsert: true }
		);
		ctx.client.cache.pguild.remove(pluralGuild.guildId)

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView((await ctx.userTranslations())).topView(
					"general",
					pluralGuild.guildId,
				),
				...await new ServerConfigView((await ctx.userTranslations())).generalSettings(
					pluralGuild,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
