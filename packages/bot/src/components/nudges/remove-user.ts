/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */import { ComponentCommand, Label, UserSelectMenu, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { Modal } from "seyfert";
import { TextInput } from "seyfert";
import { TextInputStyle } from "seyfert/lib/types";

export default class AddUserBlockListNudge extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.RemoveBlock.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const modal = new Modal()
			.setCustomId(
				InteractionIdentifier.Nudge.RemoveNudgeForm.create(),
			)
			.setTitle(ctx.userTranslations().NUDGE_BLOCKLIST)
			.setComponents([
				new Label()
					.setLabel(ctx.userTranslations().BLOCKLIST_USER)
					.setComponent(
						new UserSelectMenu()
							.setCustomId(
								InteractionIdentifier.Nudge.RemoveNudgeType.create(),
							)
							.setValuesLength({ max: 1, min: 1 }),
					),
			]);

		return await ctx.modal(modal);
	}
}
