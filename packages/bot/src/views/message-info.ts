/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { PAlter, PMessage, PSystem } from "plurography";
import { TranslatedView } from "./translated-view";
import {
	Container,
	Message,
	Separator,
	TextDisplay,
	User,
	type GuildMemberStructure,
	type UserStructure,
} from "seyfert";
import { ComponentType, Spacing } from "seyfert/lib/types";
import { AlertView } from "./alert";
import { AlterView } from "./alters";
import { SystemView } from "./system";
import { emojis } from "@/lib/emojis";
import { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";

export class MessageInfo extends TranslatedView {
	async messageInfo(
		message: PMessage,
		alter: PAlter,
		system: PSystem,
		messageNative: Message,
		user: GuildMemberStructure | undefined,
		external: boolean,
	) {
		let contents = "";

		if (messageNative.components !== undefined) {
			if (
				messageNative.components[0] !== undefined &&
				messageNative.components[0].type === ComponentType.TextDisplay &&
				messageNative.components[0] instanceof TextDisplayComponent
			) {
				if (
					!messageNative.components[0].content.startsWith(`-# ${emojis.reply}`)
				)
					contents = messageNative.components[0].content;
				else if (
					messageNative.components[1] !== undefined &&
					messageNative.components[1].type === ComponentType.TextDisplay &&
					messageNative.components[1] instanceof TextDisplayComponent
				)
					contents = messageNative.components[1].content;
			}
		}

		return [
			new Container().setComponents(
				...((
					await new AlterView(this.translations).alterProfileView(
						alter,
						external,
					)
				)[0]?.components ?? []),
				new Separator(),
				...(new SystemView(this.translations).systemProfileView(
					system,
					external,
				)[0]?.components ?? []),
			),
			new Separator().setSpacing(Spacing.Large),
			new Container().setComponents(
				new TextDisplay().setContent(
					this.translations.MESSAGE_INFO_CONTENTS.replace(
						"{{ messageId }}",
						messageNative.id,
					)
						.replaceAll("{{ userId }}", user?.id ?? "")
						.replace(
							"{{ roleCount }}",
							String(((await user?.roles.list()) ?? []).length),
						)
						.replace(
							"{{ roleList }}",
							((await user?.roles.list()) ?? [])
								.map((c) => c.name)
								.filter((v) => v !== "@everyone")
								.join(", "),
						),
				),
				new Separator(),
				new TextDisplay().setContent(
					`https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${message.messageId}`,
				),
			),
		];
	}
}
