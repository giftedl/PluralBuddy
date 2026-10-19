import { PGuildObject } from "plurography";
import {
	Command,
	ComponentContext,
	createMiddleware,
	type Message,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { getApplicableCase } from "@/lib/libby";
import { getGuildFromId } from "@/types/guild";
import { AlertView } from "@/views/alert";

export const serverBlock = createMiddleware<void>(async (middle) => {
	if (!middle.context.guildId) return middle.next();
	const { blockedChannels, blockedRoles, blockedCategories } =
		PGuildObject.parse(
			(
				await middle.context.client.cache.pguild.get(
					middle.context.guildId ?? "",
				)
			)?.g ?? (await getGuildFromId(middle.context.guildId ?? "")),
		);
	const { context: ctx } = middle;
	const channel = await middle.context.channel().catch(() => null);

	if (!channel) {
		return middle.next();
	}

	const isServerConfig =
		("customId" in middle.context &&
			middle.context.customId.startsWith("guilds/")) ||
		("parent" in middle.context.command &&
			middle.context.command.parent?.name === "server-config");

	if ("parentId" in channel && !isServerConfig)
		if (blockedCategories.includes(channel.parentId ?? "")) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"FEATURE_DISABLED_CHANNEL",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

	if (blockedChannels.includes(middle.context.channelId) && !isServerConfig) {
		return await ctx.write({
			components: new AlertView(await ctx.userTranslations()).errorView(
				"FEATURE_DISABLED_CHANNEL",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}

	if (blockedRoles.length !== 0)
		if (
			((await ctx.member?.roles.list(true)) ?? []).some((c) =>
				blockedRoles.includes(c.id),
			)
		) {
			if (ctx instanceof ComponentContext && ctx.message) {
				(ctx.message as Message).delete().catch((_) => null);

				if (
					process.env.LIBBY_DEBUG === "true" ||
					ctx.guildId === process.env.LIBBY_SERVER_ID
				) {
					const caseObj = await getApplicableCase(ctx.author.id);

					if (caseObj) {
						try {
							await (ctx.message as Message).author.write({
								components: new AlertView(
									await ctx.userTranslations(),
								).errorViewCustom(
									(await ctx.userTranslations()).BLOCK_PC.replace(
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
						} catch (_) {}

						return await middle.stop();
					}
				}

				try {
					await (ctx.message as Message).author.write({
						components: new AlertView(
							await ctx.userTranslations(),
						).errorViewCustom(
							(await ctx.userTranslations()).BLOCKED.replace(
								"{{ guild }}",
								(await ctx.guild())?.name ?? "",
							),
						),
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});
				} catch (_) {}
				return await middle.stop();
			}
		}

	return middle.next();
});
