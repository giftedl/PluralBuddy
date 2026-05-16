import { App } from "octokit";

const app = new App({
  appId,
  privateKey,
  webhooks: { secret },
});

