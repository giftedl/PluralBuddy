import { waitUntil } from "@vercel/functions";
import { NextRequest } from "next/server";
import { PSystemObject, PUser } from "plurography";
import { authenticateOAuth } from "@/lib/oauth";
import { api } from "@/lib/rpc";
import { createOAuthFunction } from "@/server/wrapper";

const SystemEditInput = PSystemObject.omit({
	alterIds: true,
	tagIds: true,
	systemAutoproxy: true,
	createdAt: true,
	associatedUserId: true,
	systemOperationDM: true,
	subAccounts: true,
})
	.strict()
	.partial()
	.default({});

export const POST = createOAuthFunction<
	{ user: string },
	typeof SystemEditInput
>(
	{
		scopes: ["system:write", "system:admin"],
		mustMatchOAuth: true,
		expectSystem: true,
		bodyResolver: SystemEditInput,
	},
	async (ctx) => {
		const user = await ctx.fetchUser();
		const data = await ctx.body();

		await ctx.userCollection.updateOne(
			{
				userId: ctx.auth.accountId,
			},
			{
				$set: Object.assign(
					{},
					...Object.entries(data).map(([v, c]) => ({
						// @ts-ignore
						[`system.${v}`]: c ?? user.system?.[v],
					})),
				),
			},
		);

		if (!user?.system) throw new Error("No system.");

		await api.systems.operation.$post({
			json: {
				method: "exchange",
				changedOperation: data,
				oldSystem: user.system,
			},
		});

		return ctx.respond({
			...user.system,

			...Object.assign(
				{},
				...Object.entries(data).map(([v, c]) => ({
					// @ts-ignore
					[v]: c ?? user.system?.[v],
				})),
			),
		});
	},
);