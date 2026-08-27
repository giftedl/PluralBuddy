/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { CacheFrom, type Message } from "seyfert";
import { client } from "@/index";
import { userCollection } from "@/mongodb";
import type { PAlter } from "@/types/alter";
import { defaultPrefixes } from "@/types/guild";
import type { PSystem } from "@/types/system";
import type { PUser } from "@/types/user";
import { getWiderAutoProxy } from "../autoproxy-util";
import { getSystemFeatures } from "../get-system-flags";

function listStartsWith(string: string, list: string[]) {
	for (const item of list) if (string.startsWith(item)) return true;
	return false;
}

export const startsWithPrefix = (message: Message) =>
	listStartsWith(
		message.content,
		defaultPrefixes[
			(process.env.BRANCH as "production" | "canary") ?? "production"
		],
	);

export const isValidDm = async (message: Message) =>
	(await message.channel()).isDM() &&
	!listStartsWith(
		message.content,
		defaultPrefixes[
			(process.env.BRANCH as "production" | "canary") ?? "production"
		],
	);

export const notValidPermissions = async (message: Message) => {
	const userPerms = await client.channels.memberPermissions(
		message.channelId,
		await client.members.fetch(message.guildId as string, client.botId),
		true,
	);

	return (
		!userPerms.has(["ManageWebhooks", "ManageMessages"]) &&
		!userPerms.has(["ManageNicknames"])
	);
};

export const getSimilarWebhooks = async (channelId: string) => {
	try {
		const result = (
			await client.webhooks.listFromChannel(channelId).catch(() => [])
		).filter(
			(val) =>
				val.name === "PluralBuddy Proxy" &&
				(val.user ?? { id: 0 }).id === client.botId,
		);

		client.cache.similarWebhookResource.set(
			CacheFrom.Gateway,
			channelId,
			result,
		);

		return result;
	} catch (error) {
		console.error("[unurgent]", error);
		return [];
	}
};

export const setLastLatchAlter = async (
	guildId: string,
	channelId: string,
	system: PSystem,
	alter?: PAlter,
) => {
	const existingGuildPolicies = getWiderAutoProxy(system, guildId, channelId);

	if (
		existingGuildPolicies &&
		existingGuildPolicies.autoproxyMode === "latch"
	) {
		await userCollection.updateOne(
			{ userId: system.associatedUserId },
			{
				$set: {
					"system.systemAutoproxy.$[serverEntry].autoproxyAlter": alter
						? alter.alterId.toString()
						: undefined,
					"system.systemAutoproxy.$[serverEntry].lastLatchTimestamp":
						new Date(),
				},
			},
			{
				arrayFilters: [
					{ "serverEntry.serverId": existingGuildPolicies.serverId },
				],
			},
		);
	}
};

export const getDisplayNameWebhook = (
	checkAlter: PAlter,
	message: Message,
	user: PUser,
) => {
	let body = `${checkAlter.nameMap.find((c) => c.server === message.guildId)?.name ?? checkAlter?.displayName ?? ""}${getSystemFeatures(user.system!!).includePronouns ? ` (${checkAlter?.pronouns})` : ""}`;
	const tagElement =
		(user.system?.displayTagMap ?? {})[message.guildId ?? ""] ??
		user.system?.systemDisplayTag ??
		"";

	if (user.system && getSystemFeatures(user.system).leftSidedTag) {
		body = `${tagElement} ${body}`;
	} else body = `${body} ${tagElement}`
	
	return body;
};
