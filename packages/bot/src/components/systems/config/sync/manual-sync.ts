import { Checkbox, ComponentCommand, ComponentContext, Label, Modal, TextDisplay, TextInput } from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";

export default class ManualSyncButton extends ComponentCommand {
   componentType = 'Button' as const;
   
    override filter(context: ComponentContext<typeof this.componentType>) {
       return InteractionIdentifier.Systems.Configuration.SyncPreferences.SyncManually.equals(context.customId)
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const form = new Modal()
			.setCustomId(
				InteractionIdentifier.Systems.Configuration.SyncPreferences.SyncManuallyForm.create(),
			)
			.setTitle((await ctx.userTranslations()).SYNCING_MANUALLY_TITLE)
			.addComponents([
				new Label()
					.setLabel((await ctx.userTranslations()).TOKEN_INPUT)
					.setDescription((await ctx.userTranslations()).TOKEN_DESC)
					.setComponent(
						new TextInput()
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SyncPreferences.PluralKitToken.create(),
							)
                            .setLength({ max: 64, min: 64 })
							.setStyle(TextInputStyle.Short)
							.setRequired(true),
					),
				new Label()
					.setLabel((await ctx.userTranslations()).STORE_TOKEN_INPUT)
					.setDescription((await ctx.userTranslations()).STORE_TOKEN_INPUT_DESC)
					.setComponent(
						new Checkbox().setCustomId(
							InteractionIdentifier.Systems.Configuration.SyncPreferences.StoreToken.create(),
						),
					),
				new TextDisplay().setContent(
					(await ctx.userTranslations()).STORE_TOKEN_INPUT_DESC_2,
				),
			]);
		return await ctx.modal(form);
    }
}