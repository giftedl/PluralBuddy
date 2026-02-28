import {
	ComponentCommand,
	GuildRole,
	Middlewares,
	ModalCommand,
	ModalContext,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["administrativeGuildPermissions"])
export default class ManageManagersForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.AddManagersForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const newRoles =
			(ctx.interaction.getRoles(
				InteractionIdentifier.Guilds.FormSelection.AddManagersSelection.create(),
			) as GuildRole[]) ?? [];
		const pluralGuild = await ctx.retrievePGuild();

		pluralGuild.managerRoles = newRoles.map(v => v.id);

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $set: { managerRoles: newRoles.map(v => v.id) } },
			{ upsert: true }
		);
		ctx.client.cache.pguild.remove(pluralGuild.guildId)

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
