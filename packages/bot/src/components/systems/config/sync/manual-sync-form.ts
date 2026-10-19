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
	type ModalContext,
	Separator,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import type { ZodError, z } from "zod";
import { build } from "@/index";
import { emojis } from "@/lib/emojis";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { hexToBuffer } from "@/lib/hex-buffer-operation";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { pk } from "@/lib/pk-api";
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
		const { system: systemPB, syncConfiguration } = await ctx.retrievePUser();

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

		const existingTranscript = await importTranscriptCollection.findOne({
			userId: ctx.author.id,
		});

		if (existingTranscript) {
			return await followup.edit({
				components: new SystemSettingsView(
					await ctx.userTranslations(),
				).syncOperation(existingTranscript, {
					alters: systemPB.alterIds.length,
					tags: systemPB.tagIds.length,
				}),
			});
		}

		const system = await pk(token as string)
			.systemsCollection.findOne({ userId: "@me" })
			.catch(async (v: ZodError) => {
				await followup.edit({
					components: [
						...(await new AlertView(
							await ctx.userTranslations(),
						).errorViewCustom(
							(
								await ctx.userTranslations()
							).PK_ERROR.replace(
								"{{ error }}",
								(v._zod.output as { message: string | undefined } | undefined)?.message ??
									"??",
							),
						)),
					],
				});
			});

		if (typeof system !== "object") return;

		const members = await pk(token as string).membersCollection.find({
			userId: "@me",
		});
		const groups = await pk(token as string).groupsCollection.find({
			userId: "@me",
		});

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
				members: members,
				system,
				groups: groups,
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
			components: new SystemSettingsView(
				await ctx.userTranslations(),
			).syncOperation(
				{ ...zodTranscript, _id: transcriptMongo.insertedId },
				{
					alters: systemPB.alterIds.length,
					tags: systemPB.tagIds.length,
				},
			),
		});
	}
}
