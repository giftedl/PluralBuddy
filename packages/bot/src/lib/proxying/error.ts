import type { GuildErrorTypes, PUser } from "plurography";
import { Button, Container, type Message, Section, TextDisplay } from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import type z from "zod";
import { client } from "@/index";
import { errorCollection } from "@/mongodb";
import { createError } from "../create-error";
import { emojis } from "../emojis";
import { InteractionIdentifier } from "../interaction-ids";

export async function createProxyError(
	user: PUser,
	message: Message,
	opts: {
		title: string;
		description: string;
		type: z.infer<typeof GuildErrorTypes>;
		setSystemTag?: string;
	},
) {
	const previousApplicableErrors = await errorCollection.countDocuments({
		$and: [
			{ responsibleUserId: user.userId },
			{ type: opts.type },
			{ responsibleGuildId: message.guildId },
		],
	});

	client.logger.warn("user ran into error [{type}]", { type: opts.type });

	if (previousApplicableErrors >= 1) {
		return;
	}

	const error = await createError(message.guildId ?? "", {
		...opts,

		responsibleUserId: message.user.id,
		responsibleChannelId: message.channelId,
	});
	message.react(emojis.x);

	const textDisplay =
		new TextDisplay().setContent(`  ${emojis.x}   **${error.title}**
> - ${error.description}
> -# This error will not appear again for a while.`);

	await message.user.write({
		components: [
			new Container()
				.setComponents(
					opts.type === "EnforcedGuildTagRegulation"
						? new Section()
								.setComponents(textDisplay)
								.setAccessory(
									new Button()
										.setCustomId(
											InteractionIdentifier.Systems.Configuration.SetSystemTag.create(),
										)
										.setLabel(opts.setSystemTag ?? "Set System Tag")
										.setStyle(ButtonStyle.Primary),
								)
						: textDisplay,
				)
				.setColor("#B70000"),
		],
		flags: MessageFlags.IsComponentsV2,
	});

	return;
}
