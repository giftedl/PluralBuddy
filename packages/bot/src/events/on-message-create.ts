/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { CacheFrom, Container, createEvent, TextDisplay } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getUserById } from "../types/user";
import { alterCollection, errorCollection } from "../mongodb";
import { AlertView } from "@/views/alert";
import {
	performTagProxy,
	proxyTagValid,
} from "@/lib/proxying/types/tag-proxying";
import type { PAlter } from "@/types/alter";
import {
	getSimilarWebhooks,
	isValidDm,
	notValidPermissions,
	startsWithPrefix,
} from "@/lib/proxying/util";
import { performAlterAutoProxy } from "@/lib/proxying/types/alter-ap";
import { getGuildFromId } from "@/types/guild";
import { createError } from "@/lib/create-error";
import { emojis } from "@/lib/emojis";
import { createProxyError } from "@/lib/proxying/error";

export default createEvent({
	data: { name: "messageCreate", once: false },
	run: async (message) => {
		if (message.author.bot === true) return;
		if (startsWithPrefix(message)) return;
		if (await isValidDm(message)) {
			message.reply({
				components: [
					// @ts-ignore
					...new AlertView(null).errorViewCustom(
						"You cannot proxy inside of DM channels. Sorry!",
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
			return;
		}
		if ((await message.channel()).isDM()) return;

		if (await notValidPermissions(message)) return;

		const similarWebhooks = await getSimilarWebhooks(message.channelId);
		const user = await getUserById(message.author.id);
		const guild = await getGuildFromId(message.guildId ?? "");

		if (user.system === undefined) return;
		if (user.system.disabled) return;
		if (
			user.system.systemAutoproxy.some(
				(ap) => ap.autoproxyMode === "alter" && ap.serverId === message.guildId,
			)
		) {
			const alter = user.system.systemAutoproxy.find(
				(ap) => ap.autoproxyMode === "alter" && ap.serverId === message.guildId,
			)?.autoproxyAlter;

			if (alter) {
				const fetchedAlter = await alterCollection.findOne({
					alterId: Number(alter),
					systemId: message.author.id,
				});

				if (fetchedAlter)
					performAlterAutoProxy(message, similarWebhooks, fetchedAlter, user);
			}
		}

		if (user.system.alterIds.length === 0) return;

		// Only find the alters that we need
		for (let i = 0; i < user.system.alterIds.length; i++) {
			const proxyTags = message.client.cache.alterProxy.get(
				user.system.alterIds[i]?.toString() ?? "",
			)?.pt;
			const reformedProxyTags = proxyTags?.map((c) => {
				return { prefix: c.p, suffix: c.s };
			});

			let checkAlter = null;

			if (!proxyTags)
				checkAlter = await alterCollection.findOne({
					alterId: user.system.alterIds[i],
				});

			for (const proxyTag of reformedProxyTags ?? checkAlter?.proxyTags ?? []) {
				if (checkAlter)
					message.client.cache.alterProxy.set(
						CacheFrom.Gateway,
						checkAlter?.alterId.toString(),
						{
							pt: checkAlter?.proxyTags.map((c) => {
								return { p: c.prefix, s: c.suffix };
							}),
						},
					);

				if (proxyTagValid(proxyTag, message)) {
					// Check for system tag policy
					if (
						guild.getFeatures().requiresGuildTag &&
						user.system.systemDisplayTag === null
					) {
						createProxyError(user, message, {
							title: "Display Tag Enforcement Policy",
							description:
								'This user cannot proxy in this guild without a system tag due to the system display tag enforcement policy. Enable system tags by going into `pb;system config` -> "Public Profile".',
							type: "EnforcedGuildTagRegulation",
						});

						return;
					}

					// Only get more data about the alter after confirmation of proxy tag
					checkAlter = await alterCollection.findOne({
						alterId: user.system.alterIds[i],
					});

					performTagProxy(
						checkAlter as PAlter,
						user,
						similarWebhooks,
						proxyTag,
						message,
					);

					return;
				}
			}
		}

		if (
			user.system.systemAutoproxy.some(
				(ap) => ap.autoproxyMode === "latch" && ap.serverId === message.guildId,
			)
		) {
			const alter = user.system.systemAutoproxy.find(
				(ap) => ap.autoproxyMode === "latch" && ap.serverId === message.guildId,
			)?.autoproxyAlter;

			if (alter) {
				const fetchedAlter = await alterCollection.findOne({
					alterId: Number(alter),
					systemId: message.author.id,
				});

				if (fetchedAlter)
					performAlterAutoProxy(message, similarWebhooks, fetchedAlter, user);
			}
		}
	},
});
