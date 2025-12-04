/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ComponentCommand,
	Container,
	type Message,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "../../../views/system-settings";
import { AlertView } from "../../../views/alert";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";

export default class ConfigureTag extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Tags.ConfigureTagExternal.startsWith(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		let referencedMessage: Message | null = null;
		if (
			ctx.interaction.message.messageReference !== undefined &&
			ctx.interaction.message.messageReference.messageId !== undefined
		)
			referencedMessage = await ctx.client.messages
				.fetch(
					ctx.interaction.message.messageReference?.messageId,
					ctx.interaction.message.messageReference?.channelId,
				)
				.catch(() => null);

		if (referencedMessage !== null) {
			const originalUserId =
				referencedMessage?.author.id ??
				ctx.interaction.message.interactionMetadata?.user.id;
			if (ctx.author.id !== originalUserId) {
				return ctx.write({
					components: [
						new Container().setComponents(
							new TextDisplay().setContent(
								"You are not the original recipient of the message.",
							),
						),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
			}
		}

		const tagId =
			InteractionIdentifier.Systems.Configuration.Tags.ConfigureTagExternal.substring(
				ctx.customId,
			)[0];

		const systemId = ctx.author.id;
		const query = tagCollection.findOne({
			tagId,
			systemId,
		});
		const tag = await query;

		if (tag === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.write({
			components: [
				...new TagView(ctx.userTranslations()).tagTopView(
					"general",
					tag.tagId.toString(),
					tag.tagFriendlyName,
				),
				...new TagView(ctx.userTranslations()).tagGeneral(
					tag,
					(await ctx.getDefaultPrefix()) ?? "pb;",
					ctx.interaction.message.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
