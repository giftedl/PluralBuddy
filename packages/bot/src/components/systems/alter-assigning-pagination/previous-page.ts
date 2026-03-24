import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class PreviousPageAlterAssigning extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterAssignPagination.PreviousPage.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.AlterAssignPagination.PreviousPage.substring(
				ctx.customId,
			)[0];
		const corresponding = assignTagPagination.find((v) => v.id === paginationToken);
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

		// Decrement its page
		corresponding.memoryPage -= 1;

		// Re-add it to the array
		assignTagPagination.push(corresponding);

		return await ctx.update({
			components: [
                ...await new AlertAssignTagView(ctx.userTranslations()).alterAssignTag(user.system, undefined, corresponding)
			],
		});
	}
}
