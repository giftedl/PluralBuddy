import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { mentionCommand } from "@/lib/mention-command";
import { createRandomId } from "@/lib/random-id";
import { getSPAlters, getSPSystem, getSPTags } from "@/lib/simplyplural";
import { alterCollection, tagCollection } from "@/mongodb";
import { getUserById, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { PAlterObject, PSystemObject, PTagObject, type PSystem } from "plurography";
import { ActionRow, Button, ModalCommand, TextDisplay, type ModalContext } from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { sys } from "typescript";
import z from "zod";

export default class PluralBuddyImportModal extends ModalCommand {
	override filter(ctx: ModalContext) {
		return InteractionIdentifier.Setup.FormSelection.SpTokenForm.equals(
			ctx.customId,
		);
	}

	async run(ctx: ModalContext) {
		const token = ctx.interaction.getInputValue(
			InteractionIdentifier.Setup.FormSelection.SpToken.create(),
			true,
		) as string;

		await ctx.interaction.update({
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const system = await getSPSystem(token).catch((e) => null);

		if (!system)
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView("SP_ERROR"),
					new ActionRow().addComponents(
						new Button()
							.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
							.setCustomId(
								InteractionIdentifier.Setup.Pagination.Page2.create(),
							)
							.setStyle(ButtonStyle.Secondary)
					)
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});

		const alters = await getSPAlters(token, system.id).catch(() => null);
		const tags = await getSPTags(token, system.id).catch(() => null);

		if (!alters || !tags)
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView("SP_ERROR"),
					new ActionRow().addComponents(
						new Button()
							.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
							.setCustomId(
								InteractionIdentifier.Setup.Pagination.Page2.create(),
							)
							.setStyle(ButtonStyle.Secondary),
					)
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});

		const newSystem = PSystemObject.safeParse({
			associatedUserId: ctx.author.id,

			systemName: system.content.username ?? "Untitled System",
			systemAvatar: system.content.avatarUrl ?? undefined,
			systemBanner: undefined,
            displayTagMap: {},
			systemDescription: system.content.desc ?? undefined,
			systemDisplayTag: undefined,
			systemPronouns: undefined,

			alterIds: [],
			createdAt: new Date(),
			tagIds: [],
			systemAutoproxy: [],
			nicknameFormat: undefined,
			systemOperationDM: true,
			public: 0,
			subAccounts: [],
			disabled: false,
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

		const parsedSafe = alters.map((member, i) => {
			return {
				zodData: PAlterObject.safeParse({
					alterId: Number(DiscordSnowflake.generate({ processId: BigInt(i) })),
					systemId: ctx.author.id,
					username: member.content.name
						.replaceAll(" ", "")
						.replaceAll("/", "")
						.replaceAll("\\", "")
						.replaceAll("@", ""),
					displayName: member.content.name,
					nameMap: [],
					color:
						member.content.color !== null ? member.content.color : null,
					alterMode: "webhook",
					description: member.content.desc,
					created: new Date(),
					pronouns: member.content.pronouns,
					avatarUrl: member.content.avatarUrl,
					webhookAvatarUrl: null,
					banner: null,
					lastMessageTimestamp: null,
					messageCount: 0,
					proxyTags: [],
					tagIds: [],
					public: 0,
				}),
				originalSpId: member.id,
			};
		});

		const parsedGroupsSafe = tags.map((group, i) => {
			return PTagObject.safeParse({
				tagId: createRandomId(i).toString(),
				systemId: ctx.author.id,

				tagFriendlyName: group.content.name,
				tagDescription: group.content.desc,
				tagColor: "blue",

				associatedAlters: parsedSafe
					.filter((c) => group.content.members.includes(c.originalSpId))
					.map((c) => c.zodData)
					.filter((c) => c.success)
					.map((c) => c.data.alterId.toString()),

				public: 0,
			});
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
				).successViewCustom(`Successfully imported your Simply Plural system!

> **Disclaimer:** You may feel your system might not be completely identical to Simply Plural. This is because the core data structure of some resources are different from Simply Plural's and as a result may not be identical.
${
	systemData.alterIds.length !== alters.length
		? `> - **Alters (members)**: ${parsedSafe
				.filter((v) => v.zodData.error !== undefined)
				.map((_, i) => `\`${alters[i]?.id}\``)
				.join(
					", ",
				)} were unable to be added to the system due to validation issues.`
		: ""
}${
	systemData.tagIds.length !== tags.length
		? `> - **Tags (groups)**: ${parsedGroupsSafe
				.filter((v) => v.error !== undefined)
				.map((_, i) => `\`${tags[i]?.id}\``)
				.join(
					", ",
				)} were unable to be added to the system due to validation issues.`
		: ""
}
### Next Steps
> - To create a new alter, try using ${mentionCommand(
					(await ctx.getDefaultPrefix()) ?? "",
					"system create-alter",
					ctx.interaction?.message?.messageReference === undefined,
					"%username% %display name%",
				)}
> - To create a new tag, try using ${mentionCommand(
					(await ctx.getDefaultPrefix()) ?? "",
					"system create-tag",
					ctx.interaction?.message?.messageReference === undefined,
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
