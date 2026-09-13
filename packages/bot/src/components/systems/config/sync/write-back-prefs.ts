import {
	Checkbox,
	ComponentCommand,
	ComponentContext,
	Label,
	Modal,
	TextDisplay,
	TextInput,
} from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { decryptToken } from "@/lib/pk-token-encryption";
import { AlertView } from "@/views/alert";

export default class ManualSyncButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.SyncPreferences.ToggleWriteback.equals(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system, syncConfiguration } = await ctx.retrievePUser();

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
				InteractionIdentifier.Systems.Configuration.SyncPreferences.WriteBackForm.create(),
			)
			.setTitle((await ctx.userTranslations()).WRITE_BACK_TITLE)
			.addComponents([
				new Label()
					.setLabel((await ctx.userTranslations()).ENABLE_WRITE_BACK_SWITCH)
					.setComponent(
						new Checkbox()
							.setDefault(
								syncConfiguration?.pluralkit?.writeBack?.enabled ?? false,
							)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SyncPreferences.EnableWriteBackSync.create(),
							),
					),
			]);
		return await ctx.modal(form);
	}
}
