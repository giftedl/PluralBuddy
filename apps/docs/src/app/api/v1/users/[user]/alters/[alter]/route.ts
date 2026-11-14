/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { redactAlter } from "@/lib/redact";
import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<{ user: string; alter: string }>(
  {
    scopes: ["alters:read", "system:admin"],
  },
  async (ctx) => {
    const { user, alter } = ctx.urlData.params;
    const parsedUserId = user === "@me" ? ctx.auth.accountId : user;

    const isSelf = user === "@me" || user === ctx.auth.accountId;
    const response = await ctx.alterCollection.findOne({
      alterId: Number(alter),
      systemId: parsedUserId,
    });

    return ctx.respond({
      isSelf,
      data: redactAlter(isSelf, response, ctx.auth.clientId ?? ""),
    });
  },
);

export const DELETE = createOAuthFunction<{ user: string; alter: string }>(
  {
    mustMatchOAuth: true,
    scopes: ["alters:write", "system:admin"],
    expectSystem: true,
  },
  async (ctx) => {
    const alterObj = await ctx.fetchAlter({
      alterId: ctx.urlData.params.alter,
      systemId: ctx.auth.accountId,
    });

    if (!alterObj) {
      return ctx.error(
        {
          type: "no-alter",
          friendly: "This alter doesn't exist.",
        },
        404,
      );
    }

    await Promise.allSettled([
      ctx.alterCollection.deleteOne({
        alterId: Number(ctx.urlData.params.alter),
        systemId: ctx.auth.accountId,
      }),

      ctx.userCollection.updateOne(
        {
          userId: ctx.auth.accountId,
        },
        { $pull: { "system.alterIds": Number(ctx.urlData.params.alter) } },
      ),
    ]);

    return ctx.respond({ success: true });
  },
);
