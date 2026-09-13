import {
	PImportTranscript,
	PluralKitAPISystem,
	PluralKitGroup,
	PluralKitMember,
} from "plurography";
import {
	ActionRow,
	Button,
	Container,
	ModalCommand,
	ModalContext,
	Separator,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import type { z } from "zod";
import { build } from "@/index";
import { emojis } from "@/lib/emojis";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { hexToBuffer } from "@/lib/hex-buffer-operation";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { runSandboxActions } from "@/lib/pk-sync-engine";
import {
	alterCollection,
	importTranscriptCollection,
	tagCollection,
	userCollection,
} from "@/mongodb";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { SystemSettingsView } from "@/views/system-settings";

const API_PREFIX = "https://api.pluralkit.me/v2";

export default class SetPronounsButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.SyncPreferences.AutoSyncForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		let user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		let [enabled, destructive] = [
			ctx.interaction.getInputValue(
				InteractionIdentifier.Systems.Configuration.SyncPreferences.EnableAutoSync.create(),
			) ?? false,
			ctx.interaction.getCheckbox(
				InteractionIdentifier.Systems.Configuration.SyncPreferences.DestructiveSync.create(),
			) ?? false,
		];

		if (!enabled)
			destructive = false;

		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{
				$set: {
					"syncConfiguration.pluralkit.automatic.enabled": enabled,
					"syncConfiguration.pluralkit.automatic.destructive": destructive,
				},
			},
		);

		return await ctx.interaction.update({
			components: [
				...(await new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(user.system)?.preferAccessiblity,
				).syncSettings(user)),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
