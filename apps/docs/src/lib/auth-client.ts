import { createAuthClient } from "better-auth/react";
import { oidcClient } from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
	plugins: [oauthProviderClient(), sentinelClient()],
});
