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
      return await ctx.update({
        components: [...new PluralBuddyIntro(ctx.userTranslations()).pluralKitImportPage(ctx.interaction.id)]
      })
      
  }
}