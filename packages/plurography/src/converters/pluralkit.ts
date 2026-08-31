import { DiscordSnowflake } from "@sapphire/snowflake";
import z from "zod";
import {
	AlterProtectionFlags,
	PAlter,
	PAlterObject,
} from "@/pluralbuddy/alter";
import { ImportNotation } from "@/pluralbuddy/import-notation";
import {
	listFromMaskAlters,
	listFromMaskSystems,
	listFromMaskTags,
} from "@/pluralbuddy/privacy-bitmask";
import {
	PSystem,
	PSystemObject,
	SystemProtectionFlags,
} from "@/pluralbuddy/system";
import { PTag, PTagObject, TagProtectionFlags } from "@/pluralbuddy/tag";
import { PluralKitGroup } from "@/pluralkit/group";
import { PluralKitMember } from "@/pluralkit/member";
import { makePkId, PluralKitSystem, PluralKitSystemType } from "../pluralkit";
import Converter from ".";

export default class PluralKitConverter
	implements
		Converter<{
			system: PluralKitSystemType;
			alter: z.infer<typeof PluralKitMember>;
			tag: z.infer<typeof PluralKitGroup>;
			import: PluralKitSystemType;
		}>
{
	to(system: PluralKitSystemType): PSystem {
		return PSystemObject.parse({
			associatedUserId: String(system.accounts[0]),
			systemName: system.name ?? "Untitled System",
			systemAvatar: system.avatar_url ?? undefined,
			systemBanner: system.banner ?? undefined,
			systemDescription: system.description ?? undefined,
			systemDisplayTag: system.tag ?? undefined,
			systemPronouns: system.pronouns ?? undefined,

			alterIds: [],
			createdAt: system.created,
			tagIds: [],
			systemAutoproxy: [],
			nicknameFormat: undefined,
			systemOperationDM: true,
			public: this.combine(
				...[
					...(system.privacy.name_privacy === "public"
						? [SystemProtectionFlags.NAME]
						: []),
					...(system.privacy.avatar_privacy === "public"
						? [SystemProtectionFlags.AVATAR]
						: []),
					...(system.privacy.banner_privacy === "public"
						? [SystemProtectionFlags.BANNER]
						: []),
					...(system.privacy.description_privacy === "public"
						? [SystemProtectionFlags.DESCRIPTION]
						: []),
					...(system.privacy.group_list_privacy === "public"
						? [SystemProtectionFlags.TAGS]
						: []),
					...(system.privacy.member_list_privacy === "public"
						? [SystemProtectionFlags.ALTERS]
						: []),
					...(system.privacy.pronoun_privacy === "public"
						? [SystemProtectionFlags.PRONOUNS]
						: []),
				],
			),
			displayTagMap: {},
			subAccounts: [],
			disabled: false,
			flags: 0,
			disabledGuilds: [],
		} satisfies PSystem);
	}
	toAlter(
		alter: z.infer<typeof PluralKitMember>,
		i?: number,
		userId: string = "@me",
	) {
		const date = new Date();
		date.setSeconds(i ?? 0);

		let birthdayDate = alter.birthday ? new Date() : null;

		if (birthdayDate !== null) {
			const [year, month, date] = (alter.birthday ?? "").split("-");
			if (
				Number.isNaN(Number(year)) ||
				Number.isNaN(Number(month)) ||
				Number.isNaN(Number(date))
			) {
				birthdayDate = null;
			} else
				birthdayDate.setFullYear(Number(year), Number(month), Number(date));
		}

		return PAlterObject.parse({
			alterId: Number(
				DiscordSnowflake.generate({
					timestamp: date,
					workerId: BigInt(i ?? 0),
					processId: BigInt(Math.floor(Math.random() * 1000)),
				}),
			),
			systemId: userId ?? "@me",
			username: alter.name
				.replaceAll(" ", "")
				.replaceAll("/", "")
				.replaceAll("\\", "")
				.replaceAll("@", ""),
			displayName: alter.name ?? alter.display_name,
			nameMap: [],
			color: alter.color !== null ? `#${alter.color}` : null,
			alterMode: "webhook",
			description: alter.description,
			created: alter.created,
			pronouns: alter.pronouns,
			avatarUrl: alter.avatar_url ?? alter.webhook_avatar_url,
			webhookAvatarUrl: null,
			banner: alter.banner,
			lastMessageTimestamp: alter.last_message_timestamp ?? new Date(),
			messageCount: alter.message_count,
			proxyTags: alter.proxy_tags.map((tag, i) => {
				const date = new Date();
				date.setSeconds(i ?? 0);

				const id = DiscordSnowflake.generate({
					timestamp: date,
					workerId: BigInt(i ?? 0),
					processId: BigInt(Math.floor(Math.random() * 1000)),
				});

				return {
					prefix: tag.prefix?.replaceAll('"', "") ?? "",
					suffix: tag.suffix?.replaceAll('"', "") ?? "",
					id: Number(id).toString(),
				};
			}),
			tagIds: [],
			public: this.combine(
				...[
					...(alter.privacy.visibility === "public"
						? [AlterProtectionFlags.VISIBILITY]
						: []),
					...(alter.privacy.pronoun_privacy === "public"
						? [AlterProtectionFlags.PRONOUNS]
						: []),
					...(alter.privacy.description_privacy === "public"
						? [AlterProtectionFlags.DESCRIPTION]
						: []),
					...(alter.privacy.avatar_privacy === "public"
						? [AlterProtectionFlags.AVATAR]
						: []),
					...(alter.privacy.banner_privacy === "public"
						? [AlterProtectionFlags.BANNER]
						: []),
					...(alter.privacy.metadata_privacy === "public"
						? [AlterProtectionFlags.MESSAGE_COUNT, AlterProtectionFlags.TAGS]
						: []),
					...(alter.privacy.name_privacy === "public"
						? [AlterProtectionFlags.NAME, AlterProtectionFlags.USERNAME]
						: []),
				],
			),
			avatarUrlMap: {},
			fields: {
				"@/converter/pk": alter.id,
				...(birthdayDate !== null
					? { "@/birthday": birthdayDate.toISOString() }
					: {}),
			},
			flags: 0
		} satisfies PAlter);
	}
	toImport(data: PluralKitSystemType): z.infer<typeof ImportNotation> {
		let alters = data.members.map((v, i) =>
			this.toAlter(v, i, String(data.accounts[0])),
		);
		let tags = data.groups.map((v, i) =>
			this.toTag(v, i, String(data.accounts[0])),
		);
		const systemData = this.to(data);

		systemData.alterIds = alters.map((v) => v.alterId);
		systemData.tagIds = tags.map((v) => v.tagId);

		alters = alters.map((v) => ({
			...v,
			tagIds: v.tagIds
				.map((id) => tags.find((o) => o.fields["@/converter/pk"] === id))
				.filter((v) => v !== undefined)
				.map((c) => c.tagId),
		}));
		tags = tags.map((v) => ({
			...v,
			associatedAlters: alters
				.filter((c) => c.tagIds.includes(v.tagId))
				.map((v) => String(v.alterId)),
		}));

		return ImportNotation.parse({
			system: systemData,
			alters: alters,
			tags: tags,
		} satisfies z.infer<typeof ImportNotation>);
	}
	toTag(
		tag: z.infer<typeof PluralKitGroup>,
		i?: number,
		userId: string = "@me",
	) {
		const date = new Date();
		date.setSeconds(i ?? 0);

		return PTagObject.parse({
			tagId: DiscordSnowflake.generate({
				timestamp: date,
				workerId: BigInt(i ?? 0),
				processId: BigInt(Math.floor(Math.random() * 1000)),
			}).toString(),
			systemId: userId,

			tagFriendlyName: tag.display_name ?? tag.name,
			tagDescription: tag.description ?? undefined,
			tagColor: "pink",

			associatedAlters: tag.members,

			public: this.combine(
				...[
					...(tag.privacy.description_privacy === "public"
						? [TagProtectionFlags.DESCRIPTION]
						: []),
					...(tag.privacy.name_privacy === "public"
						? [TagProtectionFlags.NAME]
						: []),
					...(tag.privacy.metadata_privacy === "public"
						? [TagProtectionFlags.ALTERS, TagProtectionFlags.COLOR]
						: []),
				],
			),
			fields: {
				"@/converter/pk": tag.id.substring(0, 30),
				...(tag.color !== null ? { "@/custom-color": tag.color } : {}),
				...(tag.icon !== null ? { "@/icon": tag.icon } : {}),
				...(tag.banner !== null ? { "@/banner": tag.banner } : {}),
			},
		} satisfies PTag);
	}

	from(system: PSystem): PluralKitSystemType {
		return PluralKitSystem.parse({
			version: 2,
			id: makePkId(6),
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
			members: [],
			groups: [],
			switches: [],
		} satisfies PluralKitSystemType);
	}
	fromAlter(data: PAlter): z.infer<typeof PluralKitMember> {
		return PluralKitMember.parse({
			id: makePkId(6),
			uuid: crypto.randomUUID(),
			name: data.username.substring(0, 100),
			display_name: data.displayName.substring(0, 100),
			color: data.color !== null ? data.color.slice(1) : null,
			birthday: data.fields["@/birthday"] ?? null,
			avatar_url: data.avatarUrl,
			webhook_avatar_url: null,
			pronouns: data.pronouns ? data.pronouns?.substring(0, 100) : null,
			banner: data.banner,
			description: data.description,
			created: data.created,
			keep_proxy: false,
			tts: false,
			autoproxy_enabled: false,
			message_count: data.messageCount,
			last_message_timestamp: data.lastMessageTimestamp,
			proxy_tags: data.proxyTags.map((c) => ({
				prefix: c.prefix,
				suffix: c.suffix,
			})),
			privacy: {
				visibility: listFromMaskAlters(data.public).includes(
					AlterProtectionFlags.VISIBILITY,
				)
					? "public"
					: "private",
				name_privacy: listFromMaskAlters(data.public).includes(
					AlterProtectionFlags.NAME,
				)
					? "public"
					: "private",
				description_privacy: listFromMaskAlters(data.public).includes(
					AlterProtectionFlags.DESCRIPTION,
				)
					? "public"
					: "private",
				banner_privacy: listFromMaskAlters(data.public).includes(
					AlterProtectionFlags.BANNER,
				)
					? "public"
					: "private",
				birthday_privacy: "private",
				pronoun_privacy: listFromMaskAlters(data.public).includes(
					AlterProtectionFlags.PRONOUNS,
				)
					? "public"
					: "private",
				avatar_privacy: listFromMaskAlters(data.public).includes(
					AlterProtectionFlags.AVATAR,
				)
					? "public"
					: "private",
				metadata_privacy: "private",
				proxy_privacy: "private",
			},
		} satisfies z.infer<typeof PluralKitMember>);
	}
	fromImport(data: z.infer<typeof ImportNotation>): PluralKitSystemType {
		let members = data.alters.map((v) => ({
			oldId: v.alterId,
			parsed: this.fromAlter(v),
		}));
		let groups = data.tags.map((v) => this.fromTag(v));

		groups = groups.map((v) => ({
			...v,
			members: v.members
				.map((c) => members.find((m) => String(m.oldId) === c))
				.filter((v) => v !== undefined)
				.map((v) => v.parsed.id),
		}));

		return PluralKitSystem.parse({
			...this.from(data.system as PSystem),
			members: members.map((c) => c.parsed),
			groups,
		} satisfies PluralKitSystemType);
	}
	fromTag(data: PTag): z.infer<typeof PluralKitGroup> {
		return PluralKitGroup.parse(
			{
				id: makePkId(6),
				uuid: crypto.randomUUID(),
				name: data.tagFriendlyName.substring(0, 100).replaceAll(" ", ""),
				display_name: data.tagFriendlyName.substring(0, 100),
				description: data.tagDescription ?? null,
				icon: data.fields["@/icon"] ?? null,
				banner: data.fields["@/banner"] ?? null,
				color: data.fields["@/custom-color"] ?? null,
				created: new Date(),
				members: data.associatedAlters,

				privacy: {
					name_privacy: listFromMaskTags(data.public).includes(
						TagProtectionFlags.NAME,
					)
						? "public"
						: "private",
					description_privacy: listFromMaskTags(data.public).includes(
						TagProtectionFlags.DESCRIPTION,
					)
						? "public"
						: "private",
					banner_privacy: "private",
					icon_privacy: "private",
					list_privacy: listFromMaskTags(data.public).includes(
						TagProtectionFlags.ALTERS,
					)
						? "public"
						: "private",
					metadata_privacy: "private",
					visibility: "private",
				},
			} /** satisfies z.infer<typeof PluralKitGroup> */,
		);
	}

	private combine(
		...perms: (
			| SystemProtectionFlags
			| AlterProtectionFlags
			| TagProtectionFlags
		)[]
	): number {
		return perms.reduce((mask, p) => mask | p, 0);
	}
}
