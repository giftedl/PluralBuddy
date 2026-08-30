/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { PTerminology } from "plurography";
import { CheckboxGroup, CheckboxGroupOption, ComponentCommand, type ComponentContext, Label, Modal, TextDisplay } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import type { PSystem } from "../../types/system";
import { PluralBuddyIntro } from "../../views/pluralbuddy-intro";

export const createdSystems: Map<string, Partial<(PSystem & { terminology: PTerminology })>> = new Map();

export default class PluralBuddyIntroNextPage extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.CreateNewSystem.Index.equals(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		return ctx.update({
			components: new PluralBuddyIntro(
				await ctx.userTranslations(),
			).createNewSystemPage(
				await ctx.retrievePGuild(),
				ctx.interaction.id,
				ctx.author.id,
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
