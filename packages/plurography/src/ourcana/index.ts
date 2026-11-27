import z from "zod";
import { PAlterObject } from "../pluralbuddy/alter";
import { ImportNotation } from "../pluralbuddy/import-notation";
import { PSystemObject } from "../pluralbuddy/system";
import { PTagObject } from "../pluralbuddy/tag";
import { createRandomId } from "../pluralbuddy/util";
import type Converter from "../converters";
import { OurcanaExport, OurcanaNode } from "./export";
import { OurcanaGroupProperties } from "./group";
import { OurcanaMemberProperties } from "./member";
import { OurcanaSystemProperties } from "./system";

type OurcanaExportType = z.infer<typeof OurcanaExport>;
type OurcanaNodeType = z.infer<typeof OurcanaNode>;

const OurcanaEdge = z.object({
	from: z.string(),
	to: z.string(),
	type: z.string(),
});

export { OurcanaExport, OurcanaNode } from "./export";
export { OurcanaGroupProperties } from "./group";
export { OurcanaMemberProperties } from "./member";
export { OurcanaSystemProperties } from "./system";

export default class OurcanaConverter
	implements
		Converter<{
			system: OurcanaNodeType;
			alter: OurcanaNodeType;
			tag: OurcanaNodeType;
			import: OurcanaExportType;
		}>
{
	to(system: OurcanaNodeType, userId = "@me") {
		const properties = OurcanaSystemProperties.parse(system.properties);

		return PSystemObject.parse({
			associatedUserId: userId,
			systemName: (properties.username || "Untitled System").slice(0, 100),
			systemDescription: properties.desc?.slice(0, 4000) || undefined,
			systemAvatar: properties.avatarUrl || undefined,
			createdAt: new Date(),
			alterIds: [],
			tagIds: [],
			systemAutoproxy: [],
			systemOperationDM: true,
			public: 0,
		});
	}

	toAlter(alter: OurcanaNodeType, i = 0, userId = "@me") {
		const properties = OurcanaMemberProperties.parse(alter.properties);
		const name = properties.name || properties.displayName || `alter-${i + 1}`;
		const username =
			name.replace(/[\s@/\\]/gu, "").slice(0, 100) || `alter-${i + 1}`;

		return PAlterObject.parse({
			alterId: Number(createRandomId(i)),
			systemId: userId,
			username,
			displayName: (properties.displayName || properties.name || "Unknown Alter").slice(
				0,
				100,
			),
			nameMap: [],
			color:
				properties.color && /^#[0-9a-f]{6}$/i.test(properties.color)
					? properties.color
					: null,
			description: properties.desc?.slice(0, 1000) ?? null,
			created: new Date(),
			pronouns: properties.pronouns?.slice(0, 100) ?? null,
			avatarUrl: properties.avatarUrl || null,
			webhookAvatarUrl: properties.webhookAvatarUrl || null,
			banner: properties.bannerUrl || null,
			lastMessageTimestamp: null,
			messageCount: 0,
			alterMode: "webhook",
			proxyTags: properties.proxyTags.map((tag, index) => ({
				prefix: tag.prefix?.slice(0, 100) ?? "",
				suffix: tag.suffix?.slice(0, 100) ?? "",
				id: String(createRandomId(i * 1000 + index)),
			})),
			tagIds: [],
			public: 0,
			avatarUrlMap: {},
			fields: {
				"@/converter/ourcana": alter.id,
				...(properties.ourcanaId
					? { "@/ourcana/id": properties.ourcanaId }
					: {}),
			},
		});
	}

	toTag(tag: OurcanaNodeType, i = 0, userId = "@me") {
		const properties = OurcanaGroupProperties.parse(tag.properties);

		return PTagObject.parse({
			tagId: String(createRandomId(i)),
			systemId: userId,
			tagFriendlyName: (
				properties.displayName ||
				properties.label ||
				properties.name ||
				`Tag ${i + 1}`
			).slice(0, 100),
			tagDescription: properties.desc?.slice(0, 1000) ?? undefined,
			tagColor: "blue",
			associatedAlters: [],
			public: 0,
			fields: {
				"@/converter/ourcana": tag.id,
				...(properties.color ? { "@/custom-color": properties.color } : {}),
			},
		});
	}

	toImport(data: OurcanaExportType, userId = "@me") {
		const systemNode = data.graph.nodes.find((node) => node.type === "system");
		const system = systemNode ? this.to(systemNode, userId) : null;
		const usedTagNames = new Set<string>();
		const tags = data.graph.nodes
			.filter((node) => node.type === "tag")
			.map((node, index) => {
				const tag = this.toTag(node, index, userId);
				const baseName = tag.tagFriendlyName;
				let tagFriendlyName = baseName;
				let suffix = 1;

				while (usedTagNames.has(tagFriendlyName.toLowerCase())) {
					const ending = `-${suffix++}`;
					tagFriendlyName = `${baseName.slice(0, 100 - ending.length)}${ending}`;
				}

				usedTagNames.add(tagFriendlyName.toLowerCase());
				return { ...tag, tagFriendlyName };
			});
		const usedUsernames = new Set<string>();
		const alters = data.graph.nodes
			.filter((node) => node.type === "member")
			.map((node, index) => {
				const alter = this.toAlter(node, index, userId);
				const baseName = alter.username;
				let username = baseName;
				let suffix = 1;

				while (usedUsernames.has(username.toLowerCase())) {
					const ending = `-${suffix++}`;
					username = `${baseName.slice(0, 100 - ending.length)}${ending}`;
				}

				usedUsernames.add(username.toLowerCase());
				return { ...alter, username };
			});

		const altersBySourceId = new Map(
			alters.map((alter) => [alter.fields["@/converter/ourcana"], alter]),
		);
		const tagsBySourceId = new Map(
			tags.map((tag) => [tag.fields["@/converter/ourcana"], tag]),
		);

		for (const edge of data.graph.edges) {
			const parsedEdge = OurcanaEdge.safeParse(edge);
			if (!parsedEdge.success || parsedEdge.data.type !== "taggedWith") continue;

			const alter = altersBySourceId.get(parsedEdge.data.from);
			const tag = tagsBySourceId.get(parsedEdge.data.to);
			if (!alter || !tag) continue;

			if (!alter.tagIds.includes(tag.tagId)) alter.tagIds.push(tag.tagId);
			if (!tag.associatedAlters.includes(String(alter.alterId)))
				tag.associatedAlters.push(String(alter.alterId));
		}

		if (system) {
			system.alterIds = alters.map((alter) => alter.alterId);
			system.tagIds = tags.map((tag) => tag.tagId);
		}

		return ImportNotation.parse({ system, alters, tags });
	}

	from(system: z.infer<typeof PSystemObject>): OurcanaNodeType {
		return OurcanaNode.parse({
			id: `system_${crypto.randomUUID()}`,
			type: "system",
			properties: {
				username: system.systemName,
				desc: system.systemDescription ?? "",
				color: "",
				avatarUrl: system.systemAvatar ?? "",
				localAvatarPath: "",
				kind: "userOwned",
				mode: "authoring",
				ourcanaSystemId: crypto.randomUUID(),
			},
		});
	}

	fromAlter(data: z.infer<typeof PAlterObject>): OurcanaNodeType {
		return OurcanaNode.parse({
			id: `member_${crypto.randomUUID()}`,
			type: "member",
			properties: {
				name: data.username,
				displayName: data.displayName,
				pronouns: data.pronouns,
				desc: data.description ?? "",
				color: data.color ?? "",
				avatarUrl: data.avatarUrl ?? "",
				bannerUrl: data.banner ?? "",
				webhookAvatarUrl: data.webhookAvatarUrl ?? "",
				proxyTags: data.proxyTags.map(({ prefix, suffix }) => ({
					prefix,
					suffix,
				})),
				ourcanaId: crypto.randomUUID(),
			},
		});
	}

	fromTag(data: z.infer<typeof PTagObject>): OurcanaNodeType {
		return OurcanaNode.parse({
			id: `tag_${crypto.randomUUID()}`,
			type: "tag",
			properties: {
				name: data.tagFriendlyName,
				desc: data.tagDescription ?? "",
			},
		});
	}

	fromImport(data: z.infer<typeof ImportNotation>): OurcanaExportType {
		if (!data.system) throw new Error("no system");

		const system = this.from(data.system);
		const members = data.alters.map((alter) => this.fromAlter(alter));
		const tags = data.tags.map((tag) => this.fromTag(tag));

		return OurcanaExport.parse({
			format: "ourcana",
			version: 3,
			exportedAt: new Date(),
			graph: {
				nodes: [system, ...members, ...tags],
				edges: [],
			},
		});
	}
}
