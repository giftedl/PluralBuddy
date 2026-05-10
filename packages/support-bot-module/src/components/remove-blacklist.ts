import { getUserById, noteCollection, writeUserById } from "@/mongodb";
import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export default class RemoveBlock extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(context: ComponentContext<typeof this.componentType>) {
        return context.customId.startsWith("close-")
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {
        if (!ctx.member?.roles.keys.includes("1444241245634433134")) {
            return;
        }

        const userId = ctx.customId.substring("close-".length);
        const user = await getUserById(userId)

        if (!user.blocked) {
            return await ctx.update({
                content: "This user has not been blocked.",
                flags: MessageFlags.Ephemeral
            })
        }

        await writeUserById(user.userId, {
            ...user,
            blocked: false
        })

        await noteCollection.deleteOne({ associatedUserId: user.userId })

        
        return await ctx.update({
			content: "Okay, that user was un-blocked.",
			flags: MessageFlags.Ephemeral,
		});
    }
}