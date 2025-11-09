/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";

export default class PluralBuddyIntroNextPage extends ComponentCommand {
    componentType = 'StringSelect' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.ImportSelection.PluralKit.equals(ctx.interaction.values[0] as string);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
      return ctx.modal(
          new Modal()
              .setTitle(ctx.userTranslations().IMPORT_PLURALBUDDY_DESCRIPTION)
              .setCustomId(InteractionIdentifier.Setup.FormSelection.PkForm.create())
              .setComponents(
                  [
                      new Label()
                          .setLabel(ctx.userTranslations().PLURALBUDDY_IMPORT_SOURCE)
                          .setDescription(ctx.userTranslations().PLURALBUDDY_IMPORT_DESC)
                          .setComponent(
                              new TextInput()
                                  .setCustomId(InteractionIdentifier.Setup.FormSelection.PkType.create())
                                  .setStyle(TextInputStyle.Paragraph)
                          )
                  ]
              )
      )
  }
}