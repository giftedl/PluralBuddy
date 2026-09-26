/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { DiscordSnowflake } from "@sapphire/snowflake";
import {
	AlterProtectionFlags,
	assetStringGeneration,
	type PTag,
} from "plurography";
import {
	type CommandContext,
	Container,
	createBooleanOption,
	createStringOption,
	Declare,
	IgnoreCommand,
	type OKFunction,
	type OnOptionsReturnObject,
	Options,
	Separator,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { MessageFlags, Spacing } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";
import z from "zod";
import { getSpecificAutoProxy, getWiderAutoProxy } from "@/lib/autoproxy-util";
import { emojis } from "@/lib/emojis";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { writeBack } from "@/lib/pk-sync-engine";
import { getMaxAlterPublicValue } from "@/lib/privacy-bitmask";
import { w } from "@/webhooks";
import { alterCollection, tagCollection, userCollection } from "../../mongodb";
import { PAlterObject } from "../../types/alter";
import { getUserById, writeUserById } from "../../types/user";
import { AlertView } from "../../views/alert";

const options = {
	username: createStringOption({
		description: "The username for the alter. These **cannot** include spaces.",
		required: true,
		max_length: 20,
		value: (data, ok: OKFunction<string>, no) => {
			if (data.value.includes(" "))
				no("contains a space; however usernames cannot contain a space");
			if (
				data.value.includes("@") ||
				data.value.includes("/") ||
				data.value.includes("\\")
			)
				no(
					"contains a slash or @ symbol. usernames cannot have either of those",
				);
			ok(data.value);
		},
	}),
	"display-name": createStringOption({
		description: "The display name for the alter. These can include spaces.",
		required: false,
		max_length: 100,
		min_length: 3,
	}),
	now: createBooleanOption({
		description:
			"Whether to immediately proxy in this guild (or globally in DMs) with this alter.",
		required: false,
		flag: true,
	}),
	desc: createStringOption({
		description: "Set the description of the alter.",
		required: false,
		flag: true,
	}),
	pronouns: createStringOption({
		description: "Assign pronouns to the alter",
		required: false,
		flag: true,
	}),
	assign: createStringOption({
		description: "Assign the new alter a tag.",
		required: false,
		flag: true,
	}),
};

@Declare({
	name: "create-alter",
	description: "Creates a new alter",
	aliases: ["ca", "alter", "new-alter"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
@Shortcut()
export default class CreateAlterCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		let {
			username,
			"display-name": displayName,
			assign,
			pronouns,
			desc,
			now,
		} = ctx.options;

		await ctx.write(ctx.loading(await ctx.userTranslations()));

		const user = await ctx.retrievePUser();
		const server = await ctx.retrievePGuild();

		let assignableTag: PTag | null = null;

		const existingAlter = await alterCollection.findOne({
			username,
			systemId: ctx.author.id,
		});

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		if (existingAlter !== null) {
			displayName = displayName ?? username;
			username = `${username}-${assetStringGeneration(5)}`;
		}
		if (assign !== undefined) {
			const query = Number.isNaN(Number.parseInt(assign))
				? tagCollection.findOne({
						$or: [{ tagFriendlyName: assign }],
						systemId: ctx.author.id,
					})
				: tagCollection.findOne({
						$or: [{ tagFriendlyName: assign }, { tagId: assign }],
						systemId: ctx.author.id,
					});

			assignableTag = await query;
		}

		if (user.system.alterIds.length >= 2000) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"TOO_MANY_ALTERS",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const alter = PAlterObject.safeParse({
			alterId: Number(DiscordSnowflake.generate()),
			systemId: user.system.associatedUserId,

			username,
			displayName: displayName ?? username,
			nameMap: [],
			color: null,
			pronouns: ctx.options.pronouns ?? null,
			description: ctx.options.desc ?? null,
			created: new Date(),
			avatarUrl: null,
			webhookAvatarUrl: null,
			banner: null,
			lastMessageTimestamp: null,
			messageCount: 0,
			alterMode: "webhook",
			public: getSystemFeatures(user.system).publicDefault
				? getMaxAlterPublicValue()
				: 0,
			tagIds: assignableTag !== null ? [assignableTag.tagId] : [],
		});

		if (alter.error) {
			return await ctx.editResponse({
				components: [
					...new AlertView(
						await ctx.userTranslations(),
					).errorViewCustom(`There was an error while creating that alter:

\`\`\`
${z.prettifyError(alter.error)}
\`\`\`                        `),
				],
			});
		}

		if (assignableTag !== null) {
			await tagCollection.updateOne(
				{
					tagId: assignableTag.tagId,
					systemId: ctx.author.id,
				},
				{
					$push: {
						associatedAlters: String(alter.data.alterId),
					},
				},
			);
		}

		await writeUserById(user.system.associatedUserId, {
			...(await getUserById(user.system.associatedUserId)),
			system: {
				...user.system,
				alterIds: [...user.system.alterIds, alter.data.alterId],
			},
		});

		await alterCollection.insertOne(alter.data);
		writeBack({
			type: "create-alter",
			id: String(alter.data.alterId),
			change: { ...alter.data, userId: ctx.author.id },
			syncConfig: user.syncConfiguration,
		});

		const successMessage = async (done: boolean) =>
			await ctx.editResponse({
				components: [
					...new AlertView(await ctx.userTranslations()).successViewCustom(
						`${(await ctx.userTranslations()).CREATE_NEW_ALTER_DONE.replace(
							"%prefix%",
							server.prefixes[0] ?? "/",
						).replace("%alter_id%", alter.data.username)}
				`,
					),
					new Container()
						.setColor("#1190FF")
						.setComponents(
							new TextDisplay().setContent(
								(await ctx.userTranslations()).CREATE_NEW_ALTER_ADD,
							),
							new Separator().setSpacing(Spacing.Large),
							new TextDisplay().setContent(
								not_empty(
									[
										(displayName ?? username) !== username
											? `> - ${(await ctx.userTranslations()).CREATE_NEW_ALTER_DISPLAY_NAME.replace("{{ dn }}", displayName ?? username)}`
											: "",
										pronouns !== undefined
											? `> - ${(await ctx.userTranslations()).CREATE_NEW_ALTER_PRONOUNS.replace("{{ pronouns }}", pronouns)}`
											: "",
										desc !== undefined
											? `> - ${(await ctx.userTranslations()).CREATE_NEW_ALTER_DESC.replace("{{ description }}", desc.replaceAll("\n", "\n  >   - "))}`
											: "",
										assignableTag === null && assign !== undefined
											? `> - ${emojis.x} ${(await ctx.userTranslations()).NO_SUCH_TAG_CANT_ASSIGN}`
											: "",
										assignableTag !== null && assign !== undefined
											? `> - ${(await ctx.userTranslations()).CREATE_NEW_ALTER_ASSIGN.replace("{{ tag }}", assignableTag.tagFriendlyName)}`
											: "",
										now === true
											? `> - ${!done ? `${emojis.loading}  ` : ""}${(await ctx.userTranslations()).CREATE_NEW_ALTER_NOW}`
											: "",
									]
										.filter((v) => v !== "")
										.join("\n"),
								),
							),
						),
				],
			});

		await successMessage(false);

		if (now === true) {
			const ap = getSpecificAutoProxy(user.system, ctx.guildId ?? "@global");

			if (ap !== null) {
				await userCollection.updateOne(
					{ userId: user.system.associatedUserId },
					{
						$set: {
							"system.systemAutoproxy.$[serverEntry].autoproxyAlter":
								alter.data.alterId.toString(),
						},
					},
					{
						arrayFilters: [
							{ "serverEntry.serverId": ctx.guildId ?? "@global" },
						],
					},
				);
			} else {
				await userCollection.updateOne(
					{ userId: user.system.associatedUserId },
					{
						$push: {
							"system.systemAutoproxy": {
								autoproxyMode: "latch",
								autoproxyAlter: String(alter.data.alterId),
								serverId: ctx.guildId ?? "@global",
								lastLatchTimestamp: new Date(),
							},
						},
					},
				);
			}

			await successMessage(true);
		}

		w(ctx.author.id, "alter.create", {
			userId: ctx.author.id,
			type: "alter.create",
			alter: alter.data,
		});
	}
}

function not_empty(string: string) {
	return string.trim().length === 0 ? " -- " : string;
}
