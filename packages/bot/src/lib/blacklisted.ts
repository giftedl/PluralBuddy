import { translations } from "@/lang/en_us";
import { AlertView } from "@/views/alert";
import type { PGuild } from "plurography";
import type { Message } from "seyfert";
import { getApplicableCase } from "./libby";
import { MessageFlags } from "seyfert/lib/types";
import { emojis } from "./emojis";

export async function blacklistedRole(
	guild: PGuild,
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
								components: new AlertView(translations).errorViewCustom(
									translations.BLACKLISTED_PC.replace(
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
							components: new AlertView(translations).errorViewCustom(
								translations.BLACKLISTED.replace(
									"{{ guild }}",
									guild?.name ?? "",
								),
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
	message: Message,
	silent?: boolean,
) {
	if (guild.blacklistedChannels.includes(message.channelId)) {
		if (!silent)
			try {
				await message.author.write({
					components: new AlertView(translations).errorView(
						"FEATURE_DISABLED_GUILD",
					),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
			} catch (_) {}
		return false;
	}
	return true;
}
