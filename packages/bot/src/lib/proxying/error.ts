import { errorCollection } from "@/mongodb";
import type { GuildErrorTypes, PUser } from "plurography";
import { Container, TextDisplay, type Message } from "seyfert";
import { createError } from "../create-error";
import type z from "zod";
import { emojis } from "../emojis";
import { MessageFlags } from "seyfert/lib/types";

export async function createProxyError(
	user: PUser,
	message: Message,
	opts: {
		title: string;
		description: string;
		type: z.infer<typeof GuildErrorTypes>;
	},
) {
	const previousApplicableErrors = await errorCollection.countDocuments({
		$and: [
			{ responsibleUserId: user.userId },
			{ type: opts.type },
			{ responsibleGuildId: message.guildId },
		],
	});

	if (previousApplicableErrors >= 1) {
		return;
	}

	const error = await createError(message.guildId ?? "", {
        ...opts,

		responsibleUserId: message.user.id,
		responsibleChannelId: message.channelId,
	});
	message.react(emojis.x);

	await message.user.write({
		components: [
			new Container()
				.setComponents(
					new TextDisplay().setContent(`  ${emojis.x}   **${error.title}**
> - ${error.description}
> -# This error will not appear again for a while.`),
				)
				.setColor("#B70000"),
		],
		flags: MessageFlags.IsComponentsV2,
	});

	return;
}
