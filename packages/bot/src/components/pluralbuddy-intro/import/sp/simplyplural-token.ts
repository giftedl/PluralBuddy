import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ComponentCommand, ComponentContext, Label, Modal, ModalCommand, TextInput, type ContextComponentCommandInteractionMap, type ModalContext } from "seyfert";
import { TextInputStyle } from "seyfert/lib/types";


export default class SimplyPluralToken extends ComponentCommand {
    componentType = "Button" as const;

	override filter(ctx: ComponentContext) {
		return InteractionIdentifier.Setup.SimplyPluralUploadToken.equals(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext) {
		return await ctx.modal(
			new Modal()
				.setTitle((await ctx.userTranslations()).IMPORT_SIMPLYPLURAL_DESCRIPTION)
				.setCustomId(InteractionIdentifier.Setup.FormSelection.SpTokenForm.create())
                .setComponents(
                    [new Label()
                        .setLabel((await ctx.userTranslations()).IMPORT_TOKEN_DESCRIPTION)
                        .setComponent(
                            new TextInput()
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.SpToken.create())
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        )]
                ),
		);

    }
}