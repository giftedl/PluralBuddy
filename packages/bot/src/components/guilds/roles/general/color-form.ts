import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ServerConfigView } from "@/views/server-cfg";
import { Middlewares, ModalCommand, ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class RoleContentsForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.ChangeRoleColorForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const roleId =
			InteractionIdentifier.Guilds.FormSelection.ChangeRoleColorForm.substring(
				ctx.customId,
			)[0];
		let newColor = ctx.interaction.getInputValue(
			InteractionIdentifier.Guilds.FormSelection.ChangeRoleColorSelection.create(),
		) as string | undefined;
		const guild = await ctx.retrievePGuild();
		const role = guild.rolePreferences.find((c) => c.roleId === roleId);

		if (newColor === "")
			newColor = undefined;

		if (!role)
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ROLE_PREFERENCE_DOESNT_EXIST",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		if (newColor !== undefined && !/^#?[0-9a-fA-F]{6}$/.test(newColor ?? "")) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_INVALID_COLOR",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		guild.rolePreferences = [
			...guild.rolePreferences.filter((c) => c.roleId !== roleId),
			{ ...role, containerColor: newColor },
		];
		role.containerColor = newColor;

		await guildCollection.updateOne(
			{ guildId: guild.guildId, "rolePreferences.roleId": roleId },
			{ $set: { "rolePreferences.$.containerColor": newColor } },
		);
		ctx.client.cache.pguild.remove(guild.guildId)

		return await ctx.interaction.update({
			components: new ServerConfigView(ctx.userTranslations()).roleGeneralView(
				role,
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] },
		});
	}
}
