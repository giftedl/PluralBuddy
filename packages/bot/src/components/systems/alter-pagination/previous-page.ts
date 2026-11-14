/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { alterPagination, SystemSettingsView } from "@/views/system-settings";

export default class PreviousPage extends ComponentCommand {
  componentType = "Button" as const;

  override filter(context: ComponentContext<typeof this.componentType>) {
    return InteractionIdentifier.Systems.Configuration.AlterPagination.PreviousPage.startsWith(
      context.customId,
    );
  }

  override async run(ctx: ComponentContext<typeof this.componentType>) {
    const paginationToken =
      InteractionIdentifier.Systems.Configuration.AlterPagination.PreviousPage.substring(
        ctx.customId,
      )[0];
    const corresponding = alterPagination.find((v) => v.id === paginationToken);
    const user = await ctx.retrievePUser();

    if (user.system === undefined) {
      return await ctx.ephemeral({
        components: new AlertView(await ctx.userTranslations()).errorView(
          "ERROR_SYSTEM_DOESNT_EXIST",
        ),
        flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
      });
    }

    if (corresponding === undefined) {
      return await ctx.write({
        components: [
          ...new AlertView(await ctx.userTranslations()).errorView("ERROR_PAGINATION_TOO_OLD"),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }

    // Remove the item from the array
    alterPagination.splice(
      alterPagination.findIndex((v) => v.id === corresponding.id),
      1,
    );

    // Decrement its page
    corresponding.memoryPage -= 1;

    // Re-add it to the array
    alterPagination.push(corresponding);

    return await ctx.update({
      components: [
        ...(await new SystemSettingsView(
          await ctx.userTranslations(),
          getSystemFeatures(user.system)?.preferAccessiblity,
        ).altersSettings(user.system, corresponding)),
      ],
    });
  }
}
