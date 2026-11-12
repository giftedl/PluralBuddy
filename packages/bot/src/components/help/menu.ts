import {
  ActionRow,
  Button,
  ComponentCommand,
  type ComponentContext,
  Container,
  StringSelectMenu,
  StringSelectOption,
  TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { helpPages } from "@/commands/help";
import { generateCommandList } from "@/lib/command-list";
import { InteractionIdentifier } from "@/lib/interaction-ids";

export default class HelpPageSelect extends ComponentCommand {
  componentType = "StringSelect" as const;

  override filter(context: ComponentContext<typeof this.componentType>) {
    return InteractionIdentifier.Help.Menu.startsWith(context.customId);
  }

  override async run(ctx: ComponentContext<typeof this.componentType>) {
    const id = ctx.interaction.values[0];
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
                .replaceAll("{{ prefix }}", (await ctx.getDefaultPrefix()) ?? "pb;")
                .replaceAll("{{ command_list_2 }}", generateCommandList(2))
                .replaceAll("{{ command_list_1 }}", generateCommandList(1)),
            ),
          )
          .setColor("#FCCEE8"),
        new Container().setComponents(
          new ActionRow().setComponents(
            new StringSelectMenu().setCustomId(InteractionIdentifier.Help.Menu.create()).setOptions(
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
