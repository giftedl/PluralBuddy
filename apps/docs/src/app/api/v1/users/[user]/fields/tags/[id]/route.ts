import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<{ id: string; user: string }>(
  {
    mustMatchOAuth: true,
    scopes: ["alters:read", "system:admin"],
  },
  async (ctx) => {
    const { id } = ctx.urlData.params;
    const tag = await ctx.tagCollection.findOne({
      [`fields.${ctx.auth.clientId}`]: id,
      systemId: ctx.auth.accountId,
    });

    return ctx.respond(tag);
  },
);
