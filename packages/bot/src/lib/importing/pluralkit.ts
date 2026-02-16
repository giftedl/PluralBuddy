import z from "zod";
import { ImportEntry } from ".";
import {
	AlterProtectionFlags,
	PAlterObject,
	PluralKitSystem,
	type PAlter,
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
			(c) =>
				c.group !== undefined && {
					a: "a",
				},
		);

	// TODO: finish
	return null;
}

export async function add() {}

export default {
	replace,
};
