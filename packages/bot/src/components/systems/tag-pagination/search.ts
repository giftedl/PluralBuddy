import {
	ComponentCommand,
	Label,
	Modal,
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
import { tagsPagination } from "@/views/system-settings";

export default class NextPagePagination extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.TagPagination.Search.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.TagPagination.Search.substring(
				ctx.customId,
			)[0];
		const corresponding = tagsPagination.find(
			(v) => v.id === paginationToken,
		);

		if (corresponding === undefined) {
			return await ctx.write({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"ERROR_TAG_PAGINATION_TOO_OLD",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		return await ctx.modal(
			new Modal()
				.setTitle(ctx.userTranslations().SEARCH_FORM_TITLE)
                .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.TagPagination.SearchQueryForm.create(corresponding.id))
				.setComponents([
					new Label()
						.setLabel(ctx.userTranslations().SEARCH_QUERY)
						.setDescription(ctx.userTranslations().SEARCH_REG_EXPRESSIONS)
						.setComponent(
                            new TextInput()
                                .setStyle(TextInputStyle.Short)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.TagPagination.SearchQueryType.create())
                                .setRequired(true)
                        ),
				]),
		);
	}
}
