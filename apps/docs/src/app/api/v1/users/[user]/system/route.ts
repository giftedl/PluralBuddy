/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { assetStringGeneration, createRandomId, defaultNudgingStructure, PSystem, PSystemObject, terminologyDefaults } from "plurography";
import z from "zod";
import { createOAuthFunction } from "@/server/wrapper";

export const GET = createOAuthFunction<{ user: string }>(
	{
		scopes: ["system:read", "system:admin"],
		mustMatchOAuth: true,
	},
	async (ctx) => {
		const system = await ctx.fetchUser();

		return ctx.respond({ data: system?.system ?? null });
	},
);

const CreateSystemParams = PSystemObject.omit({
	alterIds: true,
	tagIds: true,
	systemAutoproxy: true,
	createdAt: true,
	associatedUserId: true,
	systemOperationDM: true,
	subAccounts: true,
})
	.partial()
	.and(z.object({ systemName: z.string().max(100).min(1) }));

export const POST = createOAuthFunction<unknown, typeof CreateSystemParams>(
	{
		scopes: ["system:write", "system:admin"],
		mustMatchOAuth: true,
		bodyResolver: CreateSystemParams,
	},
	async (ctx) => {
		const user = await ctx.fetchUser();
		const body = await ctx.body()

		if (user?.system !== undefined)
			return ctx.error({ type: "system-already-exists", friendly: "This user already has a system." })

		const system = {
			associatedUserId: ctx.auth.accountId,
			alterIds: [],
			tagIds: [],
			createdAt: new Date(),
			systemAutoproxy: [],
			public: 0,
			disabled: false,
			systemOperationDM: true,
			flags: 0,
			...body,
			displayTagMap: body.displayTagMap ?? {},
			disabledGuilds: body.disabledGuilds ?? []
		} satisfies PSystem;

		await ctx.userCollection.findOneAndReplace(
			{ userId: ctx.auth.accountId },
			{
				userId: ctx.auth.accountId,
				blocked: false,
				storagePrefix: user?.storagePrefix ?? assetStringGeneration(8),
				terminology: user?.terminology ?? terminologyDefaults,
				// @ts-ignore
				system,
				userLang: "en",
				nudging: user?.nudging ?? defaultNudgingStructure(),
			},
			{
				upsert: true,
			},
		);

		return ctx.respond(system)
	},
);