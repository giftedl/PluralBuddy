import {
	ComponentCommand,
	Container,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export default class StatusTemplateButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return context.customId === "status-template";
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return ctx.write({
			components: [
				new Container().setComponents(
					new TextDisplay().setContent(
						`\`\`\`\n[ <t:${Math.floor(Date.now() / 1000)}:f> ] ❌ Message goes here.\n\`\`\``,
					),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
