import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import {
	ActionRow,
	Button,
	Command,
	CommandContext,
	Container,
	Declare,
	Message,
	StringSelectMenu,
	StringSelectOption,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

export const helpPages = [
	{
		name: "What is PluralBuddy?",
		id: "01",
		file: "help-page-01.md",
	},
    {
        name: "Get Started",
        id: "02",
        file: "help-page-02.md"
    },
	{
		name: "Command List #1",
		id: "03",
		file: "help-page-03.md"
	},
	{
		name: "Command List #2",
		id: "04",
		file: "help-page-04.md"
	},

];

@Declare({
	name: "help",
	description: "Get help regarding PluralBuddy.",
})
export default class PluralBuddyHelpCommand extends Command {
	override async run(ctx: CommandContext) {
		const guild = await ctx.retrievePGuild();

		if (guild.getFeatures().disabledHelp) {
			if (ctx.isChat() && ctx.message) {
				(ctx.message as Message).delete();

				await (ctx.message as Message).author.write({
					components: new AlertView(ctx.userTranslations()).errorView(
						"FEATURE_DISABLED_GUILD",
					),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
				return;
			}

			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"FEATURE_DISABLED_GUILD",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const currentPage = helpPages[0];
		const contents = await Bun.file(`content/${currentPage?.file}`).text();

		return await ctx.write({
			components: [
				new Container()
					.setComponents(new TextDisplay().setContent(contents))
					.setColor("#FCCEE8"),
				new Container().setComponents(
					new ActionRow().setComponents(
						new StringSelectMenu()
							.setCustomId(InteractionIdentifier.Help.Menu.create())
							.setOptions(
								helpPages.map((c) =>
									new StringSelectOption()
										.setValue(c.id)
										.setLabel(c.name)
										.setDescription(c.id)
										.setDefault(c.id === currentPage?.id),
								),
							),
					),
					new ActionRow().setComponents(
						new Button()
							.setCustomId(
								"disabled"
							)
							.setDisabled(true)
							.setLabel("Previous Page")
							.setStyle(ButtonStyle.Primary),
						new Button()
							.setCustomId(
								InteractionIdentifier.Help.Page.create(
									helpPages[1] ? helpPages[1].id : "",
								),
							)
							.setDisabled(helpPages[1] === undefined)
							.setLabel("Next Page")
							.setStyle(ButtonStyle.Primary),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
