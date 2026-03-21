import {
	AttachmentBuilder,
	Command,
	CommandContext,
	Container,
	Declare,
	MediaGallery,
	MediaGalleryItem,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "who-knows",
	description: "Who knows!",
	guildId: process.env.BRANCH === "canary" ? [] : ["1077258761443483708", "1444187699924963350"],
})
export default class WhoAskedCommand extends Command {
	override async run(ctx: CommandContext) {
        await ctx.deferReply();
		return ctx.write({
			components: [
				new Container().setComponents(
					new MediaGallery().setItems(
						new MediaGalleryItem()
							.setMedia("attachment://who_knows_v3.mov")
							.setDescription("Who knows!"),
					),
				),
			],
			files: [
				new AttachmentBuilder()
					.setName("who_knows_v3.mov")
					.setFile("path", "content/easter-eggs/who_knows_v3.mov"),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
