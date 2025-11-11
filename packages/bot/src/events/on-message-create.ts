/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, createEvent, type Message, Separator, TextDisplay, type TopLevelBuilders, type UsingClient, type Webhook } from "seyfert";
import { ButtonStyle, MessageFlags, PermissionFlagsBits, Spacing } from "seyfert/lib/types";
import { getUserById } from "../types/user";
import { alterCollection, messagesCollection } from "../mongodb";
import { BitField } from "seyfert/lib/structures/extra/BitField";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { emojis } from "@/lib/emojis";

export default createEvent({
    data: { name: 'messageCreate', once: false },
    run: async (message, client) => {
        if (message.author.bot === true)
            return;
        if ((await message.channel()).isDM()) {
            message.write({ content: "You cannot proxy inside of DM channels." })
            return;
        }

        const userPerms = await client.channels.memberPermissions(message.channelId, await client.members.fetch(message.guildId as string, client.botId), true)

        if (!userPerms.has([ "ManageWebhooks", "ManageMessages" ]))
            return;

        let returnBack = false;
        if (process.env.BRANCH === "production")
            try {
                (await client.guilds.fetch(message.guildId as string)).members.fetch("1430750248401371199")
                returnBack = true;
            } catch (c) {console.log(c)}

        if (returnBack)
            return;

        const similarWebhooks = (await client.webhooks.listFromChannel(message.channelId)).filter((val) => val.name === 'PluralBuddy Proxy' && (val.user ?? { id: 0}).id === client.botId)
        const user = await getUserById(message.author.id)
        let webhook = null;
    
        if (similarWebhooks.length >= 1) {
            webhook = similarWebhooks[0]
        } else {
            webhook = await (client.webhooks.create(message.channelId, {
                name: 'PluralBuddy Proxy'
            }))
        }
    
        if (webhook === null || webhook === undefined) {
            return;
        }

        if (user.system === undefined) return;
        if (user.system.alterIds.length === 0) return;

        const alters = alterCollection.find({ systemId: message.author.id })

        outer: for (let i = 0; i < user.system.alterIds.length; i++) {
            const checkAlter = await alters.next()
            const referencedMessage = message.referencedMessage === undefined || message.referencedMessage === null ? []
                : [
                    new TextDisplay()
                        .setContent(await getReferencedMessageString(message, webhook.id))
                ]
            
            for (const proxyTag of (checkAlter?.proxyTags ?? [])) {
                if (
                    (proxyTag.suffix !== "" && message.content.endsWith(proxyTag.suffix)) ||
                    (proxyTag.prefix !== "" && message.content.startsWith(proxyTag.prefix))
                ) {

                    alterCollection.updateOne({ alterId: checkAlter?.alterId, systemId: checkAlter?.systemId }, { $inc: { messageCount: 1 }, $set: { lastMessageTimestamp: new Date() } })

                    let contents = message.content;
                    if (proxyTag.prefix && contents.startsWith(proxyTag.prefix)) {
                        contents = contents.slice(proxyTag.prefix.length);
                    }
                    if (proxyTag.suffix && contents.endsWith(proxyTag.suffix)) {
                        contents = contents.slice(0, contents.length - proxyTag.suffix.length);
                    }
                    proxy(webhook, client, message, [
                        ...referencedMessage,
                        new TextDisplay().setContent(contents.trim())
                    ], contents.trim(), `${checkAlter?.displayName ?? ""} ${user.system.systemDisplayTag ?? ""}`, checkAlter?.alterId as number, checkAlter?.systemId as string, checkAlter?.avatarUrl ?? undefined);
                    break outer;
                }
            }
        }

    }
  })

async function proxy(webhook: Webhook, client: UsingClient, message: Message, contents: TopLevelBuilders[], stringContents: string, username: string, alterId: number, systemId: string, picture?: string) {


    webhook.messages.write({
        body: {
            components: contents,
            flags: MessageFlags.IsComponentsV2,
            username,
            allowed_mentions: { parse: [] },
            avatar_url: picture,
        },
        query: {
            wait: true
        }
    }).then((v) => {
        messagesCollection.insertOne({
            messageId: v?.id ?? "0",
            alterId,
            systemId,
            contents: stringContents,
            createdAt: new Date()
        })
    })

    await message.delete()
}

async function getReferencedMessageString(message: Message, proxyWHId: string) {
    let userString = `<@${message.referencedMessage?.author.id}>`;
    let messageString = `[${message.referencedMessage?.content === "" ? "Jump to message" : message.referencedMessage?.content}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)`

    if (message.referencedMessage?.webhookId === proxyWHId) {
        const messageDb = await messagesCollection.findOne({ messageId: message.referencedMessage?.id });

        if (messageDb !== null) {
            const alter = await alterCollection.findOne({ alterId: messageDb.alterId })

            if (alter !== null) {
                userString = `@${alter?.username}`
                messageString = `[${messageDb.contents === "" ? "Jump to message" : messageDb.contents}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)`
            }
        }
    }

    return `-# ${emojis.reply}  Replying to ${userString}: ${messageString}`
}