import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { userCollection } from "@/mongodb";

export default class OptOutDMs extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.SnoozeDMs.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        
		const { system } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

        await userCollection.updateOne({ userId: system.associatedUserId }, {
            $set: {
                "system.systemOperationDM": !system.systemOperationDM
            }
        })

        if (system.systemOperationDM) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).successView("OPTED_IN_OF_DMS"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        return await ctx.write({
            components: new AlertView(ctx.userTranslations()).successView("OPTED_OUT_OF_DMS"),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}
