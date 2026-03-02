import { emojis } from "@/lib/emojis";
import { getApplicableCase } from "@/lib/libby";
import { AlertView } from "@/views/alert";
import { Command, createMiddleware, Message, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export const serverBlacklist = createMiddleware<void>(async (middle) => {
	const { blacklistedChannels, blacklistedRoles, blacklistedCategories } =
		await middle.context.retrievePGuild();
	const { context: ctx } = middle;
	const channel = await middle.context.channel();
	console.log((middle.context.command as SubCommand).parent);
	const isServerConfig =
		(middle.context.isComponent() &&
			middle.context.customId.startsWith("guilds/config/")) ||
		("parent" in middle.context.command &&
			middle.context.command.parent?.name === "server-config");

	if ("parentId" in channel && !isServerConfig)
		if (blacklistedCategories.includes(channel.parentId ?? "")) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"FEATURE_DISABLED_GUILD",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

	if (blacklistedChannels.includes(middle.context.channelId)) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView(
				"FEATURE_DISABLED_GUILD",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}

	if (
		((await ctx.member?.roles.list()) ?? []).some((c) =>
			blacklistedRoles.includes(c.id),
		)
	) {
		if (ctx.isChat() && ctx.message) {
			(ctx.message as Message).delete();

			if (
				process.env.LIBBY_DEBUG === "true" ||
				ctx.guildId === process.env.LIBBY_SERVER_ID
			) {
				const caseObj = await getApplicableCase(ctx.author.id);

				if (caseObj) {
					await (ctx.message as Message).author.write({
						components: new AlertView(ctx.userTranslations()).errorViewCustom(
							ctx
								.userTranslations()
								.BLACKLISTED_PC.replace(
									"{{ libbyReasoning }}",
									caseObj.reasoning,
								)
								.replace("{{ reply }}", emojis.lineRight)
								.replace(
									"{{ libbyExpirationDate }}",
									caseObj.expires
										? `<t:${Math.floor(caseObj.expires.getTime() / 1000).toString()}:R>`
										: "Never",
								)
								.replace("{{ libbyCaseId }}", caseObj.blacklistId),
						),
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});

					return await middle.pass();
				}
			}

			await (ctx.message as Message).author.write({
				components: new AlertView(ctx.userTranslations()).errorViewCustom(
					ctx
						.userTranslations()
						.BLACKLISTED.replace(
							"{{ guild }}",
							(await ctx.guild())?.name ?? "",
						),
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
			return await middle.pass();
		}
	}

	return middle.next();
});
