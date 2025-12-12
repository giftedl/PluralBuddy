/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ComponentCommand,
	Label,
	Modal,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";

export default class SetUsernameButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.SetPronouns.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system } = await ctx.retrievePUser()

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
			})
		}

		const form = new Modal()
			.setCustomId(
				InteractionIdentifier.Systems.Configuration.FormSelection.SystemPronounsForm.create(
				),
			)
			.setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
			.addComponents([
				new Label()
					.setLabel(ctx.userTranslations().SYSTEM_PRONOUNS_FORM_LABEL)
					.setComponent(
						system.systemPronouns === undefined
							? new TextInput()
									.setStyle(TextInputStyle.Short)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.SystemPronounsType.create(),
									)
									.setLength({ min: 3, max: 100 })
									.setPlaceholder("express your inner identity 🎀")
									.setRequired(true)
							: new TextInput()
									.setStyle(TextInputStyle.Short)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.SystemPronounsType.create(),
									)
									.setLength({ min: 3, max: 100 })
									.setRequired(true)
									.setPlaceholder("express your inner identity 🎀")
									.setValue(system.systemPronouns),
					),
			]);

		return await ctx.modal(form);
	}
}
