import z from "zod";
import { DiscordOpenPluralExtension } from "@/openplural/discord-extension";
import { OpenPluralExport } from "@/openplural/export";
import { OpenPluralGroup } from "@/openplural/group";
import { OpenPluralMember } from "@/openplural/member";
import {
	PluralBuddyAlterExtension,
	PluralBuddySystemExtension,
} from "@/openplural/pluralbuddy-extension";
import { OpenPluralSystem } from "@/openplural/system";
import {
	AlterFlags,
	AlterProtectionFlags,
	PAlter,
	PAlterObject,
} from "@/pluralbuddy/alter";
import { ImportNotation } from "@/pluralbuddy/import-notation";
import {
	PSystem,
	PSystemObject,
	SystemFlags,
	SystemProtectionFlags,
} from "@/pluralbuddy/system";
import { PTag, PTagObject, TagProtectionFlags } from "@/pluralbuddy/tag";
import { createRandomId } from "@/pluralbuddy/util";
import Converter from ".";

export default class OpenPluralConverter
	implements
		Converter<{
			system: z.infer<typeof OpenPluralSystem>;
			alter: z.infer<typeof OpenPluralMember>;
			tag: z.infer<typeof OpenPluralGroup>;
			import: z.infer<typeof OpenPluralExport>;
		}>
{
	to(system: z.infer<typeof OpenPluralSystem>, userId?: string) {
		return PSystemObject.parse({
			associatedUserId:
				userId ??
				DiscordOpenPluralExtension.parse(system.extensions.discord)?.user_id ??
				"@me",
			systemName: system.name,
			systemDisplayTag: system.tag ?? undefined,
			displayTagMap:
				PluralBuddySystemExtension.parse(system.extensions.pluralbuddy_system)
					?.display_tag_map ?? {},
			alterIds: [],
			tagIds: [],
			createdAt:
				PluralBuddySystemExtension.parse(system.extensions.pluralbuddy_system)
					?.creation_date ?? new Date(),
			systemAutoproxy: [],
			systemOperationDM:
				PluralBuddySystemExtension.parse(system.extensions.pluralbuddy_system)
					?.system_operation_dm ?? false,
			public: system.privacy.visibility === "public" ? 255 : 0,
			flags: this.combine(
				...[
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.keep_pronouns === true
						? [SystemFlags.INCLUDE_PRONOUNS]
						: []),
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.keep_proxy_tags === true
						? [SystemFlags.KEEP_PROXY_TAGS]
						: []),
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.prefer_accessiblity === true
						? [SystemFlags.PREFER_ACCESSIBLITY]
						: []),
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.no_typing_status === true
						? [SystemFlags.NO_TYPING_STATUS]
						: []),
				],
			),
			disabledGuilds:
				DiscordOpenPluralExtension.parse(system.extensions.discord)
					?.disabled_guilds ?? [],
			subAccounts: [],
			disabled: system.archived,
		} satisfies PSystem);
	}

	toAlter(
		alter: z.infer<typeof OpenPluralMember>,
		i?: number,
		userId?: string,
	) {
		let birthdayDate = alter.birthday !== null ? new Date() : null;

		if (birthdayDate !== null) {
			const [year, month, date] = (alter.birthday?.value ?? "").split("-");
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
			alterId: Number(createRandomId(i ?? 0)),
			systemId:
				userId ??
				DiscordOpenPluralExtension.parse(alter.extensions.discord)?.user_id ??
				"@me",
			username: (
				alter.name ??
				alter.display_name ??
				`nameless-${crypto.randomUUID()}`
			)
				.replaceAll(" ", "")
				.replaceAll("/", "")
				.replaceAll("\\", "")
				.replaceAll("@", ""),
			displayName: alter.display_name ?? alter.name ?? "Unknown Alter",
			nameMap: [],
			color: alter.color,
			description: alter.description,
			created: alter.created_at,
			pronouns: alter.pronouns,
			avatarUrl:
				alter.avatar_asset_id !== null
					? `op-asset://${alter.avatar_asset_id}`
					: "",
			banner:
				alter.banner_asset_id !== null
					? `op-asset://${alter.banner_asset_id}`
					: "",
			avatarUrlMap: {},
			webhookAvatarUrl:
				PluralBuddyAlterExtension.parse(alter.extensions.pluralbuddy_alter)
					?.webhook_avatar_url ?? null,
			lastMessageTimestamp:
				PluralBuddyAlterExtension.parse(alter.extensions.pluralbuddy_alter)
					?.last_message ?? null,
			messageCount:
				PluralBuddyAlterExtension.parse(alter.extensions.pluralbuddy_alter)
					?.message_count ?? 0,
			alterMode:
				PluralBuddyAlterExtension.parse(alter.extensions.pluralbuddy_alter)
					?.alter_mode ?? "webhook",
			proxyTags: alter.proxy_tags.map((c, i) => ({
				...c,
				id: Number(createRandomId(i)).toString(),
			})),
			tagIds: [],
			public: alter.privacy.visibility === "public" ? 1023 : 0,
			flags: this.combine(
				...[
					...(PluralBuddyAlterExtension.parse(
						alter.extensions.pluralbuddy_system,
					)?.proxy_tags_kept === true
						? [SystemFlags.KEEP_PROXY_TAGS]
						: []),
				],
			),
			fields: {
				"@/converter/openplural": alter.id,
				"@/openplural/is_custom_front": String(alter.is_custom_front),
				"@/openplural/sort_order": String(alter.sort_order),
				...(birthdayDate !== null
					? { "@/birthday": birthdayDate.toISOString() }
					: {}),
			},
		} satisfies PAlter);
	}
	toTag(tag: z.infer<typeof OpenPluralGroup>, i?: number, userId?: string) {
		return PTagObject.parse({
			tagId: createRandomId(i ?? 0).toString(),
			systemId:
				userId ??
				DiscordOpenPluralExtension.parse(tag.extensions.discord)?.user_id ??
				"@me",
			tagFriendlyName:
				tag.emoji && tag.name ? `${tag.emoji} ${tag.name}` : tag.name,
			tagColor: "amber",
			associatedAlters: [],
			public: 0,
			fields: {
				"@/converter/openplural": tag.id,
				"@/openplural/sort_order": String(tag.sort_order),
				...(tag.color !== null ? { "@/custom-color": tag.color } : {}),
			},
		} satisfies PTag);
	}
	toImport(data: z.infer<typeof OpenPluralExport>, userId?: string) {
		const system = this.to(data.systems[0]);
		const tags = data.groups.map((v, i) => this.toTag(v, i, userId));
		let alters = data.members.map((v, i) => this.toAlter(v, i, userId));

		alters = alters.map((v) => ({
			...v,
			avatarUrl:
				v.avatarUrl !== null
					? (data.assets.find(
							(c) => c.id === v.avatarUrl?.slice("op-asset://".length),
						)?.uri ?? null)
					: null,
			banner:
				v.banner !== null
					? (data.assets.find(
							(c) => c.id === v.banner?.slice("op-asset://".length),
						)?.uri ?? null)
					: null,
		}));

		data.group_memberships.forEach((element) => {
			const alterIndex = alters.findIndex(
				(c) => c.fields["@/converter/openplural"] === element.member_id,
			);
			const tagIndex = tags.findIndex(
				(c) => c.fields["@/converter/openplural"] === element.group_id,
			);

			if (alterIndex !== -1 && tagIndex !== -1) {
				alters[alterIndex] = {
					...alters[alterIndex],
					tagIds: [...alters[alterIndex].tagIds, tags[tagIndex].tagId],
				};
				tags[tagIndex] = {
					...tags[tagIndex],
					associatedAlters: [
						...tags[tagIndex].associatedAlters,
						alters[alterIndex].alterId.toString(),
					],
				};
			}
		});

		system.tagIds = tags.map((v) => v.tagId);
		system.alterIds = alters.map((v) => v.alterId);

		return ImportNotation.parse({
			alters,
			tags,
			system,
		} as z.infer<typeof ImportNotation>);
	}

	from(system: PSystem, handleAsset?: (url: string) => string) {
		return OpenPluralSystem.parse({
			parent_system_id: null,
			id: crypto.randomUUID(),
			name: system.systemName,
			display_name: system.systemName,
			description: system.systemDescription ?? null,
			tag: system.systemDisplayTag ?? null,
			color: null,
			avatar_asset_id: system.systemAvatar
				? handleAsset === undefined
					? crypto.randomUUID()
					: handleAsset(system.systemAvatar)
				: null,
			banner_asset_id: system.systemBanner
				? handleAsset === undefined
					? crypto.randomUUID()
					: handleAsset(system.systemBanner)
				: null,
			archived: false,
			privacy:
				system.public > 0
					? {
							visibility: "public",
							source: { __pluralbuddy: system.public },
						}
					: {
							visibility: "private",
							source: { __pluralbuddy: system.public },
						},
			settings: {},
			source_refs: [
				{
					app: "plurography",
					collection: "systems",
					id: system.associatedUserId,
					uuid: null,
				},
			],
			extensions: {
				discord: DiscordOpenPluralExtension.parse({
					user_id: system.associatedUserId,
					disabled_guilds: system.disabledGuilds,
				}),
				pluralbuddy_system: PluralBuddySystemExtension.parse({
					keep_proxy_tags: this.getSystemFeatures(system).keepProxyTags,
					keep_pronouns: this.getSystemFeatures(system).includePronouns,
					prefer_accessiblity:
						this.getSystemFeatures(system).preferAccessiblity,
					no_typing_status: this.getSystemFeatures(system).noTypingStatus,
					creation_date: system.createdAt,
					display_tag_map: system.displayTagMap,
					system_operation_dm: system.systemOperationDM,
				} satisfies z.infer<typeof PluralBuddySystemExtension>),
			},
		} satisfies z.infer<typeof OpenPluralSystem>);
	}

	fromAlter(data: PAlter, handleAsset?: (url: string) => string) {
		return OpenPluralMember.parse({
			id: crypto.randomUUID(),
			name: data.username,
			display_name: data.displayName,
			pronouns: data.pronouns,
			description: data.description,
			age: null,
			birthday:
				data.fields["@/birthday"] === undefined
					? {
							value: `${new Date(data.fields["@/birthday"]).getFullYear()}-${new Date(data.fields["@/birthday"]).getMonth().toString().padStart(2, "0")}-${new Date(data.fields["@/birthday"]).getDate().toString().padStart(2, "0")}`,
							precision: "day",
							year_visible: true,
						}
					: null,
			color: data.color,
			avatar_asset_id: data.avatarUrl
				? handleAsset === undefined
					? crypto.randomUUID()
					: handleAsset(data.avatarUrl)
				: null,
			banner_asset_id: data.banner
				? handleAsset === undefined
					? crypto.randomUUID()
					: handleAsset(data.banner)
				: null,
			proxy_tags: data.proxyTags,
			is_custom_front: data.fields["@/openplural/is_custom_front"] === "true",
            archived: false,
            sort_order: Number(data.fields["@/openplural/sort-order"]),
            created_at
		} satisfies z.infer<typeof OpenPluralMember>);
	}

	private combine(
		...perms: (
			| SystemProtectionFlags
			| AlterProtectionFlags
			| TagProtectionFlags
			| SystemFlags
			| AlterFlags
		)[]
	): number {
		return perms.reduce((mask, p) => mask | p, 0);
	}

	private getSystemFeatures(data: PSystem) {
		return {
			keepProxyTags: ((data.flags ?? 0) & SystemFlags.KEEP_PROXY_TAGS) !== 0,
			includePronouns: ((data.flags ?? 0) & SystemFlags.INCLUDE_PRONOUNS) !== 0,
			noTypingStatus: ((data.flags ?? 0) & SystemFlags.NO_TYPING_STATUS) !== 0,
			preferAccessiblity:
				((data.flags ?? 0) & SystemFlags.PREFER_ACCESSIBLITY) !== 0,

			has: (flag: SystemFlags) => ((data.flags ?? 0) & flag) !== 0,
			disable: (flag: SystemFlags) =>
				((data.flags ?? 0) & flag) === 0 /* doesn't have flag */
					? (data.flags ?? 0)
					: (data.flags ?? 0) - flag,
			enable: (flag: SystemFlags) =>
				((data.flags ?? 0) & flag) !== 0 /* does have flag */
					? (data.flags ?? 0)
					: (data.flags ?? 0) + flag,
			bool: (flag: SystemFlags, bool?: boolean) =>
				bool
					? ((data.flags ?? 0) & flag) !== 0 /* does have flag */
						? (data.flags ?? 0)
						: (data.flags ?? 0) + flag
					: ((data.flags ?? 0) & flag) === 0 /* doesn't have flag */
						? (data.flags ?? 0)
						: (data.flags ?? 0) - flag,
		};
	}
}
