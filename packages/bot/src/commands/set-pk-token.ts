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
	Command,
	CommandContext,
	createStringOption,
	Declare,
	Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type z from "zod";
import { runSandboxActions } from "@/lib/pk-sync-engine";
import { createSystemOperation } from "@/lib/system-operation";
import { alterCollection, importTranscriptCollection, tagCollection, userCollection } from "@/mongodb";
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
			pluralkit: { members: membersJson, system: systemParsed, groups: groupsJson },
		});
        const zodTranscript = PImportTranscript.parse({
            alters: {
                add: transcript.alters.add,
                update: transcript.alters.update,
                remove: transcript.alters.remove.map(v => ({systemId: v.systemId, alterId: String(v.alterId)}))
            },
            tags: {
                add: transcript.tags.add,
                update: transcript.tags.update,
                remove: transcript.tags.remove.map(v => ({ systemId: v.systemId, tagId: v.tagId }))
            },
            system: transcript.system,
 
            userId: ctx.author.id,
            createdAt: new Date(),
        } satisfies PImportTranscript)

        await importTranscriptCollection.insertOne(zodTranscript)

		return await ctx.write({
			components: [
				...new AlertView(await ctx.userTranslations()).successView(
					"ALTERS_LABEL",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
