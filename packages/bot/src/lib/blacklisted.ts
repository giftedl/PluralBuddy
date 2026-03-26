import { AlertView } from "@/views/alert";
import type { PGuild } from "plurography";
import type { DefaultLocale, Message } from "seyfert";
import { getApplicableCase } from "./libby";
import { MessageFlags } from "seyfert/lib/types";
import { emojis } from "./emojis";
import { client } from "..";

export async function blacklistedRole(
	guild: PGuild,
	locales: DefaultLocale,
	message: Message,
	silent?: boolean,
) {
	if (guild.blacklistedRoles.length !== 0) {
		if (
			((await message.member?.roles.list()) ?? []).some((c) =>
				guild.blacklistedRoles.includes(c.id),
			)
		) {
			if (
				process.env.LIBBY_DEBUG === "true" ||
				message.guildId === process.env.LIBBY_SERVER_ID
			) {
				const caseObj = await getApplicableCase(message.author.id);

				if (caseObj) {
					if (!silent)
						try {
							await message.author.write({
								components: new AlertView(locales).errorViewCustom(
									locales.BLACKLISTED_PC.replace(
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

					return false;
				}

				const guild = await message.guild();

				if (!silent)
					try {
						await message.author.write({
							components: new AlertView(locales).errorViewCustom(
								locales.BLACKLISTED.replace("{{ guild }}", guild?.name ?? ""),
							),
							flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
						});
					} catch (_) {}

				return false;
			}
		}
	}
	return true;
}

export async function blacklistedChannel(
	guild: PGuild,
	locales: DefaultLocale,
	message: Message,
	silent?: boolean,
) {
	if (guild.blacklistedChannels.includes(message.channelId)) {
		if (!silent)
			try {
				await message.author.write({
					components: new AlertView(locales).errorView(
						"FEATURE_DISABLED_CHANNEL",
					),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
			} catch (_) {}
		return false;
	}
	console.log(guild.blacklistedCategories, guild.blacklistedChannels);
	if (guild.blacklistedCategories.length !== 0) {
		const channel = await message.channel();
		console.log(channel);
		if ("parentId" in channel && !channel.isThread())
			if (guild.blacklistedCategories.includes(channel.parentId ?? "")) {
				if (!silent)
					try {
						await message.author.write({
							components: new AlertView(locales).errorView(
								"FEATURE_DISABLED_CHANNEL",
							),
							flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
						});
					} catch (_) {}
				return false;
			}
		if ("parentId" in channel && channel.isThread()) {
			const parent = await client.channels.fetch(channel.parentId);

			if ("parentId" in parent && !parent.isThread())
				if (guild.blacklistedCategories.includes(parent.parentId ?? "")) {
					if (!silent)
						try {
							await message.author.write({
								components: new AlertView(locales).errorView(
									"FEATURE_DISABLED_CHANNEL",
								),
								flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
							});
						} catch (_) {}
					return false;
				}
		}
	}
	return true;
}
