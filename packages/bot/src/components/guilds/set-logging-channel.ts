import {
    ChannelSelectMenu,
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ChannelType, TextInputStyle } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class SetGuildLogging extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.SetLoggingChannel.startsWith(
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
							new ChannelSelectMenu()
                                .setDefaultChannels(guild.logChannel ? [guild.logChannel] : [])
                                .setValuesLength({min: 1, max: 1})
                                .setCustomId(InteractionIdentifier.Guilds.FormSelection.LoggingChannelSelection.create())
                                .setChannelTypes([ ChannelType.GuildText ]),
						)
						.setLabel("Logging Channel"),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.LoggingChannelForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
