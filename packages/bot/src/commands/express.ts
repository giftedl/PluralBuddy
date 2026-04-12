import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	Button,
	Command,
	CommandContext,
	Container,
	createStringOption,
	Declare,
	Options,
	Section,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

const options = {
	alter: createStringOption({
		description: "The name of the alter.",
		required: true,
		autocomplete: autocompleteAlters,
	}),
};

@Declare({
	name: "express",
	description: "Create a self-proxy from an alter.",
	aliases: ["exp"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class ExpressCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { alter: alterName } = ctx.options;

		const systemId = ctx.author.id;

		const alter =
			ctx.contextAlter() ??
			(await (Number.isNaN(Number.parseInt(alterName))
				? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
				: alterCollection.findOne({
						$or: [{ username: alterName }, { alterId: Number(alterName) }],
						systemId,
					})));

		if (alter === null) {
			return await ctx.ephemeral(
				{
					components: new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_ALTER_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		return await ctx.ephemeral(
			{
				components: [
					new Container().setComponents(
						new Section()
							.setComponents(
								new TextDisplay().setContent(
									(await ctx.userTranslations()).EXPRESS_HERO,
								),
							)
							.setAccessory(
								new Button()
									.setStyle(ButtonStyle.Link)
									.setLabel((await ctx.userTranslations()).VIEW_DASH)
									.setURL(
										`${process.env.APP_HOST}/app/settings/express?alter=${alter.alterId}`,
									),
							),
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			undefined,
			undefined,
			ctx,
		);
	}
}
