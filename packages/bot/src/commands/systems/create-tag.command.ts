/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getEmojiFromTagColor } from "@/lib/emojis";
import { mentionCommand } from "@/lib/mention-command";
import { tagCollection } from "@/mongodb";
import { PTagObject, tagColors } from "@/types/tag";
import { getUserById, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { Container, SubCommand, TextDisplay } from "seyfert";
import {
	type CommandContext,
	createStringOption,
	Declare,
	Options,
	type OKFunction,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import z from "zod";

const options = {
	color: createStringOption({
		description: "The color for the tag.",
		required: true,
		choices: tagColors.map((c) => {
			return { name: c, value: c };
		}),
	}),
	"display-name": createStringOption({
		description: "The display name for the tag.",
		required: true,
		max_length: 100,
		min_length: 3
	}),
};

@Declare({
	name: "create-tag",
	description: "Creates a new tag",
	aliases: ["ct", "tag", "new-tag", "cat"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class CreateTagCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "display-name": displayName, color } = ctx.options;

		await ctx.write(ctx.loading(ctx.userTranslations()));

		const user = await ctx.retrievePUser();
		const server = await ctx.retrievePGuild();

		const existingTag = await tagCollection.findOne({
			systemId: user.system?.associatedUserId,
			tagFriendlyName: displayName,
		});

		if (existingTag) {
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorViewCustom(
						ctx
							.userTranslations()
							.TAG_ALREADY_EXISTS.replace("%display%", displayName),
					),
				],
			});
		}
		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const tag = PTagObject.safeParse({
			tagId: Number(DiscordSnowflake.generate()).toString(),
			systemId: user.system.associatedUserId,

			tagFriendlyName: displayName,
			tagColor: color,

			associatedAlters: [],

			/** @see {@link TagProtectionFlags} */
			public: 0,
		});

		if (tag.error) {
			return await ctx.editResponse({
				components: [
					...new AlertView(
						ctx.userTranslations(),
					).errorViewCustom(`There was an error while creating that tag:

\`\`\`
${z.prettifyError(tag.error)}
\`\`\`                        `),
				],
			});
		}

		await writeUserById(user.system.associatedUserId, {
			...(await getUserById(user.system.associatedUserId)),
			system: {
				...user.system,
				tagIds: [...user.system.tagIds, tag.data.tagId],
			},
		});

		tagCollection.insertOne(tag.data);

		await ctx.editResponse({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						.CREATE_NEW_TAG_DONE.replace("%command%", mentionCommand((await ctx.getDefaultPrefix()) ?? "pb;", "tag", ctx.message === undefined, tag.data.tagFriendlyName))
						.replaceAll("%tag_name%", tag.data.tagFriendlyName)
						.replace("%color_emoji%", getEmojiFromTagColor(color)),
				),
				...(tag.data.tagFriendlyName.includes(" ") ? [
                    new Container()
                        .setComponents(
                            new TextDisplay()
                                .setContent(ctx.userTranslations().TAG_SPACE_WARNING)
                        )
                ] : []),
			],
		});
	}
}
