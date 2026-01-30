import {
	ActionRow,
	Button,
	ComponentCommand,
	Container,
	StringSelectMenu,
	StringSelectOption,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { helpPages } from "@/commands/help";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { generateCommandList } from "@/lib/command-list";

export default class HelpPageButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Help.Page.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const id = InteractionIdentifier.Help.Page.substring(ctx.customId)[0];
		const currentPageIndex = helpPages.findIndex((c) => c.id === id);

		if (currentPageIndex === -1) throw new Error("no content?");

		const currentPage = helpPages[currentPageIndex];
		const contents = await Bun.file(`content/${currentPage?.file}`).text();

		return await ctx.update({
			components: [
				new Container()
					.setComponents(
						new TextDisplay().setContent(
							contents
								.replaceAll("{{ prefix }}", await ctx.getDefaultPrefix() ?? "pb;")
								.replaceAll("{{ command_list_1 }}", generateCommandList(1))
								.replaceAll("{{ command_list_2 }}", generateCommandList(2)),
						),
					)
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
								InteractionIdentifier.Help.Page.create(
									helpPages[currentPageIndex - 1]
										? (helpPages[currentPageIndex - 1]?.id ?? "")
										: "",
								),
							)
							.setDisabled(helpPages[currentPageIndex - 1] === undefined)
							.setLabel("Previous Page")
							.setStyle(ButtonStyle.Primary),
						new Button()
							.setCustomId(
								InteractionIdentifier.Help.Page.create(
									helpPages[currentPageIndex + 1]
										? (helpPages[currentPageIndex + 1]?.id ?? "")
										: "",
								),
							)
							.setDisabled(helpPages[currentPageIndex + 1] === undefined)
							.setLabel("Next Page")
							.setStyle(ButtonStyle.Primary),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
