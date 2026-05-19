import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v9";
import type { ClientType } from "bot";
import { hc } from "hono/client";
import { app, startWebhookListener } from "./api";
import { startDiscordBot } from "./discord";
import type { components } from "@octokit/openapi-types";
import type { Octokit } from "octokit";

const statusUrl = "https://aaa.com";

export const { api } = hc<ClientType>(statusUrl, {
	headers: {
		"X-PluralBuddy-Api-Key": process.env.BACKEND_TOKEN ?? ".",
	},
});

async function executeStatusEndpoint() {
	return await api.health.$get();
}

startWebhookListener();
startDiscordBot();

export async function resolveStatusAlert({
	repository,
	commit,
	octokit
}: {
	repository: components["schemas"]["webhook-push"]["repository"];
	commit: components["schemas"]["webhook-push"]["head_commit"];
	octokit: Octokit
}) {
	const result = await (Promise.race([
		async () => await executeStatusEndpoint(),
		new Promise((_, r) => {
			setTimeout(() => {
				r("timed out");
			}, 6 * 1000);
		}),
	]).catch((r) => ({ error: r })));

	console.log(result)

	if ("error" in (result as any)) {
		console.log("panic", Date.now());

		const commitStatus = await octokit.rest.repos.createCommitStatus({
			owner: repository.owner?.login ?? "",
			repo: repository.name,
			sha: commit?.id ?? "",
			state: "failure",
			description: `PluralBuddy panicked after checking status for reason: ${(result as any).error}`,
			operationName: "PluralBuddy Status Checker",
			context: "Status",
		});
	} else
		await octokit.rest.repos.createCommitStatus({
			owner: repository.owner?.login ?? "",
			repo: repository.name,
			sha: commit?.id ?? "",
			state: "success",
			description: `Successfully checked status!`,
			operationName: "PluralBuddy Status Checker",
			context: "Status",
		});
}
