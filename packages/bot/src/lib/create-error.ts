import { errorCollection, guildCollection } from "@/mongodb";
import { DiscordSnowflake } from "@sapphire/snowflake";
import type { GuildErrorTypes } from "plurography";
import { Container, Section, Separator, TextDisplay, Thumbnail, type Guild } from "seyfert";
import type z from "zod";
import { client } from "..";
import { getGuildFromId } from "@/types/guild";
import { MessageFlags, Spacing } from "seyfert/lib/types";
import { mentionCommand } from "./mention-command";

export async function createError(
	guildId: string,
	opts: {
		title: string;
		description: string;
		type: z.infer<typeof GuildErrorTypes>;

		responsibleUserId?: string;
		responsibleChannelId?: string;
	},
) {
	const guildErrorId = DiscordSnowflake.generate().toString();

	await errorCollection.insertOne({
		id: guildErrorId,
		responsibleGuildId: guildId,
		createdAt: new Date(),
		...opts,
	});

	await guildCollection.updateOne(
		{ guildId },
		{
			$push: { errorLog: { ...opts, id: guildErrorId, timestamp: new Date() } },
		},
		{ upsert: true },
	);
	client.cache.pguild.remove(guildId);
	
	(async () => {
		const guild = await getGuildFromId(guildId)

		if (guild.logChannel)
			await client.messages.write(guild.logChannel, {
				
				components: [
					new TextDisplay().setContent(
						`\`${opts.type}\``,
					),
					new Container()
						.setComponents(
							new Section()
								.setComponents(
									new TextDisplay().setContent(
										`**${opts.title}**
> ${opts.description}`
									),
								)
								.setAccessory(
									new Thumbnail().setMedia(
										"https://pb.giftedly.dev/image/solar-centered.png"
									),
								),
							new Separator().setSpacing(Spacing.Large),
							new TextDisplay().setContent(`-# PluralBuddy ran into an issue while doing an action on this server.
${opts.responsibleChannelId ? `-# In <#${opts.responsibleChannelId}>` : `${opts.responsibleUserId ? `-# By <@${opts.responsibleUserId}>` : ""}`}${opts.responsibleChannelId && opts.responsibleUserId ? `\n-# By <@${opts.responsibleUserId}>` : ""}
-# View more details in ${mentionCommand("pb;", "server-config errors", true)}`),
						)
						.setColor("Red"),
				],
				flags: MessageFlags.IsComponentsV2,
				allowed_mentions: { parse: [] },
			}).catch(() => null);
	})();

	return { guildErrorId, ...opts };
}
