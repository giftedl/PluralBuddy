/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	AttachmentBuilder,
	ComponentCommand,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "../../../../lib/interaction-ids";
import { PluralBuddyIntro } from "../../../../views/pluralbuddy-intro";

export default class PluralBuddyIntroNextPage extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.ImportSelection.SimplyPlural.equals(
			ctx.interaction.values[0] as string,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.deferUpdate();
		return await ctx.editResponse({
			components: [
				...new PluralBuddyIntro(
					ctx.userTranslations(),
				).simplyPluralImportPage(),
			],
			files: [1, 2, 3, 4, 5, 6, 7].map((v) =>
				new AttachmentBuilder()
					.setFile("path", `content/sp-${v}.png`)
					.setName(`sp-${v}.png`),
			),
		});
	}
}
