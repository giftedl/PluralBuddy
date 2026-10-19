/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import {
	ComponentCommand,
	type ComponentContext,
	FileUpload,
	Label,
	Modal,
	TextDisplay,
	TextInput,
} from "seyfert";
import {
	type APIFileUploadComponent,
	MessageFlags,
	TextInputStyle,
} from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";

export default class CreateNewAlterBtn extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterPagination.CreateNewAlter.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (user.system.alterIds.length >= 2000) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"TOO_MANY_ALTERS",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.modal(
			new Modal()
				.setCustomId(
					InteractionIdentifier.Systems.Configuration.FormSelection.Alters.CreateNewAlterForm.create(),
				)
				.setTitle((await ctx.userTranslations()).CREATE_NEW_ALTER_DESCRIPTION)
				.setComponents([
					new TextDisplay().setContent(
						(await ctx.userTranslations()).ALTER_INFORMATION,
					),
					new Label()
						.setLabel((await ctx.userTranslations()).ALTER_SET_USERNAME)
						.setDescription(
							(await ctx.userTranslations()).ALTER_SET_USERNAME_SPACES,
						)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(true)
								.setLength({ max: 20, min: 0 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create(),
								),
						),
					new Label()
						.setLabel(
							(await ctx.userTranslations()).ALTER_DISPLAY_NAME_FORM_LABEL,
						)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(true)
								.setLength({ max: 100, min: 0 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameType.create(),
								),
						),

					new Label()
						.setLabel((await ctx.userTranslations()).PT_CREATE_NEW)
						.setDescription(
							(await ctx.userTranslations()).ALTER_CREATE_PFP_DESC,
						)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(false)
								.setLength({ max: 100, min: 0 })
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.ProxyType.create(),
								),
						),
					new Label()
						.setLabel((await ctx.userTranslations()).ALTER_SET_PFP)
						.setDescription(
							(await ctx.userTranslations()).ALTER_CREATE_PFP_DESC,
						)
						.setComponent(
							new FileUpload({
								...new FileUpload()
									.setRequired(false)
									.setMaxValues(1)
									.setCustomId(
										InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPFPType.create(),
									).data,
								file_types: ["image"],
							} as APIFileUploadComponent),
						),
				]),
		);
	}
}
