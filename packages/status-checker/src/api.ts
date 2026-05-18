import { App, createNodeMiddleware } from "octokit";
import { createServer } from "node:http";
import type { components } from "@octokit/openapi-types";
import { resolveStatusAlert } from ".";

export const queuedCommits: {
	timer: NodeJS.Timeout;
	commit: components["schemas"]["webhook-push"]["head_commit"];
	repository: components["schemas"]["webhook-push"]["repository"];
}[] = [];

export const app = new App({
	appId: process.env.APP_ID ?? "",
	privateKey: process.env.PRIVATE_KEY ?? "",
	webhooks: { secret: process.env.WEBHOOK_SECRET ?? "" },
	oauth: {
		clientSecret: process.env.CLIENT_SECRET ?? "",
		clientId: process.env.CLIENT_ID ?? "",
	},
});

app.webhooks.on("push", async ({ octokit, payload }) => {
	console.log("new push", payload);
	console.log("sha", payload.commits[0]?.id ?? "");

	if (!payload.head_commit) return;

	const result = await octokit.rest.repos.createCommitStatus({
		owner: payload.repository.owner?.login ?? "",
		repo: payload.repository.name,
		sha: payload.head_commit?.id ?? "",
		state: "pending",
		description: "PluralBuddy waits 6 minutes to check the status of the bot.",
		operationName: "PluralBuddy Status Checker",
		context: "Status",
	});

	const sixMinutes = 1 * 60 * 1000;

	queuedCommits.push({
		timer: setTimeout(
			() =>
				resolveStatusAlert({
					repository: payload.repository,
					commit: payload.head_commit,
					octokit
				}),
			sixMinutes,
		),
		commit: payload.head_commit,
		repository: payload.repository,
	});

	console.log(result);
});

export function startWebhookListener() {
	createServer(createNodeMiddleware(app)).listen(3000);
}
