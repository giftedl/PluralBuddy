/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	ComponentCommand,
	type ComponentContext,
	Container,
	Label,
	Modal,
	ModalSubmitInteraction,
	TextDisplay,
	TextInput,
} from "seyfert";
import { ButtonStyle, MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { mentionCommand } from "@/lib/mention-command";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { writeUserById } from "../../../types/user";
import { AlertView } from "../../../views/alert";
import { LoadingView } from "../../../views/loading";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";
import { createdSystems } from "../create-new-system";

export default class NameCNS extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.Pagination.Page3.startsWith(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.update({
			components: new LoadingView((await ctx.userTranslations())).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
		const oldInteractionId =
			InteractionIdentifier.Setup.Pagination.Page3.substring(ctx.customId)[0] ??
			"";
		const possibleSystem = createdSystems.get(oldInteractionId);
		const user = await ctx.retrievePUser();

		if (possibleSystem === undefined) {
			return ctx.write({
				content: (await ctx.userTranslations()).ERROR_INTERACTION_TOO_OLD,
				flags: MessageFlags.Ephemeral,
			});
		}
		const { terminology, ...temporarySystem } = possibleSystem;

		await writeUserById(ctx.author.id, {
			userId: ctx.author.id,
			blocked: false,
			storagePrefix: user.storagePrefix,
			terminology: terminology,
			// @ts-ignore
			system: {
				associatedUserId: ctx.author.id,
				...temporarySystem,
			},
		});

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).CREATING_NEW_SYSTEM_SUCCESS.replaceAll(
						"%command1%",
						mentionCommand(
							(await ctx.getDefaultPrefix()) ?? "",
							"system create-alter",
							ctx.interaction.message.messageReference === undefined,
							"%username% %display name%",
						),
					).replaceAll(
						"%command2%",
						mentionCommand(
							(await ctx.getDefaultPrefix()) ?? "",
							"system create-tag",
							ctx.interaction.message.messageReference === undefined,
							"%name%",
						),
					),
				),
				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
						)
						.setLabel((await ctx.userTranslations()).CONFIGURE_SYSTEM)
						.setEmoji(emojis.wrenchWhite)
						.setStyle(ButtonStyle.Primary),
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
