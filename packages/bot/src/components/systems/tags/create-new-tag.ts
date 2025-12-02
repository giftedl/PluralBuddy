/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import {
	ComponentCommand,
	Label,
	Modal,
	StringSelectMenu,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { tagColorSelection } from "@/lib/selection-options";

export default class CreateNewAlterBtn extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.TagPagination.CreateNewTag.startsWith(
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
					InteractionIdentifier.Systems.Configuration.FormSelection.Tags.CreateNewTagForm.create(),
				)
				.setTitle(ctx.userTranslations().CREATE_NEW_TAG_DESCRIPTION)
				.setComponents([
					new Label()
						.setLabel(ctx.userTranslations().ALTER_SET_DISPLAY)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(true)
								.setLength({ max: 100, min: 0 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDisplayNameType.create(),
								),
						),
					new Label()
						.setLabel(ctx.userTranslations().TAG_COLOR_FORM_LABEL)
						.setComponent(
							new StringSelectMenu()
								.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorType.create())
								.setOptions(tagColorSelection(ctx.userTranslations()))
						)
				]),
		);
	}
}
