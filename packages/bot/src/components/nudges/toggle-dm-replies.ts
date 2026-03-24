import { InteractionIdentifier } from "@/lib/interaction-ids";
import { writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { NudgePreferences } from "@/views/nudge-preferences";
import { ComponentCommand, ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";



export default class AddUserBlockListNudge extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.ToggleDMReplies.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        const silent = InteractionIdentifier.Nudge.ToggleDMReplies.substring(ctx.customId)[0];
		let user = await ctx.retrievePUser();

		await writeUserById(user.userId, {
			...user,
			nudging: { ...user.nudging, dmReply: !user.nudging.dmReply },
		});

		user.nudging.dmReply = !user.nudging.dmReply;

        if (silent === "true")
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).successView("DISABLED_DM_REPLIES"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        else
		return await ctx.update({
			components: new NudgePreferences(ctx.userTranslations()).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
        
    }
}