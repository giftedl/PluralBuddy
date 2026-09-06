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
import { easterEggPlaybackIds, muxPlaybackURL } from "@/lib/easter-eggs";
import { AlertView } from "@/views/alert";

@Declare({
	name: "who-knows",
	description: "Who knows!",
})
export default class WhoAskedCommand extends Command {
	override async run(ctx: CommandContext) {
		const roles = await ctx.member?.roles?.list()
		if (ctx.guildId === "1077258761443483708" && !roles?.some(v => v.id === "1080157688752767046")) {
			return ctx.write({
				components: new AlertView((await ctx.userTranslations())).errorView("UNABLE_TO_BE_FUNNY"),
				flags: MessageFlags.IsComponentsV2
			})
		}

        await ctx.deferReply();
		return ctx.editResponse({
			components: [
				new Container().setComponents(
					new MediaGallery().setItems(
						new MediaGalleryItem()
							.setMedia(muxPlaybackURL(easterEggPlaybackIds["who-knows"]))
							.setDescription("Who knows!"),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { replied_user: false },
		});
	}
}
