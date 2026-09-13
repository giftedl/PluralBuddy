import {
	PImportTranscript,
	PluralKitAPISystem,
	PluralKitGroup,
	PluralKitMember,
} from "plurography";
import { ComponentCommand, ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { z } from "zod";
import { build } from "@/index";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { pk } from "@/lib/pk-api";
import { runSandboxActions } from "@/lib/pk-sync-engine";
import { decryptToken } from "@/lib/pk-token-encryption";
import { alterCollection, tagCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { QuickSyncStatus, SystemSettingsView } from "@/views/system-settings";

export default class QuickSync extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.SyncPreferences.QuickSync.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		let { system: systemPB, syncConfiguration } = await ctx.retrievePUser();

		if (systemPB === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const token =
			syncConfiguration?.pluralkit?.token === undefined
				? null
				: await decryptToken(
						syncConfiguration.pluralkit.token.i,
						syncConfiguration.pluralkit.token.v,
					);

		if (!token) return await ctx.deferUpdate();

		await ctx.interaction.update({
			components: [
				...new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(systemPB)?.preferAccessiblity,
				).syncSettings(await ctx.retrievePUser(), QuickSyncStatus.Loading),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const system = await pk(token).systemsCollection.findOne({ userId: "@me" });
		const members = await pk(token).membersCollection.find({ userId: "@me" });
		const groups = await pk(token).groupsCollection.find({ userId: "@me" });

		const alters = await alterCollection
			.find({ systemId: ctx.author.id })
			.toArray();
		const tags = await tagCollection
			.find({ systemId: ctx.author.id })
			.toArray();

		const transcript = runSandboxActions({
			pluralbuddy: { alters, tags, system: systemPB },
			authorId: ctx.author.id,
			pluralkit: {
				members: members,
				system: system,
				groups: groups,
			},
		});

		if (transcript.alters.add.length > 0)
			await alterCollection.insertMany(transcript.alters.add);

		await Promise.all(
			transcript.alters.update.map(async (element) => {
				await alterCollection.replaceOne(
					{ alterId: element.alterId, systemId: element.systemId },
					element,
				);
			}),
		);

		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{ $set: { "syncConfiguration.pluralkit.lastSynced": new Date() } },
		);

		return await ctx.interaction.editResponse({
			components: [
				...(await new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(systemPB)?.preferAccessiblity,
				).syncSettings(await ctx.retrievePUser(), QuickSyncStatus.Done)),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
