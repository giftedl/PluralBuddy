import z from "zod";
import { DiscordOpenPluralExtension } from "@/openplural/discord-extension";
import { OpenPluralExport } from "@/openplural/export";
import { OpenPluralGroup } from "@/openplural/group";
import { OpenPluralMember } from "@/openplural/member";
import { PluralBuddySystemExtension } from "@/openplural/pluralbuddy-extension";
import { OpenPluralSystem } from "@/openplural/system";
import { AlterProtectionFlags } from "@/pluralbuddy/alter";
import {
	PSystem,
	PSystemObject,
	SystemFlags,
	SystemProtectionFlags,
} from "@/pluralbuddy/system";
import { TagProtectionFlags } from "@/pluralbuddy/tag";
import Converter from ".";

export default class OpenPluralConverter
	implements
		Converter<{
			system: z.infer<typeof OpenPluralSystem>;
			alter: z.infer<typeof OpenPluralMember>;
			tag: z.infer<typeof OpenPluralGroup>;
			import: z.infer<typeof OpenPluralExport>;
		}>
{
	to(system: z.infer<typeof OpenPluralSystem>) {
		return PSystemObject.parse({
			associatedUserId:
				DiscordOpenPluralExtension.parse(system.extensions.discord)?.user_id ??
				"@me",
			systemName: system.name,
			systemDisplayTag: system.tag ?? undefined,
			displayTagMap:
				PluralBuddySystemExtension.parse(system.extensions.pluralbuddy_system)
					?.display_tag_map ?? {},
			alterIds: [],
			tagIds: [],
			createdAt:
				PluralBuddySystemExtension.parse(system.extensions.pluralbuddy_system)
					?.creation_date ?? new Date(),
			systemAutoproxy: [],
			systemOperationDM:
				PluralBuddySystemExtension.parse(system.extensions.pluralbuddy_system)
					?.system_operation_dm ?? false,
			public: system.privacy.visibility === "public" ? 255 : 0,
			flags: this.combine(
				...[
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.keep_pronouns === true
						? [SystemFlags.INCLUDE_PRONOUNS]
						: []),
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.keep_proxy_tags === true
						? [SystemFlags.KEEP_PROXY_TAGS]
						: []),
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.prefer_accessiblity === true
						? [SystemFlags.PREFER_ACCESSIBLITY]
						: []),
					...(PluralBuddySystemExtension.parse(
						system.extensions.pluralbuddy_system,
					)?.no_typing_status === true
						? [SystemFlags.NO_TYPING_STATUS]
						: []),
				],
			),
			disabledGuilds: DiscordOpenPluralExtension.parse(
				system.extensions.discord,
			)?.disabled_guilds ?? [],
            subAccounts: [],
            disabled: system.archived
		} satisfies PSystem);
	}
	private combine(
		...perms: (
			| SystemProtectionFlags
			| AlterProtectionFlags
			| TagProtectionFlags
            | SystemFlags
		)[]
	): number {
		return perms.reduce((mask, p) => mask | p, 0);
	}
}
