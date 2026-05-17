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

app.webhooks.on("push", ({ octokit, payload }) => {
  console.log("new push", payload)
  console.log("sha", payload.commits[0]?.id ?? "")

  octokit.rest.repos.createCommitStatus({
    owner: payload.repository.owner?.login ?? "",
    repo: payload.repository.name,
    sha: payload.commits[0]?.id ?? "",
    state: "pending",
    description: "PluralBuddy Status Checker (2 minute-check)"

  })
})

createServer(createNodeMiddleware(app)).listen(3000);
