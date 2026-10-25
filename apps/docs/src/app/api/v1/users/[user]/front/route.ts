// AI/AP endpoint

import { createOAuthFunction } from "@/server/wrapper";
import z from "zod";

const SystemFrontInput = z.object({
	alter: z.string(),
});

export const POST = createOAuthFunction<
	{ user: string },
	typeof SystemFrontInput
>(
	{
		scopes: ["system:ai-ap"],
		mustMatchOAuth: true,
		expectSystem: true,
		bodyResolver: SystemFrontInput,
	},
	async (ctx) => {
		const client = await ctx.oauthClientsCollection.findOne({
			clientId: ctx.auth.clientId,
		});
		const input = await ctx.body();

		if (!client) {
			return ctx.error({
				type: "no-ai-ap-id",
				friendly:
					"There is no assigned AI/AP ID which is required to set a front. See https://pluralbuddy.app/docs/pluralbuddy/ai-ap.",
			});
		}

		const specifiedAlter = await ctx.alterCollection.findOne({
			alterId: Number(input.alter ?? ""),
			systemId: ctx.auth.accountId,
		});

		if (!specifiedAlter) {
			return ctx.error(
				{
					type: "unknown-alter",
					friendly: "Unable to find the specific alter.",
				},
				404,
			);
		}

		await ctx.frontCollection.replaceOne(
			{
				$and: [
					{
						clientId: ctx.auth.clientId,
					},
					{
						systemId: ctx.auth.accountId,
					},
				],
			},
			{
				clientId: ctx.auth.clientId,
				systemId: ctx.auth.accountId,
				alterId: input.alter,
				timestamp: new Date(),
				aiapId: ((client.metadata ?? {}) as Record<string, string>).aaid,
			},
			{ upsert: true },
		);

		return ctx.respond({ success: true });
	},
);
