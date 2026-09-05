import { DiscordSnowflake } from "@sapphire/snowflake";
import z from "zod";
import { PAlter, PAlterObject } from "../pluralbuddy/alter";
import { ImportNotation } from "../pluralbuddy/import-notation";
import { PTag, PTagObject } from "../pluralbuddy/tag";
import { createRandomId } from "../pluralbuddy/util";
import { TupperBoxSystem } from "../tupperbox";
import { TupperBoxGroup } from "../tupperbox/group";
import { Tupper } from "../tupperbox/tupper";
import Converter from ".";

export default class TupperBoxConverter
	implements
		Converter<{
			system: null;
			alter: z.infer<typeof Tupper>;
			tag: z.infer<typeof TupperBoxGroup>;
			import: z.infer<typeof TupperBoxSystem>;
		}>
{
	to() {
		return null;
	}
	toAlter(
		alter: z.infer<typeof Tupper>,
		i?: number,
		userId: string = "@me",
	): PAlter {
		const date = new Date();
		date.setSeconds(i ?? 0);

		const combinedBrackets: string[][] = [];

		Array.from(
			{ length: Math.floor((alter?.brackets.length ?? 0) / 2) },
			(_, i) => {
				const slicableItem = alter?.brackets.slice(i * 2, i * 2 + 2);
				if (slicableItem) combinedBrackets.push(slicableItem);
			},
		);

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
			displayName: alter.nick ?? alter.name,
			nameMap: [],
			color: null,
			alterMode: "webhook",
			description: alter.description,
			created: new Date(),
			pronouns: null,
			avatarUrl: alter.avatar_url,
			webhookAvatarUrl: null,
			banner: alter.banner,
			lastMessageTimestamp: null,
			messageCount: 0,
			proxyTags: combinedBrackets.map(([prefix, suffix], i) => {
				return {
					prefix: prefix?.replaceAll('"', "") ?? "",
					suffix: suffix?.replaceAll('"', "") ?? "",
					id: createRandomId(i),
				};
			}),
			tagIds: alter.tag == null ? [] : [alter.tag],
			// TupperBox has no permission values... lol
			public: 0,
			avatarUrlMap: {},
			fields: {
				"@/converter/tupper": String(alter.id),
				...(alter.birthday !== null ? { "@/birthday": alter.birthday } : {}),
			},
		});
	}
	toImport(
		data: z.infer<typeof TupperBoxSystem>,
		userId: string = "@me",
	): z.infer<typeof ImportNotation> {
		let alters = data.tuppers.map((c, i) => this.toAlter(c, i, userId));
		let tags = data.groups.map((c, i) => this.toTag(c, i));

		for (const alter in alters) {
			const tagIds = [] as string[];

			if (alters[alter].tagIds.length !== 0) {
				const foundTag = tags.find(
					(v) => v.fields["@/converter/tupper"] === alters[alter].tagIds[0],
				);

				if (foundTag) tagIds.push(foundTag.tagId);
			}

			alters[alter] = { ...alters[alter], tagIds };
		}

		return ImportNotation.parse({
			alters,
			tags,
			system: null,
		});
	}
	toTag(
		tag: z.infer<typeof TupperBoxGroup>,
		i?: number,
		userId: string = "@me",
	): PTag {
		return PTagObject.parse({
			tagId: String(createRandomId(i ?? 0)),
			systemId: userId,

			tagFriendlyName: tag.name,
			tagDescription: tag.description ?? undefined,
			tagColor: "blue",

			associatedAlters: [],
			public: 0,
			fields: {
				"@/converter/tupper": String(tag.id),
				...(tag.tag !== null ? { "@/tag": tag.tag } : {}),
				...(tag.avatar !== null ? { "@/icon": tag.avatar } : {}),
			}
		} satisfies PTag);
	}
	from(): null {
		return null;
	}
	fromAlter(data: PAlter, i?: number): z.infer<typeof Tupper> {
		return Tupper.parse({
			id: createRandomId(i ?? 0),
			name: data.username,
			brackets: data.proxyTags.flatMap((c) => [c.prefix, c.suffix]),
			avatar_url: data.avatarUrl ?? "",
			avatar: null,
			banner: data.banner,
			posts: 0,
			show_brackets: false,
			birthday: data.fields["@/birthday"] ?? null,
			description: data.description,
			group_id: data.tagIds[0] !== undefined ? Number(data.tagIds[0]) : null,
			nick: data.displayName,
			created_at: data.created,
			tag: null,
			last_used: data.lastMessageTimestamp,
		} satisfies z.infer<typeof Tupper>);
	}
	fromImport(
		data: z.infer<typeof ImportNotation>,
	): z.infer<typeof TupperBoxSystem> {
        return TupperBoxSystem.parse({
            tuppers: data.alters.map(v => this.fromAlter(v)),
            groups: data.tags.map(v => this.fromTag(v))
        } satisfies z.infer<typeof TupperBoxSystem>);
    }
	fromTag(data: PTag): z.infer<typeof TupperBoxGroup> {
		return TupperBoxGroup.parse({
			id: Number(data.tagId),
			name: data.tagFriendlyName,
			avatar: data.fields["@/icon"] ?? null,
			description: data.tagDescription ?? "",
			tag: data.fields["@/tag"] ?? null,
		} satisfies z.input<typeof TupperBoxGroup>);
	}
}
