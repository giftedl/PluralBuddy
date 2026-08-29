import { z } from "zod";

export const terminologyDefaults = {
	alters: "alter",
	alters_plural: "alters",
	alters_capital: "Alter",
	tags: "tag", 
	tags_plural: "tags",
	tags_capital: "Tag",
	system: "system",
	system_plural: "systems",
	system_capital: "System",
	proxy_tag: "proxy tag",
	proxy_tags_plural: "proxy tags",
	display_tag: "display tag"
}

export const PTerminology = z.object({
	alters: z.string().max(15).default(terminologyDefaults.alters),
	alters_plural: z.string().max(15).default(terminologyDefaults.alters_plural),
	alters_capital: z.string().max(15).default(terminologyDefaults.alters_capital),
	tags: z.string().max(15).default(terminologyDefaults.tags),
	tags_plural: z.string().max(15).default(terminologyDefaults.tags_plural),
	tags_capital: z.string().max(15).default(terminologyDefaults.tags_capital),
	system: z.string().max(15).default(terminologyDefaults.system),
	system_plural: z.string().max(15).default(terminologyDefaults.system_plural),
	system_capital: z.string().max(15).default(terminologyDefaults.system_capital),
	display_tag: z.string().max(15).default(terminologyDefaults.display_tag),
	proxy_tag: z.string().max(15).default(terminologyDefaults.proxy_tag),
	proxy_tags_plural: z.string().max(15).default(terminologyDefaults.proxy_tags_plural),
}).optional();
export type PTerminology = z.infer<typeof PTerminology>;