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
		return InteractionIdentifier.Systems.Configuration.Alters.SetDescription.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.Alters.SetDescription.substring(
				ctx.customId,
			)[0];

		const systemId = ctx.author.id;
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		const alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const form = new Modal()
			.setCustomId(
				InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDescriptionForm.create(
					alter.alterId,
				),
			)
			.setTitle((await ctx.userTranslations()).ALTER_FORM_TITLE)
			.addComponents([
				new Label()
					.setLabel((await ctx.userTranslations()).SYSTEM_DESCRIPTION_FORM_LABEL)
					.setComponent(
						alter.description === null || alter.description === ""
							? new TextInput()
									.setStyle(TextInputStyle.Paragraph)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDescriptionType.create(),
									)
									.setLength({ max: 2000 })
									.setRequired(true)
							: new TextInput()
									.setStyle(TextInputStyle.Paragraph)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDescriptionType.create(),
									)
									.setLength({ max: 2000 })
									.setRequired(true)
									.setValue(alter.description),
					),
			]);

		return await ctx.modal(form);
	}
}
