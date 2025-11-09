/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from 'seyfert';
import { InteractionIdentifier } from '../../../lib/interaction-ids';
import { PluralBuddyIntro } from '../../../views/pluralbuddy-intro';
import { MessageFlags } from 'seyfert/lib/types';
import { createdSystems } from '../create-new-system';
 
export default class TagInteractionFormCNS extends ModalCommand {
  override filter(context: ModalContext) {
    return InteractionIdentifier.Setup.FormSelection.TagForm.startsWith(context.customId);
  }
 
  async run(ctx: ModalContext) {
    const rootInteractionId = InteractionIdentifier.Setup.FormSelection.TagForm.substring(ctx.customId)[0] ?? "";
    const temporarySystem = createdSystems.get(rootInteractionId);

    if (temporarySystem === undefined) {
        return ctx.write({ content: ctx.userTranslations().ERROR_INTERACTION_TOO_OLD, flags: MessageFlags.Ephemeral })
    }

    temporarySystem.systemDisplayTag = ctx.interaction.getInputValue(InteractionIdentifier.Setup.FormSelection.TagType.create(), true) as string;
    createdSystems.set(rootInteractionId, temporarySystem)
    
    return ctx.interaction.update({
        components: new PluralBuddyIntro(ctx.userTranslations())
          .createNewSystemPage(await ctx.retrievePGuild(), rootInteractionId, ctx.author.id),
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
} 