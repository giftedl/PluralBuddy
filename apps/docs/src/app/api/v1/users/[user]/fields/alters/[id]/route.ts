import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<{ id: string; user: string }>(
  {
    expectSystem: true,
    mustMatchOAuth: true,
    scopes: ["alters:read", "system:admin"],
  },
  async (ctx) => {
    const { id } = ctx.urlData.params;
    const alter = await ctx.alterCollection.findOne({
      [`fields.${ctx.auth.clientId}`]: id,
      systemId: ctx.auth.accountId,
    });

    return ctx.respond(alter);
  },
);
