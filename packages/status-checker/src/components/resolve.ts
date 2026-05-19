import { ButtonStyle } from "discord-api-types/v9";
import {
	ActionRow,
	Button,
	ComponentCommand,
	type ComponentContext,
} from "seyfert";
import {
	MessageFlags,
	type APIContainerComponent,
	type APITextDisplayComponent,
} from "seyfert/lib/types";

export default class ResolveButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return context.customId === "resolve";
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		ctx.interaction.message.edit({
			components: [
				ctx.interaction.message.components[0] as APITextDisplayComponent,
				{
					...(ctx.interaction.message.components[1] as APIContainerComponent),
					accent_color: 0x008000,
                    type: ctx.interaction.message.components[1]?.type,
					components: [
						...(
							ctx.interaction.message.components[1] as APIContainerComponent
						).components.slice(0, -1),
						new ActionRow()
							.setComponents(
								new Button()
									.setStyle(ButtonStyle.Secondary)
									.setLabel("Copy (Resolved) Status Template")
									.setCustomId("resolved-status-template"),
								new Button()
									.setStyle(ButtonStyle.Success)
									.setLabel("Resolve")
									.setCustomId("resolve")
									.setDisabled(true),
							)
							.toJSON(),
					],
				},
			],
			flags: MessageFlags.IsComponentsV2,
		});

        return ctx.deferUpdate();
	}
}
