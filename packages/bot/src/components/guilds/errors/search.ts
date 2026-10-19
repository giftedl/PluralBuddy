import { GuildErrorTypes } from "plurography";
import {
	ChannelSelectMenu,
	ComponentCommand,
	type ComponentContext,
	Label,
	Modal,
	RoleSelectMenu,
	StringSelectMenu,
	StringSelectOption,
	UserSelectMenu,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";

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
				.setTitle((await ctx.userTranslations()).SEARCH_FORM_TITLE)
				.setComponents([
					new Label()
						.setComponent(
							new UserSelectMenu()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.SearchingErrorsUserSelection.create(),
								)
								.setValuesLength({ min: 0, max: 1 })
								.setRequired(false),
						)
						.setLabel((await ctx.userTranslations()).AFFECTED_USER),
					new Label()
						.setComponent(
							new ChannelSelectMenu()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.SearchingErrorsChannelSelection.create(),
								)
								.setValuesLength({ min: 0, max: 1 })
								.setRequired(false),
						)
						.setLabel((await ctx.userTranslations()).AFFECTED_CHANNEL),
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
						.setLabel((await ctx.userTranslations()).AFFECTED_ERROR_TYPE),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.SearchingErrorsForm.create(),
				),
		);
	}
}
