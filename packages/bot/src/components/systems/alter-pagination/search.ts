/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ import {
	ComponentCommand,
	Label,
	Modal,
	StringSelectMenu,
	StringSelectOption,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import {
	AlertAssignTagView,
	assignTagPagination,
} from "@/views/alter-assign-tag";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterPagination } from "@/views/system-settings";

export default class NextPagePagination extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterPagination.Search.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.AlterPagination.Search.substring(
				ctx.customId,
			)[0];
		const corresponding = alterPagination.find((v) => v.id === paginationToken);

		if (corresponding === undefined) {
			return await ctx.write({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"ERROR_ASSIGN_PAGINATION_TOO_OLD",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		return await ctx.modal(
			new Modal()
				.setTitle(ctx.userTranslations().SEARCH_FORM_TITLE)
				.setCustomId(
					InteractionIdentifier.Systems.Configuration.FormSelection.AlterPagination.SearchQueryForm.create(
						corresponding.id,
					),
				)
				.setComponents([
					new Label()
						.setLabel(ctx.userTranslations().SEARCH_QUERY)
						.setDescription(ctx.userTranslations().SEARCH_REG_EXPRESSIONS)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.AlterPagination.SearchQueryType.create(),
								)
								.setRequired(true),
						),
					new Label()
						.setLabel(ctx.userTranslations().SEARCH_QUERY_VALUE)
						.setDescription(ctx.userTranslations().SEARCH_QUERY_VALUE_DESC)
						.setComponent(
							new StringSelectMenu()
								.setRequired(true)
								.setValuesLength({ min: 1, max: 1 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.AlterPagination.SearchQueryValueType.create(),
								)
								.setOptions([
									new StringSelectOption()
										.setValue("display-name")
										.setLabel(ctx.userTranslations().SEARCH_QUERY_DISPLAY_NAME),
									new StringSelectOption()
										.setValue("username")
										.setLabel(ctx.userTranslations().SEARCH_QUERY_USERNAME),
								]),
						),
				]),
		);
	}
}
