import { App, createNodeMiddleware } from "octokit";
import { createServer } from "node:http";

const app = new App({
  appId: process.env.APP_ID ?? "",
  privateKey: process.env.PRIVATE_KEY ?? "",
  webhooks: { secret: process.env.WEBHOOK_SECRET ?? ""  },
  oauth: {
    clientSecret: process.env.CLIENT_SECRET ?? "",
    clientId: process.env.CLIENT_ID ?? ""
  }
});

app.webhooks.on("push", async ({ octokit, payload }) => {
  console.log("new push", payload)
  console.log("sha", payload.commits[0]?.id ?? "")

  const result = await octokit.rest.repos.createCommitStatus({
    owner: payload.repository.owner?.login ?? "",
    repo: payload.repository.name,
    sha: payload.head_commit?.id ?? "",
    state: "pending",
    description: "PluralBuddy waits 5 minutes to check the status of the bot.",
    operationName: "PluralBuddy Status Checker"

  })

  console.log(result)
})

createServer(createNodeMiddleware(app)).listen(3000);
