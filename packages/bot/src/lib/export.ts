/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import z from "zod";
import { PSystemObject, type PSystem } from "../types/system";
import { PAlterObject } from "../types/alter";
import { alterCollection, tagCollection } from "../mongodb";
import { PTagObject } from "@/types/tag";
import {
	AlterProtectionFlags,
	PluralKitGroup,
	PluralKitMember,
	SystemProtectionFlags,
	TagProtectionFlags,
} from "plurography";
import { UUID } from "mongodb";
import {
	listFromMaskAlters,
	listFromMaskSystems,
	listFromMaskTags,
} from "./privacy-bitmask";
import { PluralKitSystem } from "plurography";

export { ImportNotation } from "plurography";

function makeid(length: number) {
	var result = "";
	var characters = "abcdefghijklmnopqrstuvwxyz";
	var charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export async function buildExportPayload(system: PSystem) {
	const alters = await alterCollection
		.find({ systemId: system.associatedUserId })
		.toArray();
	const tags = await tagCollection
		.find({ systemId: system.associatedUserId })
		.toArray();

	return JSON.stringify({
		system: { ...system, verifiedSubAccounts: [] },
		alters,
		tags,
	});
}

export async function buildPkExportPayload(system: PSystem) {
	const alters = await alterCollection
		.find({ systemId: system.associatedUserId })
		.toArray();
	const tags = await tagCollection
		.find({ systemId: system.associatedUserId })
		.toArray();

	const convertedAlters = alters.map((alter, i) => ({
		originalId: alter.alterId,
		parsed: PluralKitMember.safeParse({
			id: makeid(6),
			uuid: crypto.randomUUID(),
			name: alter.username.substring(0, 100),
			display_name: alter.displayName.substring(0, 100),
			color: alter.color !== null ? alter.color.slice(1) : null,
			birthday: null,
			avatar_url: alter.avatarUrl,
			webhook_avatar_url: null,
			pronouns: alter.pronouns ? alter.pronouns?.substring(0, 100) : null,
			banner: alter.banner,
			description: alter.description,
			created: new Date(),
			keep_proxy: false,
			tts: false,
			autoproxy_enabled: false,
			message_count: 0,
			last_message_timestamp: new Date(),
			proxy_tags: alter.proxyTags.map((c) => ({
				prefix: c.prefix,
				suffix: c.suffix,
			})),
			privacy: {
				visibility: listFromMaskAlters(alter.public).includes(
					AlterProtectionFlags.VISIBILITY,
				)
					? "public"
					: "private",
				name_privacy: listFromMaskAlters(alter.public).includes(
					AlterProtectionFlags.NAME,
				)
					? "public"
					: "private",
				description_privacy: listFromMaskAlters(alter.public).includes(
					AlterProtectionFlags.DESCRIPTION,
				)
					? "public"
					: "private",
				banner_privacy: listFromMaskAlters(alter.public).includes(
					AlterProtectionFlags.BANNER,
				)
					? "public"
					: "private",
				birthday_privacy: "private",
				pronoun_privacy: listFromMaskAlters(alter.public).includes(
					AlterProtectionFlags.PRONOUNS,
				)
					? "public"
					: "private",
				avatar_privacy: listFromMaskAlters(alter.public).includes(
					AlterProtectionFlags.AVATAR,
				)
					? "public"
					: "private",
				metadata_privacy: "private",
				proxy_privacy: "private",
			},
		}),
	}));

	console.error(
		"ERRORS",
		convertedAlters.filter((v) => v.parsed.error),
	);

	const convertedTags = tags.map((tag, i) =>
		PluralKitGroup.safeParse({
			id: makeid(6),
			uuid: crypto.randomUUID(),
			name: tag.tagFriendlyName.substring(0, 100).replaceAll(" ", ""),
			display_name: tag.tagFriendlyName.substring(0, 100),
			description: tag.tagDescription ?? null,
			icon: null,
			banner: null,
			color: null,
			created: new Date(),
			members: convertedAlters
				.filter((v) => tag.associatedAlters.includes(v.originalId.toString()))
				.map((c) => c.parsed.data?.id ?? ""),
			privacy: {
				name_privacy: listFromMaskTags(tag.public).includes(
					TagProtectionFlags.NAME,
				)
					? "public"
					: "private",
				description_privacy: listFromMaskTags(tag.public).includes(
					TagProtectionFlags.DESCRIPTION,
				)
					? "public"
					: "private",
				banner_privacy: "private",
				icon_privacy: "private",
				list_privacy: listFromMaskTags(tag.public).includes(
					TagProtectionFlags.ALTERS,
				)
					? "public"
					: "private",
				metadata_privacy: "private",
				visibility: "private",
			},
		}),
	);
	console.error(
		"ERRORS",
		convertedTags.filter((v) => v.error),
	);

	return JSON.stringify(
		PluralKitSystem.parse({
			version: 2,
			id: makeid(6),
			uuid: crypto.randomUUID(),
			created: new Date(),

			name: system.systemName.substring(0, 100),
			description: system.systemDescription
				? system.systemDescription.substring(0, 100)
				: null,
			tag: system.systemDisplayTag
				? system.systemDisplayTag?.substring(0, 100)
				: null,
			avatar_url: system.systemAvatar ?? null,
			pronouns: system.systemPronouns
				? system.systemPronouns?.substring(0, 100)
				: null,
			banner: system.systemBanner ?? null,
			color: null,
			privacy: {
				name_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.NAME,
				)
					? "public"
					: "private",
				avatar_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.AVATAR,
				)
					? "public"
					: "private",
				description_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.DESCRIPTION,
				)
					? "public"
					: "private",
				banner_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.BANNER,
				)
					? "public"
					: "private",
				pronoun_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.PRONOUNS,
				)
					? "public"
					: "private",
				member_list_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.ALTERS,
				)
					? "public"
					: "private",
				group_list_privacy: listFromMaskSystems(system.public).includes(
					SystemProtectionFlags.TAGS,
				)
					? "public"
					: "private",
				front_privacy: "private",
				front_history_privacy: "private",
			},
			webhook_url: null,
			config: {
				timezone: "UTC",
				pings_enabled: true,
				latch_timeout: null,
				member_default_private: false,
				group_default_private: false,
				show_private_info: true,
				member_limit: 1000,
				group_limit: 250,
				case_sensitive_proxy_tags: true,
				proxy_error_message_enabled: true,
				hid_display_split: false,
				hid_display_caps: false,
				hid_list_padding: "off",
				card_show_color_hex: false,
				proxy_switch: "off",
				name_format: null,
				description_templates: [],
			},
			accounts: [
				Number(system.associatedUserId),
				...(system.subAccounts ?? []).map((v) => Number(v)),
			],
			members: convertedAlters.map((v) => v.parsed.data),
			groups: convertedTags.map((v) => v.data),
			switches: [],
		}),
	);
}
