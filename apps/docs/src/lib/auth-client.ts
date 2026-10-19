import { sentinelClient } from "@better-auth/infra/client";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { oidcClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		oauthProviderClient(),
		sentinelClient({
			identifyUrl: process.env.BETTER_AUTH_IDENTIFY_URL,
		}),
	],
});
