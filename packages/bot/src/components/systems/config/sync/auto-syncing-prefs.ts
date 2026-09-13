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
		return InteractionIdentifier.Systems.Configuration.SyncPreferences.ToggleAutoSync.equals(
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
				InteractionIdentifier.Systems.Configuration.SyncPreferences.AutoSyncForm.create(),
			)
			.setTitle((await ctx.userTranslations()).SYNCING_AUTOMATICALLY_TITLE)
			.addComponents([
				new Label()
					.setLabel((await ctx.userTranslations()).ENABLE_AUTO_SWITCH)

					.setComponent(
						new Checkbox()
							.setDefault(
								syncConfiguration?.pluralkit?.automatic?.enabled ?? false,
							)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SyncPreferences.EnableAutoSync.create(),
							),
					),
				new Label()

					.setLabel((await ctx.userTranslations()).DESTRUCTIVE_SWITCH)
					.setDescription(
						(await ctx.userTranslations()).DESTRUCTIVE_SWITCH_DESC,
					)
					.setComponent(
						new Checkbox()
							.setDefault(
								syncConfiguration?.pluralkit?.automatic?.destructive ?? false,
							)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SyncPreferences.DestructiveSync.create(),
							),
					),
			]);
		return await ctx.modal(form);
	}
}
