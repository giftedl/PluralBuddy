import {
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	RoleSelectMenu,
	UserSelectMenu,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";

@Middlewares(["ensureGuildPermissions"])
export default class AddRoleButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.AddBlacklistRole.startsWith(
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
										InteractionIdentifier.Guilds.FormSelection.AddBlacklistRoleSelection.create(),
									)
									.setDefaultRoles(guild.blacklistedRoles)
									.setValuesLength({ min: 0, max: 25 }).data,
								// @ts-ignore lol seyfert forgor to add the required boolean to select menus
								required: false,
							}),
						)
						.setLabel("Blacklist Roles")
						.setDescription("Set all applicable blacklist roles."),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.AddBlacklistRoleForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
