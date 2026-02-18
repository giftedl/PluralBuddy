import {
	AlterProtectionFlags,
	PAlterObject,
	PTagObject,
	TagProtectionFlags,
	TupperBoxSystem,
	type PAlter,
	type PTag,
} from "plurography";
import { ImportEntry, ImportOutput } from ".";
import z from "zod";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { combine } from "../privacy-bitmask";
import { alterCollection, tagCollection, userCollection } from "@/mongodb";

const TupperBoxImportEntry = z.object({
	existing: ImportEntry,
	import: TupperBoxSystem,
});
export type TBEntry = z.infer<typeof TupperBoxImportEntry>;

export async function replace(
	input: z.infer<typeof TupperBoxImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const { existing, import: tb } = TupperBoxImportEntry.parse(input);
	const newAlters = existing.alters
		.filter((alter) =>
			tb.tuppers.some(
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
			member: tb.tuppers.find(
				(v) =>
					v.name
						.replaceAll(" ", "")
						.replaceAll("/", "")
						.replaceAll("\\", "")
						.replaceAll("@", "") === alter.username,
			),
		}))
		.filter((c) => c.member !== undefined)
		.map(({ pluralbuddy, member }) => {
			const combinedBrackets: string[][] = [];

			Array.from(
				{ length: Math.floor((member?.brackets.length ?? 0) / 2) },
				(_, i) => {
					const slicableItem = member?.brackets.slice(i * 2, i * 2 + 2);
					if (slicableItem) combinedBrackets.push(slicableItem);
				},
			);

			return (
				member !== undefined && {
					zodData: PAlterObject.safeParse({
						alterId: pluralbuddy.alterId,
						systemId: existing.userId,
						username: member.name
							.replaceAll(" ", "")
							.replaceAll("/", "")
							.replaceAll("\\", "")
							.replaceAll("@", ""),
						displayName: member.nick ?? member.name,
						nameMap: pluralbuddy.nameMap,
						color: pluralbuddy.color,
						alterMode: "webhook",
						description: member.description,
						created: new Date(),
						pronouns: pluralbuddy.pronouns,
						avatarUrl: member.avatar_url ?? pluralbuddy.avatarUrl,
						webhookAvatarUrl: null,
						banner: member.banner,
						lastMessageTimestamp: null,
						messageCount: 0,
						proxyTags: combinedBrackets.map(([prefix, suffix]) => {
							return {
								prefix: prefix?.replaceAll('"', "") ?? "",
								suffix: suffix?.replaceAll('"', "") ?? "",
								id: Number(DiscordSnowflake.generate()).toString(),
							};
						}),
						tagIds: pluralbuddy.tagIds,
						public: pluralbuddy.public,
					} satisfies PAlter),
					originalPkId: member.id,
				}
			);
		})
		.filter((res) => res !== false);

	for (const replacedAlter of newAlters
		.map((c) => c.zodData)
		.filter((v) => v.data !== undefined)) {
		await alterCollection.replaceOne(
			{ alterId: replacedAlter.data?.alterId },
			replacedAlter.data,
		);
	}

	const correspondingTBTags = existing.tags
		.filter((tag) => tb.groups.some((v) => v.name === tag.tagFriendlyName))
		.map((tag) => ({
			pluralbuddy: tag,
			group: tb.groups.find((c) => tag.tagFriendlyName === c.name),
		}))
		.filter((c) => c.group !== undefined)
		.map(
			({ group, pluralbuddy }) =>
				group !== undefined &&
				PTagObject.safeParse({
					tagId: pluralbuddy.tagId,
					systemId: existing.userId,

					tagFriendlyName: group.name,
					tagDescription: group.description ?? undefined,
					tagColor: pluralbuddy.tagColor,

					associatedAlters: pluralbuddy.associatedAlters,

					public: pluralbuddy.public,
				} satisfies PTag),
		)
		.filter((res) => res !== false);

	for (const replacedTag of correspondingTBTags.filter(
		(v) => v.data !== undefined,
	))
		await tagCollection.replaceOne(
			{ tagId: replacedTag.data?.tagId },
			replacedTag.data,
		);

	return ImportOutput.parse({
		alters: newAlters.map((c) => c.zodData.data).filter((c) => c !== undefined),
		tags: correspondingTBTags.map((c) => c.data).filter((c) => c !== undefined),
		userId: existing.userId,
		affected: {
			alters: newAlters.length,
			tags: correspondingTBTags.length,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export async function add(
	input: z.infer<typeof TupperBoxImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const { existing, import: tb } = TupperBoxImportEntry.parse(input);

	const newAlters = tb.tuppers
		.filter((v) =>
			existing.alters.length > 0
				? existing.alters.some(
						(c) =>
							c.username !==
							v.name
								.replaceAll(" ", "")
								.replaceAll("/", "")
								.replaceAll("\\", "")
								.replaceAll("@", ""),
					)
				: true,
		)
		.map((member, i) => {
			const combinedBrackets: string[][] = [];

			Array.from(
				{ length: Math.floor((member?.brackets.length ?? 0) / 2) },
				(_, i) => {
					const slicableItem = member?.brackets.slice(i * 2, i * 2 + 2);
					if (slicableItem) combinedBrackets.push(slicableItem);
				},
			);

			return (
				member !== undefined && {
					zodData: PAlterObject.safeParse({
						alterId: Number(DiscordSnowflake.generate({ workerId: BigInt(i) })),
						systemId: existing.userId,
						username: member.name
							.replaceAll(" ", "")
							.replaceAll("/", "")
							.replaceAll("\\", "")
							.replaceAll("@", ""),
						displayName: member.nick ?? member.name,
						nameMap: [],
						color: null,
						alterMode: "webhook",
						description: member.description,
						created: new Date(),
						pronouns: null,
						avatarUrl: member.avatar_url,
						webhookAvatarUrl: null,
						banner: member.banner,
						lastMessageTimestamp: null,
						messageCount: 0,
						proxyTags: combinedBrackets.map(([prefix, suffix]) => {
							return {
								prefix: prefix?.replaceAll('"', "") ?? "",
								suffix: suffix?.replaceAll('"', "") ?? "",
								id: Number(DiscordSnowflake.generate()).toString(),
							};
						}),
						tagIds: [],
						// TupperBox has no permission values... lol
						public: 0,
					} satisfies PAlter),
					originalPkId: member.id,
				}
			);
		})
		.filter((v) => v !== false)
		.map((v) => v.zodData)
		.filter((v) => v.data !== undefined)
		.map((v) => v.data);

	if (newAlters.length > 0) await alterCollection.insertMany(newAlters);

	const newTags = tb.groups
		.filter((v) =>
			existing.tags.length > 0
				? existing.tags.some((tag) => v.name !== tag.tagFriendlyName)
				: true,
		)
		.map((group, i) =>
			PTagObject.safeParse({
				tagId: String(DiscordSnowflake.generate({ workerId: BigInt(i) })),
				systemId: existing.userId,

				tagFriendlyName: group.name,
				tagDescription: group.description ?? undefined,
				tagColor: "pink",

				associatedAlters: [],

				public: 0,
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
	input: z.infer<typeof TupperBoxImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const replaceInput = await replace(input);
	const addInput = await add({
		existing: replaceInput,
		import: input.import,
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

export async function deleteM(
	input: z.infer<typeof TupperBoxImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const pendingDeletedAlters = input.existing.alters.filter((v) =>
		input.import.tuppers.some((c) => v.username !== c.name),
	);

	await alterCollection.deleteMany({
		alterId: { $in: pendingDeletedAlters.map((v) => v.alterId) },
	});

	const pendingDeletedTags = input.existing.tags.filter((v) =>
		input.import.groups.some((c) => c.name === v.tagFriendlyName),
	);

	await tagCollection.deleteMany({
		tagId: { $in: pendingDeletedTags.map((v) => v.tagId) },
	});
	await userCollection.updateOne(
		{
			userId: input.existing.userId,
		},
		{
			$pull: {
				"system.alterIds": pendingDeletedAlters.map((v) => v.alterId),
				"system.tagIds": pendingDeletedTags.map((v) => v.tagId),
			},
		},
	);

	return ImportOutput.parse({
		alters: pendingDeletedAlters,
		tags: pendingDeletedTags,
		userId: input.existing.userId,
		affected: {
			alters: pendingDeletedAlters.length,
			tags: pendingDeletedTags.length,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export default {
	replace,
	add,
	both,
	deleteM,
};
