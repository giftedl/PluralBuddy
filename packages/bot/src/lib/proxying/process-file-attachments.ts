import { assetStringGeneration } from "@/types/operation";
import type { UsingClient } from "seyfert";
import type { Message } from "seyfert/lib/structures";
import { ComponentType } from "seyfert/lib/types";
import type { APIMediaGalleryComponent } from "seyfert/lib/types/payloads";

export async function processFileAttachments(
	client: UsingClient,
	message: Message,
	stringContents: string,
	sendingUserId?: string,
	realGuildId?: string,
): Promise<{
	fileAttachments: Array<{ buff: Buffer; name: string }>;
	hasTextContent: boolean;
}> {
	const fileAttachments: Array<{ buff: Buffer; name: string }> = [];
	const userPerms = await client.channels.memberPermissions(
		message.channelId,
		await client.members.fetch(
			realGuildId ?? (message.guildId as string),
			sendingUserId ?? message.user.id,
		),
		true,
	);

	// Only process file attachments (not URLs)
	if (userPerms.has(["AttachFiles"]) ?? false) {
		for (const attachment of [
			...message.attachments,
			...message.components
				.filter((c) => c.type === ComponentType.MediaGallery)
				.flatMap((c) => {
					const mediaGallery = c.data as APIMediaGalleryComponent;

					return mediaGallery.items.map((v) => {
						return { ...v, ...v.media };
					});
				}),
		]) {
			if (!attachment.url.startsWith("https://media.tenor.com")) {
				const arrBuff = await (await fetch(attachment.url)).arrayBuffer();
				fileAttachments.push({
					buff: Buffer.from(arrBuff),
					name:
						"filename" in attachment
							? attachment.filename
							: `attachment-${assetStringGeneration(16)}.${attachment.content_type?.split("/")[1]}`,
				});
			}
		}
	}

	const hasAttachments = message.attachments.length > 0;
	const isOnlyTenorUrl =
		stringContents.startsWith("https://tenor.com") &&
		stringContents.split(/\s+/).length === 1;
	// Only show text if there's actual text content and it's not just a Tenor URL (when there are no file attachments)
	const hasTextContent =
		stringContents.length > 0 && !(isOnlyTenorUrl && !hasAttachments);

	return { fileAttachments, hasTextContent };
}
