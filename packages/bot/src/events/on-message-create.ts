/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, createEvent, type Message, TextDisplay, type UsingClient, type Webhook } from "seyfert";
import { ButtonStyle, MessageFlags, PermissionFlagsBits } from "seyfert/lib/types";
import { getUserById } from "../types/user";
import { alterCollection, messagesCollection } from "../mongodb";
import { BitField } from "seyfert/lib/structures/extra/BitField";
import { InteractionIdentifier } from "../lib/interaction-ids";

export default createEvent({
    data: { name: 'messageCreate', once: false },
    run: async (message, client) => {
        if (message.author.bot === true)
            return;

        const userPerms = await client.channels.memberPermissions(message.channelId, await client.members.fetch(message.guildId as string, client.botId), true)

        if (!userPerms.has([ "ManageWebhooks", "ManageMessages" ]))
            return;

        const user = await getUserById(message.author.id)

        if (user.system === undefined) return;
        if (user.system.alterIds.length === 0) return;

        const alters = alterCollection.find({ systemId: message.author.id })

        outer: for (let i = 0; i < user.system.alterIds.length; i++) {
            const checkAlter = await alters.next()

            
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
                    proxy(client, message, contents.trim(), `${checkAlter?.displayName ?? ""} ${user.system.systemDisplayTag ?? ""}`, checkAlter?.alterId as number, checkAlter?.systemId as string, checkAlter?.avatarUrl ?? undefined);
                    break outer;
                }
            }
        }

    }
  })

async function proxy(client: UsingClient, message: Message, contents: string, username: string, alterId: number, systemId: string, picture?: string) {
    const similiarWebhooks = (await client.webhooks.listFromChannel(message.channelId)).filter((val) => val.name === 'PluralBuddy Proxy' && (val.user ?? { id: 0}).id === client.botId)
    let webhook = null;

    if (similiarWebhooks.length >= 1) {
        webhook = similiarWebhooks[0]
    } else {
        webhook = await (client.webhooks.create(message.channelId, {
            name: 'PluralBuddy Proxy'
        }))
    }

    if (webhook === null || webhook === undefined) {
        return;
    }

    webhook.messages.write({
        body: {
            components: [new TextDisplay().setContent(contents)],
            flags: MessageFlags.IsComponentsV2,
            username,
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
            createdAt: new Date()
        })
    })

    await message.delete()
}