// @ts-nocheck

import type { ClientType } from "bot";
import { hc } from "hono/client";

export const { api } = hc<ClientType>(process.env.BACKEND_API ?? "", {
	headers: {
		"X-PluralBuddy-Api-Key": process.env.BACKEND_TOKEN ?? ".",
	},
});
