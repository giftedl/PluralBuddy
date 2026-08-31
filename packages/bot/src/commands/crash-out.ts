import {
	AttachmentBuilder,
	Command,
	CommandContext,
	Container,
	Declare,
	MediaGallery,
	MediaGalleryItem,
        TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";

@Declare({
	name: "crash-out",
	description: "(VOLUME WARNING) I'M GONNA CRASH THE FORK OUT!!!",
})
export default class WhoAskedCommand extends Command {
	override async run(ctx: CommandContext) {
		const roles = await ctx.member?.roles?.list();
		if (
			ctx.guildId === "1077258761443483708" &&
			!roles?.some((v) => v.id === "1080157688752767046")
		) {
			return ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"UNABLE_TO_BE_FUNNY",
				),
				flags: MessageFlags.IsComponentsV2,
			});
		}

		await ctx.deferReply();
		return ctx.editResponse({
			components: [
				new Container().setComponents(
                                        new TextDisplay().setContent("-# (VOLUME WARNING) I'M GONNA CRASH THE FORK OUT!!!"),
					new MediaGallery().setItems(
						new MediaGalleryItem()
							.setMedia("attachment://crash_out.mov")
                                                        .setSpoiler(true)
							.setDescription(
								"(VOLUME WARNING) I'M GONNA CRASH THE FORK OUT!!!",
							),
					),
				),
			],
			files: [
				new AttachmentBuilder()
					.setName("crash_out.mov")
					.setFile("path", "content/easter-eggs/crash_out.mov"),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] },
		});
	}
}
