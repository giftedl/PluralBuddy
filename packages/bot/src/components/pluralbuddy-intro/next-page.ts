/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, ComponentCommand, Container, Separator, TextDisplay, type ComponentContext } from 'seyfert';
import { ButtonStyle, MessageFlags } from 'seyfert/lib/types';
import { PluralBuddyIntro } from '../../views/pluralbuddy-intro';
import { InteractionIdentifier } from '../../lib/interaction-ids';
 
export default class PluralBuddyIntroNextPage extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.Pagination.Page2.equals(ctx.customId);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.update({
            components: new PluralBuddyIntro(ctx.userTranslations()).pageTwo(),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral ,
        });
      }
}