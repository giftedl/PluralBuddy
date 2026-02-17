import { Hono } from "hono";
import { buildNumber, client } from ".";
import { trimTrailingSlash } from "hono/trailing-slash";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import {
	alterCollection,
	mongoClient,
	tagCollection,
	userCollection,
} from "./mongodb";
import type { ImportStage } from "plurography";
import type { BaseResource } from "seyfert";
import { AlertView } from "./views/alert";
import { translations } from "./lang/en_us";
import { LoadingView } from "./views/loading";
import { MessageFlags } from "seyfert/lib/types";
import type { StatisticResource } from "./cache/statistics";
import { add, both, replace } from "./lib/importing/pluralkit";

const app = new Hono();

app.use("/api/*", async (ctx, next) => {
	if (ctx.req.header("X-PluralBuddy-Api-Key") !== process.env.API_KEY)
		return ctx.json({ error: "invalid key" }, { status: 400 });

	return await next();
});
app.use(trimTrailingSlash());

export const clientRoutes = app
	.get("/api/stats", ({ req, json }) => {
		return json(
			(
				(client.cache as unknown as { statistic: BaseResource })
					.statistic as unknown as StatisticResource
			).get("latest"),
		);
	})
	.post(
		"/api/import-staging-reminder",
		zValidator("json", z.object({ importStageId: z.string() })),
		async ({ req, json }) => {
			const { importStageId } = req.valid("json");

			const appDb = mongoClient.db(process.env.WEBSITE_DB ?? ".");
			const importStageCollection =
				appDb.collection<ImportStage>("import-staging");
			const importStage = await importStageCollection.findOne({
				"webhook.id": importStageId,
			});

			if (!importStage)
				return json(
					{ error: "No such import stage instance." },
					{ status: 400 },
				);
			if (importStage.response === null)
				return json(
					{ error: "Provided import stage hasn't been responded to yet." },
					{ status: 400 },
				);

			client.interactions
				.editOriginal(importStage.webhook.token, {
					components: new LoadingView(translations).loadingViewLongTerm(),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				})
				.then(async (message) => {
					if (importStage.response === null) return;

					const system = await userCollection.findOne({
						userId: importStage.originatingSystemId,
					});
					const alters = await alterCollection
						.find({ systemId: system?.userId })
						.toArray();
					const tags = await tagCollection
						.find({ systemId: system?.userId })
						.toArray();
					let response = null;

					if (
						importStage.response.dataType === "PluralKit" &&
						importStage.importMode === "replace"
					) {
						response = await replace({
							existing: {
								alters,
								tags,
								userId: importStage.originatingSystemId,
							},
							pk: JSON.parse(importStage.response?.data ?? ""),
						});
					}

					if (
						importStage.response.dataType === "PluralKit" &&
						importStage.importMode === "add"
					) {
						response = await add({
							existing: {
								alters,
								tags,
								userId: importStage.originatingSystemId,
							},
							pk: JSON.parse(importStage.response?.data ?? ""),
						});
					}

					if (
						importStage.response.dataType === "PluralKit" &&
						importStage.importMode === "full-mode"
					) {
						response = await both({
							existing: {
								alters,
								tags,
								userId: importStage.originatingSystemId,
							},
							pk: JSON.parse(importStage.response?.data ?? ""),
						});
					}

					client.interactions.editOriginal(importStage.webhook.token, {
						components: new AlertView(translations).successViewCustom(
							translations.SYSTEM_ADVANCED_IMPORT.replace(
								"{{ alter-count }}",
								String(response?.affected.alters ?? 0),
							).replace(
								"{{ tag-count }}",
								String(response?.affected.tags ?? 0),
							),
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					});
				});

			return json({ done: "Handed back off to the user." });
		},
	)
	.get("/api/health", (c) =>
		c.json({
			about: `PluralBuddy b${buildNumber}`,
			routes: app.routes
				.filter((v) => !v.path.endsWith("*"))
				.map((v) => v.path),
		}),
	);

export default {
	port: 3030,
	fetch: app.fetch,
};
