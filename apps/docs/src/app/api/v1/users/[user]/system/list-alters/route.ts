import { type ZodType, z } from "zod";
import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<
  { user: string },
  ZodType,
  {
    max: string | undefined;
    skip: string | undefined;
  }
>(
  {
    scopes: ["alters:read", "system:admin"],
    mustMatchOAuth: true,
    expectSystem: true,
  },
  async (ctx) => {
    const maxAlters = Number((ctx.urlData.searchParams ?? {}).max ?? 250);
    const skipAlters = Number((ctx.urlData.searchParams ?? {}).skip ?? 0);

    if (maxAlters > 250)
      return ctx.error({
        type: "max-too-high",
        friendly: "At most, you can only get 250 alters.",
      });

    const applicationsList = await ctx.alterCollection
      .find({ systemId: ctx.auth.accountId })
      .skip(skipAlters ?? 0)
      .limit(maxAlters)
      .toArray();

    return ctx.respond(
      applicationsList.map((v) => {
        let { _id, ...c } = v;
        return c;
      }),
    );
  },
);
