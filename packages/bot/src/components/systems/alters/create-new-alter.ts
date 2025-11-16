/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import {
	ComponentCommand,
	Label,
	Modal,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";

export default class CreateNewAlterBtn extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterPagination.CreateNewAlter.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.modal(
			new Modal()
				.setCustomId(
					InteractionIdentifier.Systems.Configuration.FormSelection.Alters.CreateNewAlterForm.create(),
				)
				.setTitle(ctx.userTranslations().CREATE_NEW_ALTER_DESCRIPTION)
				.setComponents([
					new Label()
						.setLabel(ctx.userTranslations().ALTER_SET_USERNAME)
						.setDescription(ctx.userTranslations().ALTER_SET_USERNAME_SPACES)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(true)
                                .setLength({ max: 20, min: 0 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create(),
								),
						),
					new Label()
						.setLabel(ctx.userTranslations().ALTER_DISPLAY_NAME_FORM_LABEL)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(true)
                                .setLength({ max: 100, min: 0 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameType.create(),
								),
						),
				]),
		);
	}
}
