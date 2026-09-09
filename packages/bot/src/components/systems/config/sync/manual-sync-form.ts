import {
	PImportTranscript,
	PluralKitAPISystem,
	PluralKitGroup,
	PluralKitMember,
} from "plurography";
import {
	ActionRow,
	Button,
	Container,
	ModalCommand,
	ModalContext,
	Separator,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import type { z } from "zod";
import { build } from "@/index";
import { emojis } from "@/lib/emojis";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { hexToBuffer } from "@/lib/hex-buffer-operation";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { runSandboxActions } from "@/lib/pk-sync-engine";
import {
	alterCollection,
	importTranscriptCollection,
	tagCollection,
	userCollection,
} from "@/mongodb";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { SystemSettingsView } from "@/views/system-settings";

const API_PREFIX = "https://api.pluralkit.me/v2";

export default class SetPronounsButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.SyncPreferences.SyncManuallyForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		let { system: systemPB, syncConfiguration } = await ctx.retrievePUser();

		if (systemPB === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const [token, storeToken] = [
			ctx.interaction.getInputValue(
				InteractionIdentifier.Systems.Configuration.SyncPreferences.PluralKitToken.create(),
				true,
			),
			ctx.interaction.getCheckbox(
				InteractionIdentifier.Systems.Configuration.SyncPreferences.StoreToken.create(),
				true,
			),
		];

		let alreadyResponded = false;

		if (storeToken) {
			const key = process.env.PK_TOKEN_KEY ?? "";
			const importedKey = await crypto.subtle.importKey(
				"raw",
				hexToBuffer(key),
				"AES-GCM",
				true,
				["encrypt", "decrypt"],
			);

			const iv = crypto.getRandomValues(new Uint8Array(16));
			const encrypted = await crypto.subtle.encrypt(
				{ name: "AES-GCM", iv },
				importedKey,
				Buffer.from(token as string),
			);

			await userCollection.updateOne(
				{
					userId: ctx.author.id,
				},
				{
					$set: {
						"syncConfiguration.pluralkit.token.i":
							Buffer.from(iv).toString("hex"),
						"syncConfiguration.pluralkit.token.v":
							Buffer.from(encrypted).toString("hex"),
					},
				},
			);

			alreadyResponded = true;
			await ctx.interaction.update({
				components: [
					...(await new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(systemPB)?.preferAccessiblity,
					).syncSettings(await ctx.retrievePUser())),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (!storeToken && syncConfiguration?.pluralkit?.token !== undefined) {
			await userCollection.updateOne(
				{
					userId: ctx.author.id,
				},
				{
					$unset: {
						"syncConfiguration.pluralkit.token": 1,
					},
				},
			);

			return await ctx.interaction.update({
				components: [
					...(await new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(systemPB)?.preferAccessiblity,
					).syncSettings(await ctx.retrievePUser())),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (!alreadyResponded) await ctx.deferReply(true);

		const followup = await ctx.followup({
			components: [
				...new LoadingView(await ctx.userTranslations()).loadingView(),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		const PK_UA = `PluralBuddy/${build.split("/")[0]} (gftl.fyi/discord; @giftedly, Discord) Plurography/0.5.0`;
		console.log("using user agent:", PK_UA);

		const existingTranscript = await importTranscriptCollection.findOne({
			userId: ctx.author.id,
		});

		if (existingTranscript) {
			return await followup.edit({
				components: [
					new Container()
						.setColor("#FFDF00")
						.setComponents(
							new TextDisplay().setContent(
								(await ctx.userTranslations()).TRANSCRIPT_TOP.replace(
									"{{ circleQuestionWhite }}",
									emojis.circleQuestionWhite,
								),
							),
							new Separator(),
							new TextDisplay().setContent(
								(await ctx.userTranslations()).ALTERS_SEPARATOR,
							),
							new ActionRow().setComponents(
								new Button()
									.setDisabled()
									.setCustomId("d_")
									.setStyle(ButtonStyle.Success)
									.setLabel(
										`${existingTranscript.alters.add.length.toString()}`,
									)
									.setEmoji(emojis.plus),
								new Button()
									.setDisabled()
									.setCustomId("d")
									.setStyle(ButtonStyle.Secondary)
									.setLabel(existingTranscript.alters.update.length.toString()),
								new Button()
									.setDisabled()
									.setCustomId("da_")
									.setStyle(ButtonStyle.Danger)
									.setLabel(
										`${existingTranscript.alters.remove.length.toString()}`,
									)
									.setEmoji(emojis.minus),
							),
							new Separator(),
							new TextDisplay().setContent(
								(await ctx.userTranslations()).TAGS_SEPARATOR,
							),
							new ActionRow().setComponents(
								new Button()
									.setDisabled()
									.setCustomId("d____")
									.setStyle(ButtonStyle.Success)
									.setLabel(`${existingTranscript.tags.add.length.toString()}`)
									.setEmoji(emojis.plus),
								new Button()
									.setDisabled()
									.setCustomId("d___")
									.setStyle(ButtonStyle.Secondary)
									.setLabel(existingTranscript.tags.update.length.toString()),
								new Button()
									.setDisabled()
									.setCustomId("da__")
									.setStyle(ButtonStyle.Danger)
									.setLabel(
										`${existingTranscript.tags.remove.length.toString()}`,
									)
									.setEmoji(emojis.minus),
							),
						),
					new ActionRow().setComponents(
						new Button()
							.setStyle(ButtonStyle.Primary)
							.setCustomId(
								InteractionIdentifier.Systems.Syncing.ApplyTranscript.create(
									existingTranscript._id.toString(),
								),
							)
							.setLabel((await ctx.userTranslations()).PK_TRANSCRIPT_APPLY)
							.setEmoji(emojis.wrenchWhite),
						new Button()
							.setStyle(ButtonStyle.Danger)
							.setCustomId(
								InteractionIdentifier.Systems.Syncing.ApplyTranscriptDestructively.create(
									existingTranscript._id.toString(),
								),
							)
							.setLabel(
								(await ctx.userTranslations()).PK_TRANSCRIPT_APPLY_DESTRUCTIVE,
							)
							.setEmoji(emojis.xWhite),
					),
					new ActionRow().setComponents(
						new Button()
							.setURL(
								`${process.env.APP_HOST}/app/settings/sync/transcript/${existingTranscript._id.toString()}`,
							)
							.setStyle(ButtonStyle.Link)
							.setLabel((await ctx.userTranslations()).PK_TRANSCRIPT_VIEW),
					),
				],
			});
		}

		const system = await fetch(`${API_PREFIX}/systems/@me`, {
			headers: {
				Authorization: token,
				"User-Agent": PK_UA,
			},
		});
		const json = await system.json();
		if (((json as {message: string | undefined}).message) !== undefined) {
			return await followup.edit({
				components: [
					...(await new AlertView(await ctx.userTranslations()).errorViewCustom(
						(
							await ctx.userTranslations()
						).PK_ERROR.replace(
							"{{ error }}",
							(json as { message: string | undefined }).message ?? "??",
						),
					)),
				],
			});
		}
		const systemParsed = PluralKitAPISystem.parse(json);

		const members = await fetch(`${API_PREFIX}/systems/@me/members`, {
			headers: {
				Authorization: token,
				"User-Agent": PK_UA,
			},
		});
		const membersJson = (await members.json()) as Array<
			z.infer<typeof PluralKitMember>
		>;

		const groups = await fetch(`${API_PREFIX}/systems/@me/groups`, {
			headers: {
				Authorization: token,
				"User-Agent": PK_UA,
			},
		});
		const groupsJson = (await groups.json()) as Array<
			z.infer<typeof PluralKitGroup>
		>;

		const alters = await alterCollection
			.find({ systemId: ctx.author.id })
			.toArray();
		const tags = await tagCollection
			.find({ systemId: ctx.author.id })
			.toArray();

		const transcript = runSandboxActions({
			pluralbuddy: { alters, tags, system: systemPB },
			authorId: ctx.author.id,
			pluralkit: {
				members: membersJson,
				system: systemParsed,
				groups: groupsJson,
			},
		});
		const zodTranscript = PImportTranscript.parse({
			alters: {
				add: transcript.alters.add,
				update: transcript.alters.update,
				remove: transcript.alters.remove.map((v) => ({
					systemId: v.systemId,
					alterId: String(v.alterId),
				})),
			},
			tags: {
				add: transcript.tags.add,
				update: transcript.tags.update,
				remove: transcript.tags.remove.map((v) => ({
					systemId: v.systemId,
					tagId: v.tagId,
				})),
			},
			system: transcript.system,

			userId: ctx.author.id,
			createdAt: new Date(),
		} satisfies PImportTranscript);

		const transcriptMongo =
			await importTranscriptCollection.insertOne(zodTranscript);

		return await followup.edit({
			components: [
				new Container()
					.setColor("#FFDF00")
					.setComponents(
						new TextDisplay().setContent(
							(await ctx.userTranslations()).TRANSCRIPT_TOP.replace(
								"{{ circleQuestionWhite }}",
								emojis.circleQuestionWhite,
							),
						),
						new Separator(),
						new TextDisplay().setContent(
							(await ctx.userTranslations()).ALTERS_SEPARATOR,
						),
						new ActionRow().setComponents(
							new Button()
								.setDisabled()
								.setCustomId("d_")
								.setStyle(ButtonStyle.Success)
								.setLabel(`${transcript.alters.add.length.toString()}`)
								.setEmoji(emojis.plus),
							new Button()
								.setDisabled()
								.setCustomId("d")
								.setStyle(ButtonStyle.Secondary)
								.setLabel(transcript.alters.update.length.toString()),
							new Button()
								.setDisabled()
								.setCustomId("da_")
								.setStyle(ButtonStyle.Danger)
								.setLabel(`${transcript.alters.remove.length.toString()}`)
								.setEmoji(emojis.minus),
						),
						new Separator(),
						new TextDisplay().setContent(
							(await ctx.userTranslations()).TAGS_SEPARATOR,
						),
						new ActionRow().setComponents(
							new Button()
								.setDisabled()
								.setCustomId("d____")
								.setStyle(ButtonStyle.Success)
								.setLabel(`${transcript.tags.add.length.toString()}`)
								.setEmoji(emojis.plus),
							new Button()
								.setDisabled()
								.setCustomId("d___")
								.setStyle(ButtonStyle.Secondary)
								.setLabel(transcript.tags.update.length.toString()),
							new Button()
								.setDisabled()
								.setCustomId("da__")
								.setStyle(ButtonStyle.Danger)
								.setLabel(`${transcript.tags.remove.length.toString()}`)
								.setEmoji(emojis.minus),
						),
					),
				new ActionRow().setComponents(
					new Button()
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Systems.Syncing.ApplyTranscript.create(
								transcriptMongo.insertedId.toString(),
							),
						)
						.setLabel((await ctx.userTranslations()).PK_TRANSCRIPT_APPLY)
						.setEmoji(emojis.wrenchWhite),
					new Button()
						.setStyle(ButtonStyle.Danger)
						.setCustomId(
							InteractionIdentifier.Systems.Syncing.ApplyTranscriptDestructively.create(
								transcriptMongo.insertedId.toString(),
							),
						)
						.setLabel(
							(await ctx.userTranslations()).PK_TRANSCRIPT_APPLY_DESTRUCTIVE,
						)
						.setEmoji(emojis.xWhite),
				),
				new ActionRow().setComponents(
					new Button()
						.setURL(
							`${process.env.APP_HOST}/app/settings/sync/transcript/${transcriptMongo.insertedId.toString()}`,
						)
						.setStyle(ButtonStyle.Link)
						.setLabel((await ctx.userTranslations()).PK_TRANSCRIPT_VIEW),
				),
			],
		});
	}
}
