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
import { alterCollection } from "@/mongodb";
import { getUserById, writeUserById } from "@/types/user";
import { combine } from "@/lib/privacy-bitmask";
import z from "zod";

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

		const file = ctx.interaction.getFiles(
			InteractionIdentifier.Setup.FormSelection.PkType.create(),
			true,
		)[0];
		if (!file) {
			throw new Error("?");
		}

		const MAX_FILE_SIZE = 2 * 1024 * 1024;
		if (file.size > MAX_FILE_SIZE) {
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

		const fileData = await (await fetch(file.url)).text();
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
			return PAlterObject.safeParse({
				alterId: Number(DiscordSnowflake.generate({ processId: BigInt(i) })),
				systemId: ctx.author.id,
				username: member.name,
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
							? [AlterProtectionFlags.MESSAGE_COUNT, AlterProtectionFlags.TAGS]
							: []),
						...(member.privacy.name_privacy === "public"
							? [AlterProtectionFlags.NAME, AlterProtectionFlags.USERNAME]
							: [])
					],
				),
			} satisfies PAlter);
		});

		systemData.alterIds = parsedSafe
			.filter((v) => v.success)
			.map((v) => v.data.alterId);

		if (parsedSafe.filter((v) => v.success).length !== 0)
			await alterCollection.insertMany(
				parsedSafe.filter((v) => v.success).map((v) => v.data),
			);

		await writeUserById(ctx.author.id, {
			...(await getUserById(ctx.author.id)),
			system: systemData,
		});

		return await ctx.editResponse({
			components: [
				...new AlertView(
					ctx.userTranslations(),
				).successViewCustom(`Successfully imported ${systemData.alterIds.length}/${data.members.length} alters.
${
	systemData.alterIds.length !== data.members.length
		? `> - ${parsedSafe
				.filter((v) => v.error !== undefined)
				.map((_, i) => `\`${data.members[i]?.id}\``)
				.join(
					", ",
				)} were unable to be added to the system due to validation issues.`
		: ""
}`),
			],
		});
	}
}
