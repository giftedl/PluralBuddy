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
  fileAttachments: Array<{ buff: Buffer; spoilered: boolean; name: string }>;
  hasTextContent: boolean;
}> {
<<<<<<< HEAD
  const fileAttachments: Array<{
    buff: Buffer;
    spoilered: boolean;
    name: string;
  }> = [];
  const userPerms = await client.channels.memberPermissions(
    message.channelId,
    await client.members.fetch(
      realGuildId ?? (message.guildId as string),
      sendingUserId ?? message.user.id,
    ),
    true,
  );
=======
	if (!message.member) return { fileAttachments: [], hasTextContent: false };

	const fileAttachments: Array<{
		buff: Buffer;
		spoilered: boolean;
		name: string;
	}> = [];
	const userPerms = await client.channels.memberPermissions(
		message.channelId,
		message.member,
		true,
	);
>>>>>>> 2bc1cfa15f9539ae844af4a92ea7b0715d42df63

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
      console.log(attachment);
      if (attachment.url.startsWith("https://cdn.discordapp.com")) {
        const arrBuff = await (await fetch(attachment.url)).arrayBuffer();
        fileAttachments.push({
          buff: Buffer.from(arrBuff),
          name:
            "filename" in attachment
              ? attachment.filename
              : `attachment-${assetStringGeneration(16)}.${attachment.content_type?.split("/")[1]}`,
          spoilered:
            "flags" in attachment ? ((attachment.flags ?? 0) & (1 << 3)) === 1 << 3 : false,
        });
      }
    }
  }

  const hasAttachments = message.attachments.length > 0;
  const isOnlyTenorUrl =
    stringContents.startsWith("https://tenor.com") && stringContents.split(/\s+/).length === 1;
  // Only show text if there's actual text content and it's not just a Tenor URL (when there are no file attachments)
  const hasTextContent = stringContents.length > 0 && !(isOnlyTenorUrl && !hasAttachments);

  return { fileAttachments, hasTextContent };
}
