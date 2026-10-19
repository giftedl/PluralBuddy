/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ComponentCommand,
	type ComponentContext,
	Label,
	Modal,
	TextInput,
} from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

export default class SetUsernameButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Tags.SetOrderString.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const tagId =
			InteractionIdentifier.Systems.Configuration.Tags.SetOrderString.substring(
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
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const form = new Modal()
			.setCustomId(
				InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagOrderStringForm.create(
					tag.tagId,
				),
			)
			.setTitle((await ctx.userTranslations()).TAG_FORM_TITLE)
			.addComponents([
				new Label()
					.setLabel(
						(await ctx.userTranslations()).ALTER_SEARCH_STRING_FORM_LABEL,
					)
					.setComponent(
						!tag.orderString
							? new TextInput()
									.setStyle(TextInputStyle.Short)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagOrderStringType.create(),
									)
									.setLength({ max: 4 })
									.setRequired(true)
									.setPlaceholder("2a")
							: new TextInput()
									.setStyle(TextInputStyle.Short)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagOrderStringType.create(),
									)
									.setLength({ max: 4 })
									.setRequired(true)
									.setValue(tag.orderString)
									.setPlaceholder("2a"),
					),
			]);

		return await ctx.modal(form);
	}
}
