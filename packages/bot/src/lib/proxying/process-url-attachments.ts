/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ import {
	type Webhook,
	type UsingClient,
	type TopLevelBuilders,
	type ApplicationEmoji,
	Container,
	TextDisplay,
	MediaGallery,
	MediaGalleryItem,
	AttachmentBuilder,
	Section,
	Thumbnail,
} from "seyfert";
import type { ColorResolvable } from "seyfert/lib/common";
import type { Message } from "seyfert/lib/structures";
import { getGifLink } from "./tenor";

export async function processUrlIntegrations(
	webhook: Webhook,
	client: UsingClient,
	message: Message,
	messageId: string,
	stringContents: string,
	reply: TopLevelBuilders[],
	mainContents: TopLevelBuilders[],
	fileAttachments: Array<{ buff: Buffer; name: string }>,
	uploadedEmojis: ApplicationEmoji[],
) {
	const urlAttachments: Array<
		{ buff: Buffer; name: string } | { link: string }
	> = [];
	const containerAttachments: Array<Container> = [];
	const urlRegex = /(?<!<)(https?:\/\/[^\s>]+)(?!>)/g;
	const userPerms = await client.channels.memberPermissions(
		message.channelId,
		await client.members.fetch(message.guildId as string, message.user.id),
		true,
	);

	if (userPerms.has(["EmbedLinks"]) ?? false) {
		const matches = message.content.match(urlRegex) ?? [];
		for (const regex of matches) {
			if (regex.startsWith("https://tenor.com")) {
				const link = await getGifLink(regex);

				if (link !== null) {
					urlAttachments.push({ link });
					continue;
				}
			}
			if (regex.startsWith("https://cdn.discordapp.com/attachments/")) {
				urlAttachments.push({ link: regex });
				continue;
			}

			const url = await fetch(
				`https://wsrv.nl/?url=${encodeURIComponent(regex)}`,
			);

			if (url.ok) {
				urlAttachments.push({ link: regex });
			} else {
                // biome-ignore lint/suspicious/noExplicitAny: any required.
                const result = await url.json() as any

				if (result.message === "Invalid or unsupported image format. Is it a valid image?" && !/^https:\/\/([a-zA-Z0-9-]+\.)?discord\.com/.test(regex)) {
					const meta = await fetch(
						`${process.env.LINK_SCRAPER_API}?url=${encodeURIComponent(regex)}`,
						{ signal: AbortSignal.timeout(3000) },
					);

					if (meta.ok) {
						const json = (await meta.json()) as Record<string, unknown>;

						containerAttachments.push(
							new Container()
								.setComponents(
									new TextDisplay().setContent(`### [${json?.title ?? json?.["og:title"] ?? json?.["twitter:title"] ?? json?.["og:site_name"] ?? ""}](${regex})
${json?.description ?? json?.["og:description"] ?? json?.["twitter:description"] ?? ""}`),
									...(json?.["og:image"]
										? [
												new MediaGallery().setItems(
													new MediaGalleryItem().setMedia(
														json?.["og:image"] as string,
													),
												),
											]
										: []),
									...(json?.["og:site_name"] !== undefined ? [new TextDisplay().setContent(
										json?.["og:site_name"] !== undefined ? `-# ${json?.["og:site_name"]}` : ""
									)] : [])
								)
								.setColor(
									(json?.["theme-color"] as ColorResolvable | undefined) ??
										("#96bff8" as ColorResolvable),
								),
						);
					}
				}
			}
		}
	}

	// Only edit if we have URL-based attachments to add
	if (urlAttachments.length > 0 || containerAttachments.length > 0) {
		const hasFileAttachmentsFromMessage = fileAttachments.length > 0;
		const isOnlyTenorUrl =
			stringContents.startsWith("https://tenor.com") &&
			stringContents.split(/\s+/).length === 1;
		const hasTextContent =
			stringContents.length > 0 &&
			!(isOnlyTenorUrl && !hasFileAttachmentsFromMessage);

		// Combine file attachments and URL attachments
		const allAttachments: Array<
			{ buff: Buffer; name: string } | { link: string }
		> = [
			...fileAttachments.map((fa) => ({ buff: fa.buff, name: fa.name })),
			...urlAttachments,
		];

		await webhook.messages.edit({
			messageId,
			body: {
                allowed_mentions: { parse: [] },
				components: [
					...reply,
					...(hasTextContent ? mainContents : []),
					...(urlAttachments.length > 0
						? [
								new MediaGallery().addItems(
									allAttachments.map((attachment) =>
										new MediaGalleryItem().setMedia(
											"link" in attachment
												? attachment.link
												: `attachment://${(attachment as { name: string }).name}`,
										),
									),
								),
							]
						: []),
					...containerAttachments,
				],
				files: allAttachments
					.filter((c) => "name" in c)
					.map((c) =>
						new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name),
					),
			},
		});

		for (const emoji of uploadedEmojis) {
			emoji.delete();
		}
	}
}
