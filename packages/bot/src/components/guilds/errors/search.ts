import {
	ChannelSelectMenu,
	ComponentCommand,
	Label,
	Modal,
	RoleSelectMenu,
	StringSelectMenu,
	StringSelectOption,
	UserSelectMenu,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { GuildErrorTypes } from "plurography";

export default class SearchForm extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.ErrorsTab.Search.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.modal(
			new Modal()
				.setTitle(ctx.userTranslations().SEARCH_FORM_TITLE)
				.setComponents([
					new Label()
						.setComponent(
							new UserSelectMenu({
								...new UserSelectMenu()
									.setCustomId(
										InteractionIdentifier.Guilds.FormSelection.SearchingErrorsUserSelection.create(),
									)
									.setValuesLength({ min: 0, max: 1 }).data,
								// @ts-ignore lol seyfert forgor to add the required boolean to select menus
								required: false,
							}),
						)
						.setLabel(ctx.userTranslations().AFFECTED_USER),
					new Label()
						.setComponent(
							new ChannelSelectMenu({
								...new ChannelSelectMenu()
									.setCustomId(
										InteractionIdentifier.Guilds.FormSelection.SearchingErrorsChannelSelection.create(),
									)
									.setValuesLength({ min: 0, max: 1 }).data,
								// @ts-ignore lol seyfert forgor to add the required boolean to select menus
								required: false,
							}),
						)
						.setLabel(ctx.userTranslations().AFFECTED_CHANNEL),
					new Label()
						.setComponent(
							new StringSelectMenu()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.SearchingErrorsTypeSelection.create(),
								)
								.setValuesLength({ min: 0, max: 1 })
								.setRequired(false)
								.setOptions(
									Object.keys(GuildErrorTypes.enum).map((c) =>
										new StringSelectOption().setLabel(c).setValue(c),
									),
								),
						)
						.setLabel(ctx.userTranslations().AFFECTED_ERROR_TYPE),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.SearchingErrorsForm.create(),
				),
		);
	}
}
