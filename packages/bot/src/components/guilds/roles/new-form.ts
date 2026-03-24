import {
	ComponentCommand,
	Container,
	GuildRole,
	Middlewares,
	ModalCommand,
	ModalContext,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";

@Middlewares(["ensureGuildPermissions"])
export default class NewRolePreferenceForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.CreatingNewRoleForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const roleId = ctx.interaction.getRoles(
			InteractionIdentifier.Guilds.FormSelection.CreatingNewRoleSelection.create(),
			true,
		)[0] as GuildRole;
		const guild = await ctx.retrievePGuild();

		if (guild.rolePreferences.some((c) => c.roleId === roleId.id)) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ROLE_PREFERENCE_ALREADY_EXISTS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		await guildCollection.updateOne(
			{ guildId: guild.guildId },
			{ $push: { rolePreferences: { roleId: roleId.id } } },
		);
		ctx.client.cache.pguild.remove(guild.guildId)

		return await ctx.interaction.update({
			components: new ServerConfigView(ctx.userTranslations()).roleGeneralView({
				roleId: roleId.id,
			}),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
