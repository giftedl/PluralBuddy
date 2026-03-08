/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */import { InteractionIdentifier } from "@/lib/interaction-ids";
import { has } from "@/lib/privacy-bitmask";
import { alterCollection, tagCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	AlertAssignTagView,
	assignTagPagination,
} from "@/views/alter-assign-tag";
import { otherAlterPagination, SystemSettingsView } from "@/views/system-settings";
import { SystemProtectionFlags } from "plurography";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export default class SearchFormModal extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.OtherAlterPagination.SearchQueryForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.FormSelection.OtherAlterPagination.SearchQueryForm.substring(
				ctx.customId,
			)[0];
		const corresponding = otherAlterPagination.find(
			(v) => v.id === paginationToken,
		);
		const searchQuery = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.OtherAlterPagination.SearchQueryType.create(),
			true,
		);
		const searchValue = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.OtherAlterPagination.SearchQueryValueType.create(),
			true
		)

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


		const user = await userCollection.findOne({ userId: corresponding.userId });

		if (user?.system === undefined || !has(SystemProtectionFlags.ALTERS, user?.system?.public)) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		// Remove the item from the array
		otherAlterPagination.splice(
			otherAlterPagination.findIndex((v) => v.id === corresponding.id),
			1,
		);

		// Increment its page
		corresponding.searchQuery = searchQuery as string;
		corresponding.queryType = searchValue[0] as "username" | "display-name";

        const documentCount = await alterCollection.countDocuments({
            systemId: corresponding.userId,
			...(searchValue[0] === "display-name"
				? { displayName: { $regex: searchQuery as string ?? "" } }
				: searchValue[0] === "username"
					? { username: { $regex: searchQuery as string ?? "" } }
					: {}),
        });

        corresponding.documentCount = documentCount;
        corresponding.memoryPage = 1;

		// Re-add it to the array
		otherAlterPagination.push(corresponding);

		return await ctx.interaction.update({
			components: [
				...(await new SystemSettingsView(ctx.userTranslations()).otherAltersSettings(
					user.system,
					corresponding,
				)),
			],
		});
	}
}
