import {
	ComponentCommand,
	Middlewares,
	ModalCommand,
	ModalContext,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { ServerConfigView } from "@/views/server-cfg";
import type { GuildErrorTypes } from "plurography";
import type z from "zod";

@Middlewares(["ensureGuildPermissions"])
export default class SearchingRolePreferencesForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.SearchingErrorsForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const channelId = ctx.interaction.getChannels(
			InteractionIdentifier.Guilds.FormSelection.SearchingErrorsChannelSelection.create(),
		)?.[0]?.id as string | undefined;
		const userId = ctx.interaction.getUsers(
			InteractionIdentifier.Guilds.FormSelection.SearchingErrorsUserSelection.create(),
		)?.[0]?.id as string | undefined;
		const type = ctx.interaction.getInputValue(
			InteractionIdentifier.Guilds.FormSelection.SearchingErrorsTypeSelection.create(),
		)?.[0] as string | undefined;

		const guild = await ctx.retrievePGuild();
		const nativeGuild = await ctx.guild();
		const errors = guild.errorLog.filter((c) => {
            if (type === undefined && userId === undefined && channelId === undefined)
                return true;
			if (type && c.type === type) return true;
			if (userId && c.responsibleUserId === userId) return true;
			if (channelId && c.responsibleChannelId === channelId) return true;
			return false;
		});

		if (!nativeGuild) throw new Error("No native guild.");

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"errors",
					guild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).errorSettings(
					guild,
					nativeGuild,
					1,
					errors,
					{ channelId, userId, type: type as z.infer<typeof GuildErrorTypes> },
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] },
		});
	}
}
