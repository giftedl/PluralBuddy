/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Attachment,
	Button,
	createEvent,
	Separator,
	TextDisplay,
} from "seyfert";
import {
	ButtonStyle,
	PermissionFlagsBits,
	Spacing,
} from "seyfert/lib/types";
import { getUserById } from "../types/user";
import { alterCollection } from "../mongodb";
import { BitField } from "seyfert/lib/structures/extra/BitField";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { getReferencedMessageString } from "../lib/proxying/referenced-message";
import { proxy } from "@/lib/proxying";
import { processEmojis } from "../lib/proxying/process-emojis";

export default createEvent({
	data: { name: "messageCreate", once: false },
	run: async (message, client) => {
		if (message.author.bot === true) return;
		if ((await message.channel()).isDM()) {
			message.write({ content: "You cannot proxy inside of DM channels." });
			return;
		}

		const userPerms = await client.channels.memberPermissions(
			message.channelId,
			await client.members.fetch(message.guildId as string, client.botId),
			true,
		);

		if (
			!userPerms.has(["ManageWebhooks", "ManageMessages"]) ||
			!userPerms.has(["ManageNicknames"])
		)
			return;

		// If the branch is on production and a canary bot is on the server,
		// prioritize proxying of the canary bot instead. (to avoid double proxying)
		if (process.env.BRANCH === "production") {
			const member = await client.members
				.fetch(message.guildId as string, "1430750248401371199")
				.catch(() => null);

			if (member !== null) return;
		}

		const similarWebhooks = (
			await client.webhooks.listFromChannel(message.channelId)
		).filter(
			(val) =>
				val.name === "PluralBuddy Proxy" &&
				(val.user ?? { id: 0 }).id === client.botId,
		);
		const user = await getUserById(message.author.id);
		let webhook = null;

		if (similarWebhooks.length >= 1) {
			webhook = similarWebhooks[0];
		} else {
			webhook = await client.webhooks.create(message.channelId, {
				name: "PluralBuddy Proxy",
			});
		}

		if (webhook === null || webhook === undefined) {
			return;
		}

		if (user.system === undefined) return;
		if (user.system.alterIds.length === 0) return;

		const alters = alterCollection.find({ systemId: message.author.id });

		outer: for (let i = 0; i < user.system.alterIds.length; i++) {
			const checkAlter = await alters.next();
			const referencedMessage =
				message.referencedMessage === undefined ||
				message.referencedMessage === null
					? []
					: [
							new TextDisplay().setContent(
								await getReferencedMessageString(message, webhook.id),
							),
						];

			for (const proxyTag of checkAlter?.proxyTags ?? []) {
				if (
					(proxyTag.suffix !== "" &&
						message.content.endsWith(proxyTag.suffix)) ||
					(proxyTag.prefix !== "" &&
						message.content.startsWith(proxyTag.prefix))
				) {
					alterCollection.updateOne(
						{ alterId: checkAlter?.alterId, systemId: checkAlter?.systemId },
						{
							$inc: { messageCount: 1 },
							$set: { lastMessageTimestamp: new Date() },
						},
					);

					if (
						checkAlter?.alterMode === "both" ||
						checkAlter?.alterMode === "nickname"
					) {
                        const sendingUserPerms = await client.channels.memberPermissions(
                            message.channelId,
                            await client.members.fetch(message.guildId as string, message.user.id),
                            true
                        );

                        if (!sendingUserPerms.has(["ChangeNickname"]))
                            return;
                        
						if (
							!userPerms.has(["ManageNicknames"]) ||
							!(await message.member?.moderatable())
						)
							return;

						const systemFormat = user.system.nicknameFormat ?? "@%username%";

						message.member?.edit({
							nick: systemFormat
								.replace("%username%", checkAlter.username)
								.replace("%display%", checkAlter.displayName)
								.substring(0, 31),
						});
					}

					if (
						checkAlter?.alterMode === "both" ||
						checkAlter?.alterMode === "webhook"
					) {
						if (!userPerms.has(["ManageWebhooks", "ManageMessages"])) return;

						let contents = message.content;
						if (proxyTag.prefix && contents.startsWith(proxyTag.prefix)) {
							contents = contents.slice(proxyTag.prefix.length);
						}
						if (proxyTag.suffix && contents.endsWith(proxyTag.suffix)) {
							contents = contents.slice(
								0,
								contents.length - proxyTag.suffix.length,
							);
						}

					const trimmedContents = contents.trim();

					const { emojis: uploadedEmojis, newMessage: processedContents } =
						await processEmojis(trimmedContents);

					const messageComponents = [
						new TextDisplay().setContent(processedContents),
					];

					proxy(
						webhook,
						client,
						message,
						processedContents,
						`${checkAlter?.displayName ?? ""} ${user.system.systemDisplayTag ?? ""}`,
						checkAlter?.alterId as number,
						checkAlter?.systemId as string,
						[...referencedMessage],
						messageComponents,
						uploadedEmojis,
						checkAlter?.avatarUrl ?? undefined,
					);
					}

					break outer;
				}
			}
		}
	},
});