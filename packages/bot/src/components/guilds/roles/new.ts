import {
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	RoleSelectMenu,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";

@Middlewares(["ensureGuildPermissions"])
export default class CreateNewRolePreference extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.CreateNewRolePreference.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.modal(
			new Modal()
				.setTitle(ctx.userTranslations().NEW_ROLE_PREF)
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.CreatingNewRoleForm.create(),
				)
				.setComponents([
					new Label()
						.setComponent(
							new RoleSelectMenu()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.CreatingNewRoleSelection.create(),
								)
								.setValuesLength({ min: 1, max: 1 }),
						)
						.setLabel(ctx.userTranslations().ROLE_USAGE),
				]),
		);
	}
}
