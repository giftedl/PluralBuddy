import { AlertView } from "@/views/alert";
import { createMiddleware, Message } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export const serverBlacklist = createMiddleware<void>(async (middle) => {
	const { blacklistedChannels, blacklistedRoles } =
		await middle.context.retrievePGuild();
	const { context: ctx } = middle;

	if (
		blacklistedChannels.includes(middle.context.channelId) ||
		((await ctx.member?.roles.list()) ?? []).some((c) =>
			blacklistedRoles.includes(c.id),
		)
	) {
		if (ctx.isChat() && ctx.message) {
			(ctx.message as Message).delete();

			await (ctx.message as Message).author.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"FEATURE_DISABLED_GUILD",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
			return await middle.pass();
		}

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView(
				"FEATURE_DISABLED_GUILD",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}

	return middle.next();
});
