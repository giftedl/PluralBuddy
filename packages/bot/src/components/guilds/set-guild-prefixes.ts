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
export default class SetGuildPrefixes extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.SetPrefixes.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const guild = await ctx.retrievePGuild();

		return await ctx.modal(
			new Modal()
				.setComponents([
					new Label()
						.setComponent(
							new TextInput()
                                .setStyle(TextInputStyle.Short)
                                .setValue(guild.prefixes.join(","))
                                .setRequired(true)
                                .setCustomId(InteractionIdentifier.Guilds.FormSelection.SetPrefixesSelection.create()),
						)
						.setLabel("Prefixes")
						.setDescription("Prefixes are separated by commas."),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.SetPrefixesForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
