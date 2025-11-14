import type { UsingClient } from "seyfert";
import type { Message } from "seyfert/lib/structures";

export async function processFileAttachments(
    client: UsingClient,
    message: Message,
    stringContents: string): Promise<{
        fileAttachments: Array<{ buff: Buffer; name: string; }>;
        hasTextContent: boolean;
    }> {
    const fileAttachments: Array<{ buff: Buffer; name: string; }> = [];
    const userPerms = await client.channels.memberPermissions(
        message.channelId,
        await client.members.fetch(message.guildId as string, message.user.id),
        true
    );



    // Only process file attachments (not URLs)
    if (userPerms.has(["AttachFiles"]) ?? false) {
        for (const attachment of message.attachments) {
            const arrBuff = await (await fetch(attachment.url)).arrayBuffer();
            fileAttachments.push({
                buff: Buffer.from(arrBuff),
                name: attachment.filename,
            });
        }
    }

    const hasAttachments = message.attachments.length > 0;
    const isOnlyTenorUrl = stringContents.startsWith("https://tenor.com") &&
        stringContents.split(/\s+/).length === 1;
    // Only show text if there's actual text content and it's not just a Tenor URL (when there are no file attachments)
    const hasTextContent = stringContents.length > 0 && !(isOnlyTenorUrl && !hasAttachments);

    return { fileAttachments, hasTextContent };
}
