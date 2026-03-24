import { AlertView } from "@/views/alert";
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
	guildId: process.env.BRANCH === "canary" ? [] : ["1077258761443483708", "1444187699924963350", "1424933876723224640"],
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
   allowed_mentions: { replied_user: false }
		});
	}
}
