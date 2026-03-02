import {
	ChannelSelectMenu,
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	RoleSelectMenu,
	StringSelectMenu,
	TextInput,
	UserSelectMenu,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class AddChannelButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.AddBlacklistCategory.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const guild = await ctx.retrievePGuild();

		return await ctx.modal(
			new Modal()
				.setComponents([
					new Label()
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.AddBlacklistCategorySelection.create(),
								)
								.setStyle(TextInputStyle.Short)
								.setRequired(true),
						)
						.setLabel("Blacklist Category ID")
						.setDescription("Get ID of category: https://dis.gd/findmyid"),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.AddBlacklistCategoryForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
