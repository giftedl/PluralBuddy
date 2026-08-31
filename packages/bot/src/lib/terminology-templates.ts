import { terminologyDefaults } from "plurography";

export const terminologyTemplates = [
	{
		name: "PluralBuddy",
		description: "The default, standard terminology from PluralBuddy.",
		data: terminologyDefaults,
	},
	{
		name: "PluralKit",
		description:
			"Standard across many other plurality platforms, aswell as PluralKit.",
		data: {
			alters: "member",
			alters_plural: "members",
			alters_capital: "Member",
			tags: "group",
			tags_plural: "groups",
			tags_capital: "Group",
			system: "system",
			system_plural: "systems",
			system_capital: "System",
			proxy_tag: "proxy tag",
			proxy_tags_plural: "proxy tags",
			display_tag: "system tag",
			proxy_tags_capital: "Proxy Tags",
		},
	},
	{
		name: "Tupperbox",
		description: "Uses language specific to Tupperbox.",
		data: {
			alters: "tupper",
			alters_plural: "tuppers",
			alters_capital: "Tupper",
			tags: "group",
			tags_plural: "groups",
			tags_capital: "Group",
			system: "user",
			system_plural: "users",
			system_capital: "User",
			proxy_tag: "bracket",
			proxy_tags_plural: "brackets",
			display_tag: "system tag",
			proxy_tags_capital: "Brackets"
		},
	},
];
