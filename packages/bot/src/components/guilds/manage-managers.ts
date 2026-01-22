import { ComponentCommand, Label, Middlewares, Modal, RoleSelectMenu, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

@Middlewares(["administrativeGuildPermissions"])
export default class ManageManagersButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.AddManagers.startsWith(
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
							new RoleSelectMenu({
								...new RoleSelectMenu()
									.setCustomId(
										InteractionIdentifier.Guilds.FormSelection.AddManagersSelection.create(),
									)
									.setDefaultRoles(guild.managerRoles)
									.setValuesLength({ min: 0, max: 25 }).data,
								// @ts-ignore lol seyfert forgor to add the required boolean to select menus
								required: false,
							}),
						)
						.setLabel("Manager Roles"),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.AddManagersForm.create(),
				)
				.setTitle("Updating Guild"),
            )
    }
}
