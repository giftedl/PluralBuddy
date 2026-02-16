import z from "zod";
import { ImportEntry } from ".";
import {
	AlterProtectionFlags,
	PAlterObject,
	PluralKitSystem,
	PTagObject,
	TagProtectionFlags,
	type PAlter,
	type PTag,
} from "plurography";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { combine } from "../privacy-bitmask";

const PluralKitImportEntry = z.object({
	existing: ImportEntry,
	pk: PluralKitSystem,
});

export async function replace(
	input: z.infer<typeof PluralKitImportEntry>,
): Promise<z.infer<typeof ImportEntry> | null> {
	const { existing, pk } = PluralKitImportEntry.parse(input);
	const newAlters = existing.alters
		.filter((alter) =>
			pk.members.some(
				(v) =>
					v.name
						.replaceAll(" ", "")
						.replaceAll("/", "")
						.replaceAll("\\", "")
						.replaceAll("@", "") === alter.username,
			),
		)
		.map((alter) => ({
			pluralbuddy: alter,
			member: pk.members.find(
				(v) =>
					v.name
						.replaceAll(" ", "")
						.replaceAll("/", "")
						.replaceAll("\\", "")
						.replaceAll("@", "") === alter.username,
			),
		}))
		.filter((c) => c.member !== undefined)
		.map(
			({ pluralbuddy, member }) =>
				member !== undefined && {
					zodData: PAlterObject.safeParse({
						alterId: pluralbuddy.alterId,
						systemId: existing.userId,
						username: member.name
							.replaceAll(" ", "")
							.replaceAll("/", "")
							.replaceAll("\\", "")
							.replaceAll("@", ""),
						displayName: member.display_name ?? member.name,
						nameMap: pluralbuddy.nameMap,
						color: member.color !== null ? `#${member.color}` : null,
						alterMode: "webhook",
						description: member.description,
						created: new Date(),
						pronouns: member.pronouns,
						avatarUrl: member.avatar_url ?? member.webhook_avatar_url,
						webhookAvatarUrl: null,
						banner: member.banner,
						lastMessageTimestamp: null,
						messageCount: 0,
						proxyTags: member.proxy_tags.map((tag) => {
							return {
								prefix: tag.prefix?.replaceAll('"', "") ?? "",
								suffix: tag.suffix?.replaceAll('"', "") ?? "",
								id: Number(DiscordSnowflake.generate()).toString(),
							};
						}),
						tagIds: pluralbuddy.tagIds,
						public: combine(
							...[
								...(member.privacy.visibility === "public"
									? [AlterProtectionFlags.VISIBILITY]
									: []),
								...(member.privacy.pronoun_privacy === "public"
									? [AlterProtectionFlags.PRONOUNS]
									: []),
								...(member.privacy.description_privacy === "public"
									? [AlterProtectionFlags.DESCRIPTION]
									: []),
								...(member.privacy.avatar_privacy === "public"
									? [AlterProtectionFlags.AVATAR]
									: []),
								...(member.privacy.banner_privacy === "public"
									? [AlterProtectionFlags.BANNER]
									: []),
								...(member.privacy.metadata_privacy === "public"
									? [
											AlterProtectionFlags.MESSAGE_COUNT,
											AlterProtectionFlags.TAGS,
										]
									: []),
								...(member.privacy.name_privacy === "public"
									? [AlterProtectionFlags.NAME, AlterProtectionFlags.USERNAME]
									: []),
							],
						),
					} satisfies PAlter),
					originalPkId: member.id,
				},
		)
		.filter((res) => res !== false);

	const correspondingPKTags = existing.tags
		.filter((tag) =>
			pk.groups.some((v) => v.display_name ?? v.name === tag.tagFriendlyName),
		)
		.map((tag) => ({
			pluralbuddy: tag,
			group: pk.groups.find(
				(c) => tag.tagFriendlyName === (c.display_name ?? c.name),
			),
		}))
		.filter((c) => c.group !== undefined)
		.map(
			({ group, pluralbuddy }) =>
				group !== undefined &&
				PTagObject.safeParse({
					tagId: pluralbuddy.tagId,
					systemId: existing.userId,

					tagFriendlyName: group.display_name ?? group.name,
					tagDescription: group.description ?? undefined,
					tagColor: "pink",

					associatedAlters: pluralbuddy.associatedAlters,

					public: combine(
						...[
							...(group.privacy.description_privacy === "public"
								? [TagProtectionFlags.DESCRIPTION]
								: []),
							...(group.privacy.name_privacy === "public"
								? [TagProtectionFlags.NAME]
								: []),
							...(group.privacy.metadata_privacy === "public"
								? [TagProtectionFlags.ALTERS, TagProtectionFlags.COLOR]
								: []),
						],
					),
				} satisfies PTag),
		)
		.filter((res) => res !== false);

	// TODO: finish
	return ImportEntry.parse({
		alters: existing.alters.map((alter) => {
			const replacement = newAlters.find((na) => {
				const member = pk.members.find((m) => m.id === na.originalPkId);
				const sanitized = member
					? member.name
							.replaceAll(" ", "")
							.replaceAll("/", "")
							.replaceAll("\\", "")
							.replaceAll("@", "")
					: na.zodData.success
						? na.zodData.data.username
						: undefined;
				return sanitized === alter.username;
			});

			if (replacement) {
				return replacement.zodData.success ? replacement.zodData.data : alter;
			}

			return alter;
		}),
		tags: existing.tags.map((tag) => {
			const replacement = correspondingPKTags.find((na) => {
				const group = pk.groups.find(
					(group) =>
						group.display_name ?? group.name === na.data?.tagFriendlyName,
				);
				const sanitized = group
					? (group.display_name ?? group.name)
					: na.success
						? na.data.tagFriendlyName
						: undefined;
				return sanitized === tag.tagFriendlyName;
			});

			if (replacement) {
				return replacement.success ? replacement.data : tag;
			}

			return tag;
		}),
		userId: existing.userId,
	} satisfies z.infer<typeof ImportEntry>);
}

export async function add() {}

export default {
	replace,
};
