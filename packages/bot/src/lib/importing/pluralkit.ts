import z from "zod";
import { ImportEntry, ImportOutput } from ".";
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
import { alterCollection, tagCollection, userCollection } from "@/mongodb";

const PluralKitImportEntry = z.object({
	existing: ImportEntry,
	pk: PluralKitSystem,
});

export async function replace(
	input: z.infer<typeof PluralKitImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
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

	for (const replacedAlter of newAlters
		.map((c) => c.zodData)
		.filter((v) => v.data !== undefined)) {
		console.log("change!");
		await alterCollection.replaceOne(
			{ alterId: replacedAlter.data?.alterId },
			replacedAlter.data,
		);
	}

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

	for (const replacedTag of correspondingPKTags.filter(
		(v) => v.data !== undefined,
	))
		await tagCollection.replaceOne(
			{ tagId: replacedTag.data?.tagId },
			replacedTag.data,
		);

	return ImportOutput.parse({
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
		affected: {
			alters: newAlters.length,
			tags: correspondingPKTags.length,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export async function add(
	input: z.infer<typeof PluralKitImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const { existing, pk } = PluralKitImportEntry.parse(input);

	const newAlters = pk.members
		.filter((v) =>
			existing.alters.some(
				(c) =>
					c.username !==
					v.name
						.replaceAll(" ", "")
						.replaceAll("/", "")
						.replaceAll("\\", "")
						.replaceAll("@", ""),
			),
		)
		.map(
			(member, i) =>
				member !== undefined && {
					zodData: PAlterObject.safeParse({
						alterId: Number(DiscordSnowflake.generate({ workerId: BigInt(i) })),
						systemId: existing.userId,
						username: member.name
							.replaceAll(" ", "")
							.replaceAll("/", "")
							.replaceAll("\\", "")
							.replaceAll("@", ""),
						displayName: member.display_name ?? member.name,
						nameMap: [],
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
						tagIds: [],
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
		.filter((v) => v !== false)
		.map((v) => v.zodData)
		.filter((v) => v.data !== undefined)
		.map((v) => v.data);

	if (newAlters.length > 0) await alterCollection.insertMany(newAlters);

	const newTags = pk.groups
		.filter((v) =>
			existing.tags.some(
				(tag) => v.display_name ?? v.name !== tag.tagFriendlyName,
			),
		)
		.map((group, i) =>
			PTagObject.safeParse({
				tagId: String(DiscordSnowflake.generate({ workerId: BigInt(i) })),
				systemId: existing.userId,

				tagFriendlyName: group.display_name ?? group.name,
				tagDescription: group.description ?? undefined,
				tagColor: "pink",

				associatedAlters: [],

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
		.filter((v) => v.data !== undefined)
		.map((v) => v.data);

	if (newTags.length > 0) await tagCollection.insertMany(newTags);

	await userCollection.updateOne(
		{
			userId: existing.userId,
		},
		{
			$push: {
				"system.alterIds": newAlters.map((c) => c.alterId),
				"system.tagIds": newTags.map((c) => c.tagId),
			},
		},
	);

	return ImportOutput.parse({
		alters: [...existing.alters, ...newAlters],
		tags: [...existing.tags, ...newTags],
		userId: existing.userId,
		affected: {
			alters: newAlters.length,
			tags: newTags.length,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export async function both(
	input: z.infer<typeof PluralKitImportEntry>,
): Promise<z.infer<typeof ImportOutput> | null> {
	const replaceInput = await replace(input);
	const addInput = await add({
		existing: replaceInput,
		pk: input.pk,
	});

	return ImportOutput.parse({
		alters: addInput?.alters ?? [],
		tags: addInput?.tags ?? [],
		userId: input.existing.userId,
		affected: {
			alters: replaceInput.affected.alters + addInput.affected.alters,
			tags: replaceInput.affected.tags + addInput.affected.tags,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export default {
	replace,
	add,
	both,
};
