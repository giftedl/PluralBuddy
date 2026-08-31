import { terminologyDefaults } from "plurography";
import {
	ComponentCommand,
	type ComponentContext,
	Label,
	Modal,
	TextDisplay,
	TextInput,
} from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";

export default class GeneralTab extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.TerminologyTab.EditCapitalTerms.equals(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.modal(
			new Modal()
				.setTitle((await ctx.userTranslations()).EDIT_TERMINOLOGY_LABEL)
				.setCustomId(
					InteractionIdentifier.Systems.Configuration.TerminologyTab.EditCapitalTermsForm.create(),
				)
				.setComponents([
					new Label()
						.setLabel("System")
						.setDescription((await ctx.userTranslations()).SYSTEM_DESCRIPTION)
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.TerminologyTab.System.create(),
								)
								.setRequired(true)
								.setValue(
									user.terminology?.system_capital ??
										terminologyDefaults.system_capital,
								)
								.setLength({ max: 15 })
								.setStyle(TextInputStyle.Short),
						),
					new Label()
						.setLabel("Alters")
						.setDescription((await ctx.userTranslations()).ALTER_DESCRIPTION)
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.TerminologyTab.Alter.create(),
								)
								.setRequired(true)
								.setValue(
									user.terminology?.alters_capital ??
										terminologyDefaults.alters_capital,
								)
								.setLength({ max: 15 })
								.setStyle(TextInputStyle.Short),
						),
					new Label()
						.setLabel("Tags")
						.setDescription((await ctx.userTranslations()).TAG_DESCRIPTION)
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.TerminologyTab.Tags.create(),
								)
								.setRequired(true)
								.setValue(
									user.terminology?.tags_capital ??
										terminologyDefaults.tags_capital,
								)
								.setLength({ max: 15 })
								.setStyle(TextInputStyle.Short),
						),
					new Label()
						.setLabel("Proxy Tags")
						.setDescription(
							(await ctx.userTranslations()).PROXY_TAG_DESCRIPTION,
						)
						.setComponent(
							new TextInput()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.TerminologyTab.ProxyTags.create(),
								)
								.setRequired(true)
								.setValue(
									user.terminology?.proxy_tags_capital ??
										terminologyDefaults.proxy_tags_capital,
								)
								.setLength({ max: 15 })
								.setStyle(TextInputStyle.Short),
						),
				]),
		);
	}
}
