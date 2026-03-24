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
export default class SearchButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.Search.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.modal(
			new Modal()
				.setTitle(ctx.userTranslations().ROLE_PREFERENCE_SEARCH)
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.SearchingRolePreferencesForm.create(),
				)
				.setComponents([
					new Label()
						.setComponent(
							new RoleSelectMenu()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.SearchingRolePreferencesSelection.create(),
								)
								.setValuesLength({ min: 1, max: 1 }),
						)
						.setLabel(ctx.userTranslations().SEARCH_QUERY),
				]),
		);
	}
}
