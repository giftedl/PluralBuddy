import { ImportNotation, possibleConverters } from "plurography";
import {
	AttachmentBuilder,
	ComponentCommand,
	type ComponentContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type z from "zod";
import { buildExportPayload, buildPkExportPayload } from "@/lib/export";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";

export default class PluralKitExternalExporting extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.ExternalExporting.Selector.equals(
			ctx.customId
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.write({
			components: new LoadingView(await ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const exportPayload = JSON.parse( await buildExportPayload(user.system) ) as z.infer<typeof ImportNotation>;
		const converter = possibleConverters[ctx.interaction.data.values[0] ?? "pluralkit"]
		
		if (!converter)
			throw new Error("couldn't find that converter.")
		
		const converterObj = new converter.converter();

		await ctx.followup({
			files: [
				new AttachmentBuilder()
					.setName("system.json")
					.setFile(
						"buffer",
						Buffer.from(JSON.stringify(converterObj.fromImport(exportPayload))),
					),
			],
			flags: MessageFlags.Ephemeral,
		});

		return await ctx.editResponse({
			components: new AlertView(await ctx.userTranslations()).successView(
				"SYSTEM_EXPORT_FINISHED",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
