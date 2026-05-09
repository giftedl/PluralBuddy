import {
	ChannelSelectMenu,
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	RoleSelectMenu,
	UserSelectMenu,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";

@Middlewares(["ensureGuildPermissions"])
export default class AddChannelButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.AddBlockChannel.startsWith(
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
							new ChannelSelectMenu({
								...new ChannelSelectMenu()
									.setCustomId(
										InteractionIdentifier.Guilds.FormSelection.AddBlockChannelSelection.create(),
									)
									.setDefaultChannels(guild.blockedChannels)
									.setValuesLength({ min: 0, max: 25 }).data,
								// @ts-ignore lol seyfert forgor to add the required boolean to select menus
								required: false,
							}),
						)
						.setLabel("Block Channels")
						.setDescription("Set all applicable blocked channels."),
				])
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.AddBlockChannelForm.create(),
				)
				.setTitle("Updating Guild"),
		);
	}
}
