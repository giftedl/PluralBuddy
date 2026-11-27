import { AlterFlags } from "plurography";
import {
	ActionRow,
	Button,
	ComponentCommand,
	type ComponentContext,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { getAlterFeatures } from "@/lib/get-alter-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { SystemSettingsView } from "@/views/system-settings";
import { w } from "@/webhooks";
import { writeBack } from "@/lib/pk-sync-engine.ts";

export default class DeleteAlterButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Alters.ToggleKeepProxyTags.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.Alters.ToggleKeepProxyTags.substring(
				ctx.customId,
			)[0];

		const systemId = await ctx.systemId();
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		const alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await alterCollection.updateOne(
			{ alterId: alter.alterId },
			{
				$set: {
					flags: getAlterFeatures(alter).keepProxyTags
						? getAlterFeatures(alter).disable(AlterFlags.PROXY_TAGS_KEPT)
						: getAlterFeatures(alter).enable(AlterFlags.PROXY_TAGS_KEPT),
				},
			},
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				flags: getAlterFeatures(alter).keepProxyTags
					? getAlterFeatures(alter).disable(AlterFlags.PROXY_TAGS_KEPT)
					: getAlterFeatures(alter).enable(AlterFlags.PROXY_TAGS_KEPT),
			},
		});

		if (alter.fields["@/converter/pk"])
			writeBack({
				type: "alter",
				id: alter.fields["@/converter/pk"],
				change: {
					flags: getAlterFeatures(alter).keepProxyTags
						? getAlterFeatures(alter).disable(AlterFlags.PROXY_TAGS_KEPT)
						: getAlterFeatures(alter).enable(AlterFlags.PROXY_TAGS_KEPT),
				},
				syncConfig: (await ctx.retrievePUser()).syncConfiguration,
			});

		return await ctx.update({
			components: [
				...new AlterView(await ctx.userTranslations()).alterTopView(
					"general",
					alter.alterId.toString(),
					alter.username,
				),
				...(await new AlterView(await ctx.userTranslations()).alterGeneralView(
					{
						...alter,
						flags: getAlterFeatures(alter).keepProxyTags
							? getAlterFeatures(alter).disable(AlterFlags.PROXY_TAGS_KEPT)
							: getAlterFeatures(alter).enable(AlterFlags.PROXY_TAGS_KEPT),
					},
					ctx.guildId,
				)),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
