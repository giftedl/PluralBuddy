/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	CheckboxGroup,
	CheckboxGroupOption,
	ComponentCommand,
	Container,
	Label,
	Modal,
	Separator,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { policyModal } from "@/policyModal";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";

export default class PluralBuddyIntroNextPage extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.Pagination.Page2.equals(ctx.customId);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.policyStatus !== 1) {
			return ctx.modal(
				await policyModal(
					ctx,
					InteractionIdentifier.Setup.Pagination.Page2.create(),
				),
			);
		}

		return ctx.interaction.update({
			components: new PluralBuddyIntro(await ctx.userTranslations()).pageTwo(
				(await ctx.getDefaultPrefix()) ?? "pb;",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
