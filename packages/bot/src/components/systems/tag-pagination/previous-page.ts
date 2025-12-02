/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterPagination, SystemSettingsView, tagsPagination } from "@/views/system-settings";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";

export default class PreviousPage extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.TagPagination.PreviousPage.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.TagPagination.PreviousPage.substring(
				ctx.customId,
			)[0];
		const corresponding = tagsPagination.find((v) => v.id === paginationToken);
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

		// Remove the item from the array
		tagsPagination.splice(
			tagsPagination.findIndex((v) => v.id === corresponding.id),
			1,
		);

		// Decrement its page
		corresponding.memoryPage -= 1;

		// Re-add it to the array
		tagsPagination.push(corresponding);

		return await ctx.update({
			components: [
				...(await new SystemSettingsView(ctx.userTranslations()).tagsSettings(
					user.system,
					corresponding,
				)),
			],
		});
	}
}
