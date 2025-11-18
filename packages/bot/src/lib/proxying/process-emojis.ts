import type { ApplicationEmoji } from "seyfert";
import { client } from "../..";

export async function processEmojis(
    trimmedContents: string): Promise<{ emojis: ApplicationEmoji[]; newMessage: string; }> {
    let processedContents = trimmedContents;

    // Get all emojis in message
    const emojiRegex = /(<a?:\w+:\d+>)|(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;
    const allEmojis: string[] = [];
    let match: RegExpExecArray | null = emojiRegex.exec(processedContents);
    while (match !== null) {
        allEmojis.push(match[0]);
        match = emojiRegex.exec(processedContents);
    }

    // Remove duplicates
    const nonDuplicatedArray = [...new Set(allEmojis)];

    // Objectify emojis
    const emojis = nonDuplicatedArray.map((string) => {
        return {
            id: string
                .split(":")[2]
                ?.substring(0, (string.split(":")[2]?.length ?? 3) - 1),
            name: string.split(":")[1],
            animated: string.split(":")[0] === "<a",
            link: `https://cdn.discordapp.com/emojis/${string.split(":")[2]?.substring(0, (string.split(":")[2]?.length ?? 3) - 1)}.webp?size=128&animated=${string.split(":")[0] === "<a"}`,
            string,
        };
    });

    const uploadedEmojis: ApplicationEmoji[] = [];

    for (const emoji of emojis) {
        const existingEmojis = await client.applications.listEmojis(true);

        if (existingEmojis.find((exEmoji: ApplicationEmoji) => emoji.name === exEmoji.name) !==
            undefined) {
            continue;
        }

        const createdEmoji = await client.applications.createEmoji({
            name: emoji.name as string,
            image: {
                data: emoji.link,
                type: "url",
            },
        });

        uploadedEmojis.push(createdEmoji);

        processedContents = processedContents.replaceAll(
            emoji.string,
            `<${createdEmoji.animated ? "a" : ""}:${createdEmoji.name}:${createdEmoji.id}>`
        );
    }

    return {
        emojis: uploadedEmojis,
        newMessage: processedContents
    };
}
