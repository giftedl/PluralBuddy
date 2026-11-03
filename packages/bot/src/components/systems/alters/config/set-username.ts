/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
	ComponentCommand,
	type ComponentContext,
	Label,
	Modal,
	TextInput,
} from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

export default class SetUsernameButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Alters.SetUsername.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.Alters.SetUsername.substring(
				ctx.customId,
			)[0];

		const systemId = await ctx.systemId();
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		const alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const form = new Modal()
			.setCustomId(
				InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameForm.create(
					alter.alterId,
				),
			)
			.setTitle((await ctx.userTranslations()).ALTER_FORM_TITLE)
			.addComponents([
				new Label()
					.setLabel((await ctx.userTranslations()).ALTER_USERNAME_FORM_LABEL)
					.setComponent(
						new TextInput()
							.setStyle(TextInputStyle.Short)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create(),
							)
							.setLength({ max: 20 })
							.setRequired(true)
							.setValue(alter.username),
					),
			]);

		return await ctx.modal(form);
	}
}
