import {
	AttachmentBuilder,
	Command,
	CommandContext,
	Container,
	createBooleanOption,
	Declare,
	MediaGallery,
	MediaGalleryItem,
	Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { easterEggPlaybackIds, muxPlaybackURL } from "@/lib/easter-eggs";
import { AlertView } from "@/views/alert";

const options = {
	"time-machine": createBooleanOption({
		description: "Bleh",
		required: false,
		flag: true
	})
}

@Declare({
	name: "fwf",
	description: "Flat worm Friday in Wall Street",
	contexts: ["Guild", "BotDM", "PrivateChannel"],
	integrationTypes: ["GuildInstall", "UserInstall"],
})
@Options(options)
export default class WhoAskedCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		const roles = await ctx.member?.roles?.list();
		const date = new Date().toLocaleDateString("en-US", {
			timeZone: "America/New_York",
			weekday: "long",
		});

		if (date !== "Friday" && ctx.options["time-machine"] !== true) {
			return ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"NOT_FRIDAY",
				),
				flags: MessageFlags.IsComponentsV2,
			});
		}
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
					new MediaGallery().setItems(
						new MediaGalleryItem()
							.setMedia(muxPlaybackURL(easterEggPlaybackIds.fwf))
							.setDescription("flatworm friday :)"),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] },
		});
	}
}
