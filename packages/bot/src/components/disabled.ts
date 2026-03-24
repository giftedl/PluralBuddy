import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class DisabledOption extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return context.interaction.values[0] === "--";
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView(
				"OPTION_DISABLED",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
