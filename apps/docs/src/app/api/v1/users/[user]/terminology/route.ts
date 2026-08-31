import { PTerminology } from "plurography";
import { api } from "@/lib/rpc";
import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<{ user: string }>(
	{ scopes: ["system:read"], mustMatchOAuth: true },
	async (ctx) => {
		const system = await ctx.fetchUser();

		return ctx.respond({ data: system?.terminology ?? null });
	},
);

export const POST = createOAuthFunction<{ user: string }, typeof PTerminology>(
	{
		scopes: ["system:write"],
		mustMatchOAuth: true,
		bodyResolver: PTerminology,
	},
	async (ctx) => {
		const userId = ctx.auth.accountId;
		const data = await ctx.body();

		if (data === undefined)
			return ctx.error({
				friendly: "Terminology must be defined.",
				type: "terminology-undefined",
			});

		await ctx.userCollection.updateOne(
			{ userId },
			{ $set: { terminology: data } },
		);

        // Delete bot cache of terminology for user
        await api.cache.$delete({ json: { type: "terminology", key: userId } })

        return ctx.respond({ success: true })
	},
);
