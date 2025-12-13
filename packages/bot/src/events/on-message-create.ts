/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createEvent } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getUserById } from "../types/user";
import { alterCollection } from "../mongodb";
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

		const similarWebhooks = await getSimilarWebhooks(message);
		const user = await getUserById(message.author.id);

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

		const alters = alterCollection.find({ systemId: message.author.id });

		// Only find the alters that we need
		outer: for (let i = 0; i < user.system.alterIds.length; i++) {
			const checkAlter = await alters.next();

			for (const proxyTag of checkAlter?.proxyTags ?? []) {
				if (proxyTagValid(proxyTag, message)) {
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
