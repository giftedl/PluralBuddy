import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v9";
import type { ClientType } from "bot";
import { hc } from "hono/client";
import { app, startWebhookListener } from "./api";
import { checkIfBotIsOn, client, startDiscordBot } from "./discord";
import type { components } from "@octokit/openapi-types";
import type { Octokit } from "octokit";
import { MessageFlags } from "seyfert/lib/types";
import { Container, Separator, TextDisplay } from "seyfert";

const statusUrl = "https://aaaaaa.com";

export const { api } = hc<ClientType>(statusUrl, {
	headers: {
		"X-PluralBuddy-Api-Key": process.env.BACKEND_TOKEN ?? ".",
	},
});

async function executeStatusEndpoint() {
	return await api.health.$get();
}

await startWebhookListener();
await startDiscordBot();

export async function resolveStatusAlert({
	repository,
	commit,
	octokit,
}: {
	repository: components["schemas"]["webhook-push"]["repository"];
	commit: components["schemas"]["webhook-push"]["head_commit"];
	octokit: Octokit;
}) {
	const result = await Promise.race([
		executeStatusEndpoint().then((v) => v.json),
		new Promise((_, r) => {
			setTimeout(() => {
				r("timed out");
			}, 6 * 1000);
		}),
	]).catch((r) => ({ error: r }));

	console.log(result);

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

		await client.messages.write(process.env.NOTIFICATION_CHANNEL ?? "", {
			components: [
				new TextDisplay().setContent(`<@&${process.env.NOTIFICATION_ROLE}>`),
				new Container()
					.setColor("#FF6961")
					.setComponents(
						new TextDisplay().setContent(
							"## Bot may be currently unresponsive",
						),
						new TextDisplay().setContent(
							`The status checker has detected after the following (head) commit that the bot is no longer responsive:`,
						),
						new TextDisplay().setContent(
							`[\`\`${commit?.id}\`\`](${commit?.url}) ${commit?.message} - ${commit?.committer.name}`,
						),
						new Separator(),
						new TextDisplay().setContent(`## How should this be resolved?`),
						new TextDisplay().setContent(
							`1. **Check if the bot is online still.** If the bot is online, this is a good sign.`,
						),
						new TextDisplay().setContent(
							`2. **Check if the bot is still responsive to commands.** If the bot is not responsive to commands, this may mean it's stuck somewhere.`,
						),
						new TextDisplay().setContent(`3. **Create a status notification.** If the bot is not online and/or isn't responsive to commands, create a status notification with the template below.`)
					),
			],
			flags: MessageFlags.IsComponentsV2,
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
