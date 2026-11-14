/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { redactTag } from "@/lib/redact";
import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<{ user: string; tag: string }>(
  { scopes: ["tags:read", "system:admin"] },
  async (ctx) => {
    const { user, tag } = ctx.urlData.params;

    const parsedUserId = user === "@me" ? ctx.auth.accountId : user;
    const isSelf = user === "@me" || user === ctx.auth.accountId;

    const response = await ctx.fetchTag({
      tagId: tag,
      systemId: parsedUserId,
    });

    if (!response) {
      return ctx.error(
        {
          type: "no-tag",
          friendly: "No such tag.",
        },
        404,
      );
    }

    return ctx.respond({
      isSelf,
      data: redactTag(isSelf, response, ctx.auth.clientId),
    });
  },
);

export const DELETE = createOAuthFunction<{ user: string; tag: string }>(
  {
    scopes: ["tags:write", "system:admin"],
    mustMatchOAuth: true,
    expectSystem: true,
  },
  async (ctx) => {
    const tag = await ctx.fetchTag({
      tagId: ctx.urlData.params.tag,
      systemId: ctx.auth.accountId,
    });

    if (!tag) {
      return ctx.error({
        type: "no-tag",
        friendly: "This tag doesn't exist.",
      });
    }

    await Promise.allSettled([
      ctx.tagCollection.deleteOne({
        tagId: tag.tagId,
        systemId: ctx.auth.accountId,
      }),

      ctx.userCollection.updateOne(
        {
          userId: ctx.auth.accountId,
        },
        { $pull: { "system.tagIds": tag.tagId } },
      ),
    ]);

    return ctx.respond();
  },
);
