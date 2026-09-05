import {
	type PAlter,
	PImportTranscript,
	PluralKitAPISystem,
	PluralKitGroup,
	type PluralKitMember,
	PluralKitSystem,
} from "plurography";
import PluralKitConverter from "plurography/dist/converters/pluralkit";
import {
	ActionRow,
	Button,
	Command,
	CommandContext,
	Container,
	createStringOption,
	Declare,
	Options,
	Separator,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import type z from "zod";
import { emoji } from "zod";
import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { runSandboxActions } from "@/lib/pk-sync-engine";
import { createSystemOperation } from "@/lib/system-operation";
import {
	alterCollection,
	importTranscriptCollection,
	tagCollection,
	userCollection,
} from "@/mongodb";
import { AlertView } from "@/views/alert";
import { build } from "..";

const options = {
	token: createStringOption({
		description: "PluralKit token",
		required: true,
	}),
};

const API_PREFIX = "https://api.pluralkit.me/v2";

@Declare({
	name: "set-pk-token",
	description: "Set a PluralKit token for syncing.",
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class SetupCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		const { token } = ctx.options;
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		await ctx.deferReply(true);

		const PK_UA = `PluralBuddy/${build.split("/")[0]} (gftl.fyi/discord; @giftedly@lumis.moe, ActivityPub) Plurography/0.5.0`;
		console.log("using user agent:", PK_UA);

		const system = await fetch(`${API_PREFIX}/systems/@me`, {
			headers: {
				Authorization: token,
				"User-Agent": PK_UA,
			},
		});
		const json = await system.json();
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
			pluralbuddy: { alters, tags, system: user.system },
			authorId: user.userId,
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

		return await ctx.editResponse({
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
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
