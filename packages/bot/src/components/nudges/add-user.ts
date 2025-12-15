import { ComponentCommand, Label, UserSelectMenu, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { Modal } from "seyfert";
import { TextInput } from "seyfert";
import { TextInputStyle } from "seyfert/lib/types";

export default class AddUserBlockListNudge extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.AddBlock.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const modal = new Modal()
			.setCustomId(
				InteractionIdentifier.Nudge.AddNudgeForm.create(),
			)
			.setTitle(ctx.userTranslations().NUDGE_BLOCKLIST)
			.setComponents([
				new Label()
					.setLabel(ctx.userTranslations().BLOCKLIST_USER)
					.setComponent(
						new UserSelectMenu()
							.setCustomId(
								InteractionIdentifier.Nudge.AddNudgeType.create(),
							)
							.setValuesLength({ max: 1, min: 1 }),
					),
			]);

		return await ctx.modal(modal);
	}
}
