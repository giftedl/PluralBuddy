import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { SystemSettingsView, tagsPagination } from "@/views/system-settings";
export default class NextPageTagPagination extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.TagPagination.NextPage.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.deferUpdate();
		const paginationToken =
			InteractionIdentifier.Systems.Configuration.AlterPagination.NextPage.substring(
				ctx.customId,
			)[0];
		const corresponding = tagsPagination.find((v) => v.id === paginationToken);
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.followup({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (corresponding === undefined) {
			return await ctx.followup({
				components: [
					...new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_TAG_PAGINATION_TOO_OLD",
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

		// Increment its page
		corresponding.memoryPage += 1;

		// Re-add it to the array
		tagsPagination.push(corresponding);

		return await ctx.editOrReply({
			components: [
				...(await new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(user.system)?.preferAccessiblity,
				).tagsSettings(user.system, corresponding)),
			],
		});
	}
}
