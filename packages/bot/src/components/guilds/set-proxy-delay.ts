import {
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class SetProxyDelayCommand extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.SetProxyDelay.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.modal(
			new Modal()
				.setComponents([
					new Label()
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.SetProxyDelaySelection.create(),
								)
								.setStyle(TextInputStyle.Short),
						)
						.setLabel("Proxy Delay")
						.setDescription(
							"(seconds, maximum of 2.5 seconds, decimals allowed)",
						),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.SetProxyDelayForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
