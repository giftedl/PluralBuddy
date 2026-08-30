/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	ComponentCommand,
	type ComponentContext,
	Label,
	Modal,
	ModalSubmitInteraction,
	TextInput,
} from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { terminologyTemplates } from "@/lib/terminology-templates";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";
import { createdSystems } from "../create-new-system";

export default class NameCNS extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.CreateNewSystem.Terminology.startsWith(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		const rootInteractionId =
			InteractionIdentifier.Setup.CreateNewSystem.Terminology.substring(
				ctx.customId,
			);
		const temporarySystem = createdSystems.get(rootInteractionId[0] as string);

		if (temporarySystem === undefined) {
			return ctx.write({
				content: (await ctx.userTranslations()).ERROR_INTERACTION_TOO_OLD,
				flags: MessageFlags.Ephemeral,
			});
		}

		const terminology = terminologyTemplates.find(
			(c) => c.name.toLocaleLowerCase() === ctx.interaction.data.values[0],
		);

		if (terminology) temporarySystem.terminology = terminology.data;
		createdSystems.set(rootInteractionId[0] as string, temporarySystem);

		// Defer update to keep the value in the select menu
		return ctx.interaction.deferUpdate()
	}
}
