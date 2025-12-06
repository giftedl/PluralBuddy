import { InteractionIdentifier } from "@/lib/interaction-ids";
import { tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	AlertAssignTagView,
	assignTagPagination,
} from "@/views/alter-assign-tag";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export default class SearchFormModal extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.AlterAssignPagination.SearchQueryForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.FormSelection.AlterAssignPagination.SearchQueryForm.substring(
				ctx.customId,
			)[0];
		const corresponding = assignTagPagination.find(
			(v) => v.id === paginationToken,
		);
		const searchQuery = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.AlterAssignPagination.SearchQueryType.create(),
			true,
		);

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

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

		// Remove the item from the array
		assignTagPagination.splice(
			assignTagPagination.findIndex((v) => v.id === corresponding.id),
			1,
		);

		// Increment its page
		corresponding.searchQuery = searchQuery as string;

        const documentCount = await tagCollection.countDocuments({
            systemId: user.system.associatedUserId,
            tagFriendlyName: { $regex: searchQuery as string },
        });

        corresponding.documentCount = documentCount;

		// Re-add it to the array
		assignTagPagination.push(corresponding);

		return await ctx.interaction.update({
			components: [
				...(await new AlertAssignTagView(ctx.userTranslations()).alterAssignTag(
					user.system,
					undefined,
					corresponding,
				)),
			],
		});
	}
}
