import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";

export default class SetSystemTag extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.SetSystemTag.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.interaction.update({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const form = new Modal()
			.setCustomId(
				InteractionIdentifier.Systems.Configuration.FormSelection.SystemTagForm.create(),
			)
			.setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
			.addComponents([
				new Label()
					.setLabel(ctx.userTranslations().SYSTEM_SYSTEM_TAG_FORM_LABEL)
					.setComponent(
						user.system.systemDisplayTag === undefined
							? new TextInput()
									.setStyle(TextInputStyle.Paragraph)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.SystemTagType.create(),
									)
									.setLength({ min: 3, max: 2000 })
									.setRequired(true)
							: new TextInput()
									.setStyle(TextInputStyle.Paragraph)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.SystemTagType.create(),
									)
									.setLength({ min: 3, max: 2000 })
									.setRequired(true)
									.setValue(user.system.systemDisplayTag),
					),
			]);

		return await ctx.modal(form);
	}
}
