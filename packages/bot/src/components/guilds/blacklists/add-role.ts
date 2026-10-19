import {
	ComponentCommand,
	type ComponentContext,
	Label,
	Middlewares,
	Modal,
	RoleSelectMenu,
	UserSelectMenu,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";

@Middlewares(["ensureGuildPermissions"])
export default class AddRoleButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.AddBlockRole.startsWith(
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
							new RoleSelectMenu()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.AddBlockRoleSelection.create(),
								)
								.setDefaultRoles(guild.blockedRoles)
								.setValuesLength({ min: 0, max: 25 })
								.setRequired(),
						)
						.setLabel("Block Roles")
						.setDescription("Set all applicable blocked roles."),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.AddBlockRoleForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
