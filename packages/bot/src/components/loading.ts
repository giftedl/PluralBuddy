import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class DisabledOption extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return context.customId === "loading";
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        ctx.deferUpdate();
	}
}
