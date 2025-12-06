import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import {
	AlertAssignTagView,
	assignTagPagination,
} from "@/views/alter-assign-tag";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { alterCollection, tagCollection } from "@/mongodb";

export default class ToggleAssignButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.substring(
				ctx.customId,
			)[0];
		const tagId =
			InteractionIdentifier.Systems.Configuration.AlterAssignPagination.ToggleAssign.substring(
				ctx.customId,
			)[1] ?? "";

		const corresponding = assignTagPagination.find(
			(v) => v.id === paginationToken,
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
						"ERROR_PAGINATION_TOO_OLD",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (corresponding.alter.tagIds.includes(tagId)) {
			// Already has tag, remove tag

			await alterCollection.updateOne(
				{
					alterId: corresponding.alter.alterId,
					systemId: corresponding.alter.systemId,
				},
				{
					$pull: { tagIds: tagId },
				},
			);
            await tagCollection.updateOne(
                { tagId, systemId: corresponding.alter.systemId },
                { $pull: { associatedAlters: corresponding.alter.alterId.toString() } },
            )

            // Refresh from database
			const nextAlter = await alterCollection.findOne({
				alterId: corresponding.alter.alterId,
				systemId: corresponding.alter.systemId,
			});

			assignTagPagination.splice(
				assignTagPagination.findIndex((v) => v.id === corresponding.id),
				1,
			);

			corresponding.alter = nextAlter!;

		    assignTagPagination.push(corresponding);
		} else {
            // Assign tag

            await alterCollection.updateOne(
				{
					alterId: corresponding.alter.alterId,
					systemId: corresponding.alter.systemId,
				},
				{
					$push: { tagIds: tagId },
				},
			);
            await tagCollection.updateOne(
                { tagId, systemId: corresponding.alter.systemId },
                { $push: { associatedAlters: corresponding.alter.alterId.toString() } },
            )
            
            // Refresh from database
			const nextAlter = await alterCollection.findOne({
				alterId: corresponding.alter.alterId,
				systemId: corresponding.alter.systemId,
			});

			assignTagPagination.splice(
				assignTagPagination.findIndex((v) => v.id === corresponding.id),
				1,
			);

			corresponding.alter = nextAlter!;

		    assignTagPagination.push(corresponding);
        }

		return await ctx.update({
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
