/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Options,
	type CommandContext,
	createBooleanOption,
	Declare,
	SubCommand,
	Container,
	TextDisplay,
	Message,
} from "seyfert";
import { AlertView } from "../../views/alert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { emojis } from "../../lib/emojis";
import { mentionCommand } from "@/lib/mention-command";

const options = {
	"media-included": createBooleanOption({
		description:
			"Deleting the media will ensure the media gets deleted in around 7-8 days from now.",
		aliases: ["m", "mi"],
	}),
};

@Declare({
	name: "delete",
	description: "Removes the system",
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class SetupCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "media-included": mi } = ctx.options;
		const { system } = await ctx.retrievePUser()

		if (!system) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
		}

		return await ctx.ephemeral(
			{
				components: [
					new Container()
						.setComponents(
							new TextDisplay().setContent(
								ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION,
							),
						)
						.setColor("#FF1717"),
					new Container().setSpoiler(true).setComponents(
						new TextDisplay().setContent(
							`You can delete your system <t:${Math.floor((Date.now() + 10000) / 1000)}:R>.`,
						),
						new ActionRow().setComponents(
							new Button()
								.setEmoji(emojis.settingsWhite)
								.setStyle(ButtonStyle.Primary)
								.setLabel(ctx.userTranslations().BACK_TO_SAFETY_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
								),
							new Button()
								.setEmoji(emojis.circleQuestionWhite)
								.setStyle(ButtonStyle.Danger)
								.setDisabled(true)
								.setLabel(
									ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN,
								)
								.setCustomId(
									mi
										? InteractionIdentifier.Systems.DeleteSystemMedia.create()
										: InteractionIdentifier.Systems.DeleteSystem.create(),
								),
						),
						new TextDisplay().setContent(
							ctx
								.userTranslations()
								.CONFIRMATION_SYSTEM_DELETION_PRIVACY.replace(
									"%command%",
									mentionCommand(
										(await ctx.getDefaultPrefix()) ?? "pb;",
										"system delete",
										ctx.interaction.message?.messageReference === undefined,
										"-mi",
									),
								),
						),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			},
			false,
			(message) => {
				console.log(message);
				setTimeout(async () => {
					message.editMessage({
						components: [
							new Container()
								.setComponents(
									new TextDisplay().setContent(
										ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION,
									),
								)
								.setColor("#FF1717"),
							new Container().setSpoiler(true).setComponents(
								new ActionRow().setComponents(
									new Button()
										.setEmoji(emojis.settingsWhite)
										.setStyle(ButtonStyle.Primary)
										.setLabel(ctx.userTranslations().BACK_TO_SAFETY_BTN)
										.setCustomId(
											InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
										),
									new Button()
										.setEmoji(emojis.circleQuestionWhite)
										.setStyle(ButtonStyle.Danger)
										.setLabel(
											ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN,
										)
										.setCustomId(
											mi
												? InteractionIdentifier.Systems.DeleteSystemMedia.create()
												: InteractionIdentifier.Systems.DeleteSystem.create(),
										),
								),
								new TextDisplay().setContent(
									ctx
										.userTranslations()
										.CONFIRMATION_SYSTEM_DELETION_PRIVACY.replace(
											"%command%",
											mentionCommand(
												(await ctx.getDefaultPrefix()) ?? "pb;",
												"system delete",
												ctx.interaction.message?.messageReference === undefined,
												"-mi",
											),
										),
								),
							),
						],
					});
				}, 10000);
			},
		);
	}
}
