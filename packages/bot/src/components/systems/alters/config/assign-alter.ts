import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { AlertAssignTagView } from "@/views/alter-assign-tag";

export default class AssignAlterButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Tags.AssignAlter.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        const alterId = InteractionIdentifier.Systems.Configuration.Tags.AssignAlter.substring(
            ctx.customId,
        )[0];
    
        const systemId = ctx.author.id;
        const query = alterCollection.findOne({
            alterId: Number(alterId),
            systemId,
        });
        const alter = await query;
    
        if (alter === null) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }
        
        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.update({
            components: [
                ...await new AlertAssignTagView(ctx.userTranslations()).alterAssignTag(user.system, alter)

            ],
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}
