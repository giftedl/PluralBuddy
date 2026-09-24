import { Double, ObjectId } from "bson";
import pkceChallenge from "pkce-challenge";
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
import { client, logger } from "..";
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
	logger?.info("parsed system")

	const usernames = pluralbuddy.alters.map((c) => c.username);
	const displayNames = pluralbuddy.alters.map((c) => c.displayName);
	const existingPkIds = pluralbuddy.alters.map(c => (c.fields ?? {})["@/converter/pk"] ?? "")
	const pkUsernames = pluralkit.members.map((c) => c.name);
	const converter = new PluralKitConverter();

	const creationAlters: Array<PAlter> = [];
	const updateAlters: Array<PAlter> = [];
	const deletionAlters: Array<PAlter> = [];

	pluralkit.members
		.filter(
			(c) =>
				!(
					existingPkIds.includes(c.uuid) || displayNames.includes(c.display_name ?? "") || usernames.includes(c.name)
				),
		)
		.forEach((c, i) => creationAlters.push(converter.toAlter(c, i, authorId)));

	pluralkit.members
		.filter(
			(c) =>
				existingPkIds.includes(c.uuid) || displayNames.includes(c.display_name ?? "") || usernames.includes(c.name)
		)
		.forEach((v, i) => {
			const possibleAlter = pluralbuddy.alters.find(
				(c) => (c.fields ?? {})["@/converter/pk"] === v.uuid || c.displayName === v.display_name || c.username === v.name,
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
		).filter(v => v !== undefined)
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

export type WriteBackArguments = (
	| {
		type: "system";
		id: "@me";
		change: Partial<PSystem>;
	}
	| {
		type: "alter" | "create-alter";
		/**  The PluralKit ID of the member. */
		id: string;
		change: Partial<PAlter> & { userId?: string };
	}
	| {
		type: "tag" | "create-tag";
		/**  The PluralKit ID of the group. */
		id: string;
		change: Partial<PTag> & { userId?: string };
	}
	| {
		type: "member-group-relationship";
		id: string;
		change: { groupId: string; type: "add" | "remove" };
	}
) & { syncConfig: PUser["syncConfiguration"] };

export async function writeBack({
	type,
	id,
	change,
	syncConfig,
}: WriteBackArguments) {
	const pkSyncConfig = syncConfig?.pluralkit;

	if (
		!pkSyncConfig ||
		!(pkSyncConfig.writeBack?.enabled ?? false) ||
		!pkSyncConfig.token
	)
		return;

	const token = await decryptToken(
		pkSyncConfig.token?.i,
		pkSyncConfig.token?.v,
	);
	const pkRuntime = pk(token);
	const pkConverter = new PluralKitConverter();

	if (type === "system") {
		const updatedPartialSystem = pkConverter._syncUpdateSystem(change);

		await pkRuntime.systemsCollection.updateOne(
			{ userId: "@me" },
			updatedPartialSystem,
		);
	}

	if (type === "alter") {
		const updatedPartialAlter = pkConverter._syncUpdateAlterBack(change);

		await pkRuntime.membersCollection.updateOne(
			{ memberId: id },
			updatedPartialAlter,
		);
	}

	if (type === "tag") {
		const updatedPartialTag = pkConverter._syncUpdateTagBack(change);

		await pkRuntime.groupsCollection.updateOne(
			{ groupId: id },
			updatedPartialTag,
		);
	}

	if (type === "create-alter") {
		const { userId, ...alter } = change;
		const updatedPartialAlter = pkConverter._syncUpdateAlterBack(alter);

		if (updatedPartialAlter.name === undefined)
			throw new Error("name required to create a group");

		const { uuid } = await pkRuntime.membersCollection.insertOne(
			updatedPartialAlter as Partial<z.infer<typeof PluralKitMember>> & {
				name: string;
			},
		);

		await alterCollection.updateOne(
			{ alterId: new Double(Number(id)), systemId: userId },
			{ $set: { 'fields.@/converter/pk': uuid } },
		);
	}

	if (type === "create-tag") {
		const { userId, ...tag } = change;
		const updatedPartialTag = pkConverter._syncUpdateTagBack(tag);

		if (updatedPartialTag.name === undefined)
			throw new Error("name required to create a group");

		const { uuid } = await pkRuntime.groupsCollection.insertOne(
			updatedPartialTag as Partial<z.infer<typeof PluralKitGroup>> & {
				name: string;
			},
		);

		await tagCollection.updateOne(
			{ tagId: id, systemId: userId },
			{ $set: { 'fields.@/converter/pk': uuid } },
		);
	}

	if (type === "member-group-relationship") {
		if (change.type === "add") {
			await pkRuntime.addMemberGroupRelationship({
				groupId: change.groupId,
				memberId: id,
			});
		}
		if (change.type === "remove") {
			await pkRuntime.removeMemberGroupRelationship({
				groupId: change.groupId,
				memberId: id,
			});
		}
	}
}

export async function automaticallySync({
	syncConfiguration,
	userId,
	system: systemPB,
}: PUser) {
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


	if (transcript.tags.add.length > 0)
		await tagCollection.insertMany(transcript.tags.add);


	await Promise.all(
		transcript.tags.update.map(async (element) => {
			await tagCollection.replaceOne(
				{ tagId: element.tagId, systemId: element.systemId },
				element,
			);
		}),
	);

	if (transcript.tags.remove.length > 0 && destructive)
		await tagCollection.deleteMany({
			tagId: {
				$in: transcript.tags.remove.map((v) => v.tagId),
			},
			systemId: userId,
		});

	[...transcript.alters.update, ...transcript.alters.remove].forEach((v) => client.cache.alterProxy.remove(String(v.alterId)))

	await userCollection.updateOne({ userId }, { $set: { "system": destructive ? transcript.system.destructive : transcript.system.nondestructive } })


}
