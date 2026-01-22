import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { Middlewares, ModalCommand, ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class AddRoleForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.AddBlacklistRoleForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const newRoles =
			(ctx.interaction.getInputValue(
				InteractionIdentifier.Guilds.FormSelection.AddBlacklistRoleSelection.create(),
			) as string[]) ?? [];
		const pluralGuild = await ctx.retrievePGuild();

		pluralGuild.blacklistedRoles = newRoles;

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $set: { blacklistedRoles: newRoles } },
		);

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"general",
					pluralGuild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).generalSettings(
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
