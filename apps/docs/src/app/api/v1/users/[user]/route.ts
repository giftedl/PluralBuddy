/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { auth } from "@/lib/auth";
import { createOAuthFunction } from "@/server/wrapper";
import { type NextRequest, NextResponse } from "next/server";

export const GET = createOAuthFunction<{ user: string }>(
	{ scopes: [], mustMatchOAuth: true },
	async (ctx) => {
		return ctx.respond({
			clientId: ctx.auth.clientId,
			accountId: ctx.auth.accountId,
		});
	},
);
