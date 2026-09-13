import { ObjectId } from "bson";
import {
	type PAlter,
	PAlterObject,
	PluralKitAPISystem,
	PluralKitConverter,
	type PluralKitGroup,
	type PluralKitMember,
	type PSystem,
	type PTag,
	PTagObject,
	type PUser,
} from "plurography";
import type z from "zod";
import {
	alterCollection,
	importTranscriptCollection,
	tagCollection,
	userCollection,
} from "@/mongodb";
import { hexToBuffer } from "./hex-buffer-operation";
import { pk } from "./pk-api";
import { decryptToken } from "./pk-token-encryption";

type SyncEngineAction<K> = {
	add: Array<K>;
	remove: Array<K>;
	update: Array<K>;
};

export function runSandboxActions({
	pluralbuddy,
	pluralkit,
	authorId,
}: {
	pluralkit: {
		members: Array<z.infer<typeof PluralKitMember>>;
		groups: Array<z.infer<typeof PluralKitGroup>>;
		system: z.infer<typeof PluralKitAPISystem>;
	};
	pluralbuddy: {
		alters: Array<PAlter>;
		tags: Array<PTag>;
		system: PSystem;
	};
	authorId: string;
}): {
	alters: SyncEngineAction<PAlter>;
	tags: SyncEngineAction<PTag>;
	system: {
		destructive: PSystem;
		nondestructive: PSystem;
	};
} {
	const systemParsed = PluralKitAPISystem.parse(pluralkit.system);
	const simulatedSystemChange = {
		systemDescription:
			systemParsed.description ??
			pluralbuddy.system.systemDescription ??
			undefined,
		systemAvatar: systemParsed.avatar_url,
		systemBanner: systemParsed.banner,
		systemPronouns: systemParsed.pronouns,
		systemName: systemParsed.name ?? pluralbuddy.system.systemName ?? undefined,
		systemDisplayTag:
			systemParsed.tag ?? pluralbuddy.system.systemDisplayTag ?? undefined,
	};

	const usernames = pluralbuddy.alters.map((c) => c.username);
	const pkUsernames = pluralkit.members.map((c) => c.name);
	const converter = new PluralKitConverter();

	const creationAlters: Array<PAlter> = [];
	const updateAlters: Array<PAlter> = [];
	const deletionAlters: Array<PAlter> = [];

	pluralkit.members
		.filter(
			(c) =>
				!(
					usernames.includes(c.display_name ?? "") || usernames.includes(c.name)
				),
		)
		.forEach((c, i) => creationAlters.push(converter.toAlter(c, i, authorId)));

	pluralkit.members
		.filter(
			(c) =>
				usernames.includes(c.display_name ?? "") || usernames.includes(c.name),
		)
		.forEach((v, i) => {
			const possibleAlter = pluralbuddy.alters.find(
				(c) => c.username === v.display_name || c.username === v.name,
			);
			const newAlter = converter._syncUpdateAlter(v, i);

			if (
				JSON.stringify(sortObject(PAlterObject.parse(possibleAlter))) ===
				JSON.stringify(
					sortObject(
						PAlterObject.parse({
							...possibleAlter,
							...newAlter,
						}),
					),
				)
			)
				return;

			if (possibleAlter)
				updateAlters.push({
					...possibleAlter,
					...converter._syncUpdateAlter(v, i),
				});
		});

	pluralbuddy.alters
		.filter(
			(c) =>
				!(
					pkUsernames.includes(c.displayName) ||
					pkUsernames.includes(c.username)
				),
		)
		.forEach((v, i) => deletionAlters.push(v));

	const tagFriendlyNames = pluralbuddy.tags.map((c) => c.tagFriendlyName);
	const pkGroupNames = pluralkit.groups.map((c) => c.name);

	const creationTags: Array<PTag> = [];
	const updateTags: Array<PTag> = [];
	const deletionTags: Array<PTag> = [];

	pluralkit.groups
		.filter(
			(c) =>
				!(
					tagFriendlyNames.includes(c.display_name ?? "") ||
					tagFriendlyNames.includes(c.name)
				),
		)
		.forEach((c, i) => creationTags.push(converter.toTag(c, i, authorId)));

	pluralkit.groups
		.filter(
			(c) =>
				tagFriendlyNames.includes(c.display_name ?? "") ||
				tagFriendlyNames.includes(c.name),
		)
		.forEach((v, i) => {
			const possibleTag = pluralbuddy.tags.find(
				(c) =>
					c.tagFriendlyName === v.display_name || c.tagFriendlyName === v.name,
			);

			if (
				JSON.stringify(sortObject(PTagObject.parse(possibleTag))) ===
				JSON.stringify(
					sortObject(
						PTagObject.parse({
							...possibleTag,
							...converter._syncUpdateTag(v, i),
						}),
					),
				)
			)
				return;

			if (possibleTag)
				updateTags.push({
					...possibleTag,
					...converter._syncUpdateTag(v, i),
				});
		});

	pluralbuddy.tags
		.filter((c) => !pkGroupNames.includes(c.tagFriendlyName))
		.forEach((v, i) => deletionTags.push(v));

	return {
		system: {
			destructive: {
				...pluralbuddy.system,
				...simulatedSystemChange,
				alterIds: [
					...pluralbuddy.system.alterIds.filter(
						(c) => !deletionAlters.some((v) => v.alterId === c),
					),
					...creationAlters.map((v) => v.alterId),
				],
				tagIds: [
					...pluralbuddy.system.tagIds.filter(
						(c) => !deletionTags.some((v) => v.tagId === c),
					),
					...creationTags.map((v) => v.tagId),
				],
			},
			nondestructive: {
				...pluralbuddy.system,
				...simulatedSystemChange,
				alterIds: [
					...pluralbuddy.system.alterIds,
					...creationAlters.map((v) => v.alterId),
				],
				tagIds: [
					...pluralbuddy.system.tagIds,
					...creationTags.map((v) => v.tagId),
				],
			},
		},
		alters: {
			add: creationAlters,
			update: updateAlters,
			remove: deletionAlters,
		},
		tags: { add: creationTags, update: updateTags, remove: deletionTags },
	};
}

function sortObject(
	obj:
		| Record<
				string,
				| string
				| number
				| unknown[]
				| Record<string, string | undefined>
				| Date
				| undefined
				| null
		  >
		| Date
		| unknown[],
) {
	if ("length" in obj || "getDate" in obj) {
		return obj;
	}

	return Object.keys(obj)
		.sort()
		.reduce((sorted: Record<string, unknown>, key) => {
			sorted[key] =
				typeof obj[key] === "object" && obj[key] !== null
					? sortObject(obj[key])
					: obj[key];
			return sorted;
		}, {});
}

export async function automaticallySync({
	syncConfiguration,
	userId,
	system: systemPB,
}: PUser) {
	console.log({

		autoEnabled: syncConfiguration?.pluralkit?.automatic?.enabled,
		tokenEnabled: syncConfiguration?.pluralkit?.token,
		systemExists: systemPB,
		timeCorrect: Date.now() -
			(syncConfiguration?.pluralkit?.lastSynced ?? new Date()).valueOf() <
			1800000
	})
	if (
		!syncConfiguration?.pluralkit?.automatic?.enabled ||
		!syncConfiguration.pluralkit.token ||
		!systemPB ||
		Date.now() -
			(syncConfiguration.pluralkit.lastSynced ?? new Date()).valueOf() <
			1800000
	) {
		return;
	}

	// update first to avoid duplicate requests from subsequent messages
	await userCollection.updateOne(
		{ userId },
		{ $set: { "syncConfiguration.pluralkit.lastSynced": new Date() } },
	);
	console.log("sync", userId);

	const token = await decryptToken(
		syncConfiguration.pluralkit.token.i,
		syncConfiguration.pluralkit.token.v,
	);
	const destructive =
		syncConfiguration?.pluralkit?.automatic?.destructive ?? false;

	const system = await pk(token).systemsCollection.findOne({
		userId: "@me",
	});
	const members = await pk(token).membersCollection.find({
		userId: "@me",
	});
	const groups = await pk(token).groupsCollection.find({
		userId: "@me",
	});

	const alters = await alterCollection.find({ systemId: userId }).toArray();
	const tags = await tagCollection.find({ systemId: userId }).toArray();

	const transcript = runSandboxActions({
		pluralbuddy: { alters, tags, system: systemPB },
		authorId: userId,
		pluralkit: {
			members: members,
			system,
			groups: groups,
		},
	});

	if (transcript.alters.add.length > 0)
		await alterCollection.insertMany(transcript.alters.add);

	await Promise.all(
		transcript.alters.update.map(async (element) => {
			await alterCollection.replaceOne(
				{ alterId: element.alterId, systemId: element.systemId },
				element,
			);
		}),
	);

	if (transcript.alters.remove.length > 0 && destructive)
		await alterCollection.deleteMany({
			alterId: {
				$in: transcript.alters.remove.map((v) => Number(v.alterId)),
			},
			systemId: userId,
		});
}
