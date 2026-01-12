/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { GraphModule, type GraphModuleDefaultOptions } from "../module";
import type { GraphMessage } from "../base";
import type {
	APIApplicationEmoji,
	RESTPostAPIApplicationEmojiJSONBody,
} from "discord-api-types/v10";
import { getAllReliableContents, replaceStringFromContents } from "../utils";

type EmojiModuleOptions = {
	createEmoji: CreateEmojiFunction,
	deleteEmoji: DeleteEmojiFunction,
	getEmojis: GetEmojiFunction,
} & GraphModuleDefaultOptions
type CreateEmojiFunction = (
	emoji: RESTPostAPIApplicationEmojiJSONBody,
) => Promise<APIApplicationEmoji>;
type DeleteEmojiFunction = (id: string) => Promise<void>;
type GetEmojiFunction = () => Promise<APIApplicationEmoji[]>;

export class EmojiModule extends GraphModule {
	createEmoji: CreateEmojiFunction;
	deleteEmoji: DeleteEmojiFunction;
	getEmojis: GetEmojiFunction;

	emojisPendingDeletion: string[] = [];

	constructor(
        opts: EmojiModuleOptions
	) {
		super(opts);

		this.createEmoji = opts.createEmoji;
		this.deleteEmoji = opts.deleteEmoji;
		this.getEmojis = opts.getEmojis;
	}

	override async message(input: GraphMessage): Promise<GraphMessage> {
		const processedContents = getAllReliableContents(input);
		const emojiRegex = /<a?:\w+:\d+>/g;
		const allEmojis: string[] = [];
		let match: RegExpExecArray | null = emojiRegex.exec(processedContents);
		while (match !== null) {
			allEmojis.push(match[0]);
			match = emojiRegex.exec(processedContents);
		}

		const nonDuplicatedArray = [...new Set(allEmojis)];

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

		const uploadedEmojis: APIApplicationEmoji[] = [];
		const replacements: { from: string; to: string }[] = [];

		for (const emoji of emojis) {
			const existingEmojis = await this.getEmojis();

			if (
				existingEmojis.find((exEmoji) => emoji.name === exEmoji.name) !==
				undefined
			) {
				continue;
			}

			const createdEmoji = await this.createEmoji({
				name: emoji.name as string,
				image: emoji.link,
			});

			uploadedEmojis.push(createdEmoji);
			replacements.push({
				from: emoji.string,
				to: `<${createdEmoji.animated ? "a" : ""}:${createdEmoji.name}:${createdEmoji.id}>`,
			});

			this.emojisPendingDeletion.push(createdEmoji.id);
		}

		return replaceStringFromContents(replacements, input);
	}

	override async postActions() {
		if (
			Array.isArray(this.emojisPendingDeletion) &&
			this.emojisPendingDeletion.length > 0
		) {
			for (const emojiId of [...this.emojisPendingDeletion]) {
				try {
					await this.deleteEmoji(emojiId);
					const index = this.emojisPendingDeletion.indexOf(emojiId);
					if (index !== -1) {
						this.emojisPendingDeletion.splice(index, 1);
					}
				} catch (e) {
					continue;
				}
			}
		}
	}
}
