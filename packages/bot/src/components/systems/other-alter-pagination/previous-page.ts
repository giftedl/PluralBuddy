/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { SystemProtectionFlags } from "plurography";
import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { has } from "@/lib/privacy-bitmask";
import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { otherAlterPagination, SystemSettingsView } from "@/views/system-settings";
export default class PreviousPage extends ComponentCommand {
  componentType = "Button" as const;

  override filter(context: ComponentContext<typeof this.componentType>) {
    return InteractionIdentifier.Systems.Configuration.OtherAlterPagination.PreviousPage.startsWith(
      context.customId,
    );
  }

  override async run(ctx: ComponentContext<typeof this.componentType>) {
    const paginationToken =
      InteractionIdentifier.Systems.Configuration.OtherAlterPagination.PreviousPage.substring(
        ctx.customId,
      )[0];
    const corresponding = otherAlterPagination.find((v) => v.id === paginationToken);

    if (corresponding === undefined) {
      return await ctx.write({
        components: [
          ...new AlertView(await ctx.userTranslations()).errorView("ERROR_PAGINATION_TOO_OLD"),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }

    const user = await userCollection.findOne({ userId: corresponding.userId });

    if (user?.system === undefined || !has(SystemProtectionFlags.ALTERS, user?.system?.public)) {
      return await ctx.ephemeral({
        components: new AlertView(await ctx.userTranslations()).errorView(
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

    // Decrement its page
    corresponding.memoryPage -= 1;

    // Re-add it to the array
    otherAlterPagination.push(corresponding);

    return await ctx.update({
      components: [
        ...(await new SystemSettingsView(
          await ctx.userTranslations(),
          getSystemFeatures(user.system)?.preferAccessiblity,
        ).otherAltersSettings(user.system, corresponding)),
      ],
    });
  }
}
