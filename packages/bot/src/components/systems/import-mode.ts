import { InteractionIdentifier } from "@/lib/interaction-ids";
import { mongoClient } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { type ImportStage, ImportStageObject } from "plurography";
import {
	Button,
	ComponentCommand,
	Container,
	Section,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

export default class ImportMode extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.ImportMode.equals(ctx.customId);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		const mode = ctx.interaction.values[0] as "replace" | "add" | "full-mode";
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.update({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const appDb = mongoClient.db(process.env.WEBSITE_DB ?? ".");
		const importStageCollection =
			appDb.collection<ImportStage>("import-staging");

		await importStageCollection.insertOne({
			webhook: {
				id: ctx.interaction.id,
				token: ctx.interaction.token,
			},
			originatingSystemId: user.userId,
			createdAt: new Date(),
			response: null,
			importMode: mode,
		});

		return await ctx.update({
			components: [
				new Container().setComponents(
					new Section()
						.setComponents(
							new TextDisplay().setContent(
								"In order to submit your import data from another bot, you must put it into the PluralBuddy dashboard.",
							),
						)
						.setAccessory(
							new Button()
								.setURL(
									`${process.env.APP_HOST}/app/import-staging?id=${ctx.interaction.id}`,
								)
								.setStyle(ButtonStyle.Link)
								.setLabel("View on Dashboard"),
						),
					new TextDisplay().setContent("-# Waiting for response..."),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
