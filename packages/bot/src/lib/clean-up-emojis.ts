import { client } from "..";

export async function cleanUpCustomEmojis() {
    const emojis = await client.applications.listEmojis(true);
    const deletableEmojis = emojis.filter(v => v.user.id === client.applicationId);

    for (const emoji of deletableEmojis)
        await emoji.delete();
}



export function startEmojiCleanupTimer() {
    cleanUpCustomEmojis()
	setInterval(
		async () => {
            cleanUpCustomEmojis()
		},
		1000 * 60 * 120,
	);
}