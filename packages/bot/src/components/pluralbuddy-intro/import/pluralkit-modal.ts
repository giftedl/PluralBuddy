/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ComponentCommand,
	ModalCommand,
	type ModalContext,
	type ComponentContext,
	ActionRow,
	Button,
	Container,
	TextDisplay,
} from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { LoadingView } from "../../../views/loading";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { PSystemObject, type PSystem } from "../../../types/system";
import { AlertView } from "../../../views/alert";
import { PluralKitSystem } from "plurography";
import { AlterProtectionFlags, PAlterObject, type PAlter } from "@/types/alter";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { alterCollection, tagCollection } from "@/mongodb";
import { getUserById, writeUserById } from "@/types/user";
import { combine } from "@/lib/privacy-bitmask";
import z from "zod";
import { PTagObject, TagProtectionFlags, type PTag } from "@/types/tag";
import { mentionCommand } from "@/lib/mention-command";
import { emojis } from "@/lib/emojis";

export default class PluralBuddyImportModal extends ModalCommand {
	override filter(ctx: ModalContext) {
		return InteractionIdentifier.Setup.FormSelection.PkForm.equals(
			ctx.customId,
		);
	}

	async run(ctx: ModalContext) {
		await ctx.interaction.update({
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		let fileData = "";

		const file = ctx.interaction.getFiles(
			InteractionIdentifier.Setup.FormSelection.PkType.create(),
		);

		if (file === undefined || file[0] === undefined) {
			fileData = ctx.interaction.getInputValue(
				InteractionIdentifier.Setup.FormSelection.PkRawTextType.create(),
			) as string;
		} else {
			if (!file) {
				throw new Error("?");
			}

			const MAX_FILE_SIZE = 2 * 1024 * 1024;
			if (file[0].size > MAX_FILE_SIZE) {
				return await ctx.editResponse({
					components: [
						...new AlertView(ctx.userTranslations()).errorView(
							"PLURALBUDDY_IMPORT_ERROR_TOO_LARGE",
						),
						new ActionRow().addComponents(
							new Button()
								.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
								.setCustomId(
									InteractionIdentifier.Setup.Pagination.Page2.create(),
								)
								.setStyle(ButtonStyle.Secondary),
						),
					],
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			}

			fileData = await (await fetch(file[0].url)).text();
		}
		try {
			JSON.parse(fileData);
		} catch (error) {
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"PLURALBUDDY_IMPORT_ERROR_INVALID_JSON",
					),
					new ActionRow().addComponents(
						new Button()
							.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
							.setCustomId(
								InteractionIdentifier.Setup.Pagination.Page2.create(),
							)
							.setStyle(ButtonStyle.Secondary),
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		const parsed = PluralKitSystem.safeParse(JSON.parse(fileData));

		if (parsed.error) {
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorViewCustom(
						ctx
							.userTranslations()
							.PLURALBUDDY_IMPORT_ERROR.replace(
								"%zod_errors%",
								z.prettifyError(parsed.error),
							),
					),
					new ActionRow().addComponents(
						new Button()
							.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
							.setCustomId(
								InteractionIdentifier.Setup.Pagination.Page2.create(),
							)
							.setStyle(ButtonStyle.Secondary),
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const { data } = parsed;
		const newSystem = PSystemObject.safeParse({
			associatedUserId: ctx.author.id,

			systemName: data.name ?? "Untitled System",
			systemAvatar: data.avatar_url ?? undefined,
			systemBanner: data.banner ?? undefined,
			systemDescription: data.description ?? undefined,
			systemDisplayTag: data.tag ?? undefined,
			systemPronouns: data.pronouns ?? undefined,

			alterIds: [],
			createdAt: new Date(),
			tagIds: [],
			systemAutoproxy: [],
			nicknameFormat: undefined,
			systemOperationDM: true,
			public: 0,
			subAccounts: [],
		} satisfies PSystem);

		if (newSystem.error) {
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorViewCustom(
						ctx
							.userTranslations()
							.PLURALBUDDY_IMPORT_ERROR.replace(
								"%zod_errors%",
								z.prettifyError(newSystem.error),
							),
					),
					new ActionRow().addComponents(
						new Button()
							.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
							.setCustomId(
								InteractionIdentifier.Setup.Pagination.Page2.create(),
							)
							.setStyle(ButtonStyle.Secondary),
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		const { data: systemData } = newSystem;

		const parsedSafe = data.members.map((member, i) => {
			return {
				zodData: PAlterObject.safeParse({
					alterId: Number(DiscordSnowflake.generate({ processId: BigInt(i) })),
					systemId: ctx.author.id,
					username: member.name.replaceAll(" ", "").replaceAll("/", "").replaceAll("\\", "").replaceAll("@", ""),
					displayName: member.display_name ?? member.name,
					nameMap: [],
					color: member.color,
					alterMode: "webhook",
					description: member.description,
					created: new Date(),
					pronouns: member.pronouns,
					avatarUrl: member.avatar_url ?? member.webhook_avatar_url,
					webhookAvatarUrl: null,
					banner: member.banner,
					lastMessageTimestamp: null,
					messageCount: 0,
					proxyTags: member.proxy_tags.map((tag) => {
						return {
							prefix: tag.prefix?.replaceAll('"', "") ?? "",
							suffix: tag.suffix?.replaceAll('"', "") ?? "",
							id: Number(DiscordSnowflake.generate()).toString(),
						};
					}),
					tagIds: [],
					public: combine(
						...[
							...(member.privacy.visibility === "public"
								? [AlterProtectionFlags.VISIBILITY]
								: []),
							...(member.privacy.pronoun_privacy === "public"
								? [AlterProtectionFlags.PRONOUNS]
								: []),
							...(member.privacy.description_privacy === "public"
								? [AlterProtectionFlags.DESCRIPTION]
								: []),
							...(member.privacy.avatar_privacy === "public"
								? [AlterProtectionFlags.AVATAR]
								: []),
							...(member.privacy.banner_privacy === "public"
								? [AlterProtectionFlags.BANNER]
								: []),
							...(member.privacy.metadata_privacy === "public"
								? [
										AlterProtectionFlags.MESSAGE_COUNT,
										AlterProtectionFlags.TAGS,
									]
								: []),
							...(member.privacy.name_privacy === "public"
								? [AlterProtectionFlags.NAME, AlterProtectionFlags.USERNAME]
								: []),
						],
					),
				} satisfies PAlter),
				originalPkId: member.id,
			};
		});

		const parsedGroupsSafe = data.groups.map((group, i) => {
			return PTagObject.safeParse({
				tagId: DiscordSnowflake.generate({ processId: BigInt(i) }).toString(),
				systemId: ctx.author.id,

				tagFriendlyName: group.display_name ?? group.name,
				tagDescription: group.description ?? undefined,
				tagColor: "pink",

				associatedAlters: parsedSafe
					.filter((c) => group.members.includes(c.originalPkId))
					.map((c) => c.zodData)
					.filter((c) => c.success)
					.map((c) => c.data.alterId.toString()),

				public: combine(
					...[
						...(group.privacy.description_privacy === "public"
							? [TagProtectionFlags.DESCRIPTION]
							: []),
						...(group.privacy.name_privacy === "public"
							? [TagProtectionFlags.NAME]
							: []),
						...(group.privacy.metadata_privacy === "public"
							? [TagProtectionFlags.ALTERS, TagProtectionFlags.COLOR]
							: []),
					],
				),
			} satisfies PTag);
		});

		parsedSafe.forEach((alterWrap) => {
			const alterId = alterWrap.zodData?.success
				? alterWrap.zodData.data.alterId?.toString()
				: null;
			if (alterId) {
				const tagIds = parsedGroupsSafe
					.filter((g) => g.success && g.data.associatedAlters.includes(alterId))
					.map((g) => g.data?.tagId);

				if (alterWrap.zodData.success) {
					alterWrap.zodData.data.tagIds = tagIds.filter((c) => c !== undefined);
				}
			}
		});

		systemData.alterIds = parsedSafe
			.map((v) => v.zodData)
			.filter((v) => v.success)
			.map((v) => v.data.alterId);

		systemData.tagIds = parsedGroupsSafe
			.filter((v) => v.success)
			.map((v) => v.data.tagId);

		if (parsedSafe.filter((v) => v.zodData.success).length !== 0)
			await alterCollection.insertMany(
				parsedSafe
					.map((v) => v.zodData)
					.filter((v) => v.success)
					.map((v) => v.data),
			);
		if (parsedGroupsSafe.filter((v) => v.success).length !== 0)
			await tagCollection.insertMany(
				parsedGroupsSafe.filter((v) => v.success).map((v) => v.data),
			);

		await writeUserById(ctx.author.id, {
			...(await getUserById(ctx.author.id)),
			system: systemData,
		});

		return await ctx.editResponse({
			components: [
				...new AlertView(
					ctx.userTranslations(),
				).successViewCustom(`Successfully imported your PluralKit system!

> **Disclaimer:** You may feel your system might not be completely identical to PluralKit. This is because the core data structure of some resources are different from PluralKit's and as a result may not be identical.
${
	systemData.alterIds.length !== data.members.length
		? `> - **Alters (members)**: ${parsedSafe
				.filter((v) => v.zodData.error !== undefined)
				.map((_, i) => `\`${data.members[i]?.id}\``)
				.join(
					", ",
				)} were unable to be added to the system due to validation issues.`
		: ""
}${
	systemData.tagIds.length !== data.groups.length
		? `> - **Tags (groups)**: ${parsedGroupsSafe
				.filter((v) => v.error !== undefined)
				.map((_, i) => `\`${data.groups[i]?.id}\``)
				.join(
					", ",
				)} were unable to be added to the system due to validation issues.`
		: ""
}
### Next Steps
> - To create a new alter, try using ${mentionCommand(
					(await ctx.getDefaultPrefix()) ?? "",
					"system create-alter",
					ctx.interaction.message?.messageReference === undefined,
					"%username% %display name%",
				)}
> - To create a new tag, try using ${mentionCommand(
					(await ctx.getDefaultPrefix()) ?? "",
					"system create-tag",
					ctx.interaction.message?.messageReference === undefined,
					"%name%",
				)}
`),
				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
						)
						.setLabel("Configure System")
						.setEmoji(emojis.wrenchWhite)
						.setStyle(ButtonStyle.Primary),
				),
			],
		});
	}
}
