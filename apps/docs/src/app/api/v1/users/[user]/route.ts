/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { auth } from "@/lib/auth";
import { createOAuthFunction } from "@/server/wrapper";
import { APIError, verifyAccessToken } from "better-auth";
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
