/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, type ComponentContext } from "seyfert";
import { PluralBuddyIntro } from "../../views/pluralbuddy-intro";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "../../lib/interaction-ids";

export default class PluralBuddyIntroNextPage extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        //we are checking if the customId of the interaction is the same that the one set in my button
     
        return InteractionIdentifier.Setup.Pagination.Page1.equals(ctx.customId);
      }


    async run(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.update({
            components: new PluralBuddyIntro(ctx.userTranslations()).pageOne(),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral ,
        });
      }
}