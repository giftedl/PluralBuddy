import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

export default class PublicProfileBtn extends ComponentCommand {
  componentType = "Button" as const;

  override filter(context: ComponentContext<typeof this.componentType>) {
    return InteractionIdentifier.Systems.Configuration.PublicProfile.Index.startsWith(
      context.customId,
    );
  }

  override async run(ctx: ComponentContext<typeof this.componentType>) {
    const user = await ctx.retrievePUser();

    if (user.system === undefined) {
      return await ctx.ephemeral({
        components: new AlertView(await ctx.userTranslations()).errorView(
          "ERROR_SYSTEM_DOESNT_EXIST",
        ),
        flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
      });
    }

    return await ctx.update({
      components: [
        ...new SystemSettingsView(
          await ctx.userTranslations(),
          getSystemFeatures(user.system)?.preferAccessiblity,
        ).topView("public-settings", user.system.associatedUserId),
        ...new SystemSettingsView(
          await ctx.userTranslations(),
          getSystemFeatures(user.system)?.preferAccessiblity,
        ).publicProfile(
          user.system,
          (await ctx.getDefaultPrefix()) ?? "",
          ctx.interaction.message.messageReference === undefined,
        ),
      ],
      flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
    });
  }
}
