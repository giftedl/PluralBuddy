import z from "zod";
import { ImportEntry, ImportOutput } from ".";
import { ImportNotation, type PAlter, type PTag } from "plurography";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { alterCollection, tagCollection, userCollection } from "@/mongodb";

const PluralBuddyImportEntry = z.object({
	existing: ImportEntry,
	import: ImportNotation,
});
export type PBEntry = z.infer<typeof PluralBuddyImportEntry>;

export async function replace(
	input: z.infer<typeof PluralBuddyImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const newAlters = input.import.alters
		.filter((v) => input.existing.alters.some((c) => c.username === v.username))
		.map((v) => ({
			existing: input.existing.alters.find((c) => c.username === v.username),
			import: v,
		}))
		.map(
			(v) =>
				({
					...v.import,
					systemId: input.existing.userId,
					lastMessageTimestamp: v.existing?.lastMessageTimestamp ?? null,
					messageCount: v.existing?.messageCount ?? 3,
					tagIds: v.existing?.tagIds ?? [],
					created: v.existing?.created ?? new Date(),

					alterId: v.existing?.alterId ?? 2,
				}) satisfies PAlter,
		);

	for (const replacedAlter of newAlters) {
		await alterCollection.replaceOne(
			{ alterId: replacedAlter.alterId },
			replacedAlter,
		);
	}

	const newTags = input.import.tags
		.filter((v) =>
			input.existing.tags.some((c) => c.tagFriendlyName === v.tagFriendlyName),
		)
		.map((v) => ({
			existing: input.existing.tags.find(
				(c) => c.tagFriendlyName === v.tagFriendlyName,
			),
			import: v,
		}))
		.map(
			(v) =>
				({
					...v.import,
					systemId: v.existing?.systemId ?? "2",
					tagId: v.existing?.tagId ?? "2",
					associatedAlters: v.existing?.associatedAlters ?? [],
				}) satisfies PTag,
		);

	for (const replacedTag of newTags) {
		await tagCollection.replaceOne({ tagId: replacedTag.tagId }, replacedTag);
	}

	return ImportOutput.parse({
		alters: newAlters,
		tags: newTags,
		userId: input.existing.userId,
		affected: {
			alters: newAlters.length,
			tags: newTags.length,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export async function add(
	input: z.infer<typeof PluralBuddyImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const newAlters = input.import.alters
		.filter((v) =>
			input.existing.alters.length > 0
				? input.existing.alters.some((c) => c.username !== v.username)
				: true,
		)
		.map(
			(v, i) =>
				({
					...v,
					systemId: input.existing.userId,
					lastMessageTimestamp: null,
					messageCount: 0,
					tagIds: [],
					created: new Date(),

					alterId: Number(DiscordSnowflake.generate({ workerId: BigInt(i) })),
				}) satisfies PAlter,
		);

	for (const replacedAlter of newAlters) {
		await alterCollection.replaceOne(
			{ alterId: replacedAlter.alterId },
			replacedAlter,
		);
	}

	const newTags = input.import.tags
		.filter((v) =>
			input.existing.tags.length > 0
				? input.existing.tags.some(
						(c) => c.tagFriendlyName === v.tagFriendlyName,
					)
				: true,
		)
		.map((v) => ({
			existing: input.existing.tags.find(
				(c) => c.tagFriendlyName === v.tagFriendlyName,
			),
			import: v,
		}))
		.map(
			(v) =>
				({
					...v.import,
					systemId: v.existing?.systemId ?? "2",
					tagId: v.existing?.tagId ?? "2",
					associatedAlters: v.existing?.associatedAlters ?? [],
				}) satisfies PTag,
		);

	for (const replacedTag of newTags) {
		await tagCollection.replaceOne({ tagId: replacedTag.tagId }, replacedTag);
	}

	return ImportOutput.parse({
		alters: newAlters,
		tags: newTags,
		userId: input.existing.userId,
		affected: {
			alters: newAlters.length,
			tags: newTags.length,
		},
	} satisfies z.infer<typeof ImportOutput>);
}

export async function both(
	input: z.infer<typeof PluralBuddyImportEntry>,
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
	input: z.infer<typeof PluralBuddyImportEntry>,
): Promise<z.infer<typeof ImportOutput>> {
	const pendingDeletedAlters = input.existing.alters.filter((v) =>
		input.import.alters.some((c) => c.username !== v.username),
	);

	await alterCollection.deleteMany({
		alterId: { $in: pendingDeletedAlters.map((v) => v.alterId) },
	});

	const pendingDeletedTags = input.existing.tags.filter((v) =>
		input.import.tags.some((c) => c.tagFriendlyName !== v.tagFriendlyName),
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
				"system.alterIds": { $in: pendingDeletedAlters.map((v) => v.alterId) },
				"system.tagIds": { $in: pendingDeletedTags.map((v) => v.tagId) },
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
