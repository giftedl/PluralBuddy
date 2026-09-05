import {
	type PAlter,
	PluralKitAPISystem,PluralKitConverter, 
	type PluralKitGroup,
	type PluralKitMember,
	type PSystem,
	type PTag
} from "plurography";
import type z from "zod";

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
	system: PSystem;
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
			...pluralbuddy.system,
			...simulatedSystemChange,
			alterIds: [
				...pluralbuddy.system.alterIds.filter((c) =>
					!deletionAlters.some(v => v.alterId === c),
				),
				...creationAlters.map((v) => v.alterId),
			],
            tagIds: [
                ...pluralbuddy.system.tagIds.filter((c) =>
                    !deletionTags.some(v => v.tagId === c)
                ),
                ...creationTags.map((v) => v.tagId)
            ]
		},
		alters: {
			add: creationAlters,
			update: updateAlters,
			remove: deletionAlters,
		},
		tags: { add: creationTags, update: updateTags, remove: deletionTags },
	};
}
