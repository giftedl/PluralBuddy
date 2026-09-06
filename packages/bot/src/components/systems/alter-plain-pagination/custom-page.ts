import {
	ActionRow,
	Button,
	ComponentCommand,
	type ComponentContext,
	Label,
	Modal,
	TextDisplay,
	TextInput,
} from "seyfert";
import { ButtonStyle, MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

export default class NextPageAP extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPage.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const page =
			InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPage.substring(
				ctx.customId,
			)[0];

		return await ctx.modal(
			new Modal()
				.setComponents([
					new Label()
						.setLabel((await ctx.userTranslations()).CUSTOM_PAGE_TITLE)
						.setDescription(
							(await ctx.userTranslations()).CUSTOM_PAGE_DESC.replace(
								"{{ page }}",
								Math.ceil(user.system.alterIds.length / 90).toString(),
							),
						)
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPageInput.create(),
								)
								.setLength({ max: 3 })
								.setRequired(true)
								.setValue(page ?? "1")
								.setStyle(TextInputStyle.Short),
						),
				])
				.setCustomId(
					InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPageForm.create(),
				)
				.setTitle((await ctx.userTranslations()).JUMP_TO_CUSTOM_PAGE),
		);
	}
}
