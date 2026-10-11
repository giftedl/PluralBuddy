import { DiscordSnowflake } from "@sapphire/snowflake";
import { NextRequest, NextResponse } from "next/server";
import { createRandomId, PAlter, PAlterObject, PUser } from "plurography";
import z from "zod";
import { authenticateOAuth } from "@/lib/oauth";
import { createOAuthFunction } from "@/server/wrapper";

const CreateAlterParams = PAlterObject.omit({
	alterId: true,
	systemId: true,
	lastMessageTimestamp: true,
	created: true,
	fields: true,
	messageCount: true,
	tagIds: true,
	proxyTags: true,
})
	.partial()
	.and(
		z.object({
			username: z
				.string()
				.max(100)
				.regex(/^[^\s@\\/]+$/),
			displayName: z.string().max(100),
			proxyTags: z
				.object({
					prefix: z.string().max(100),
					suffix: z.string().max(100),
				})
				.array()
				.default([])
				.optional(),
		}),
	);

export const POST = createOAuthFunction<
	{ user: string },
	typeof CreateAlterParams
>(
	{
		scopes: ["alters:write", "system:admin"],
		mustMatchOAuth: true,
		expectSystem: true,
		bodyResolver: CreateAlterParams,
	},
	async (ctx) => {
		const user = await ctx.fetchUser();
		const input = await ctx.body();
		const possibleExistingAlter = await ctx.alterCollection.findOne({
			username: input.username,
			systemId: user?.userId,
		});

		if (!user || !user.system || user.system.alterIds.length >= 2000) {
			return ctx.error({
				type: "too-many-alters",
				friendly: "There are too many alters in the system.",
			});
		}

		if (possibleExistingAlter) {
			return ctx.error({
				type: "duplicate",
				friendly: "There is a duplicate alter with this username.",
			});
		}

		const alter = PAlterObject.safeParse({
			alterId: Number(DiscordSnowflake.generate()),
			systemId: user.userId,

			nameMap: [],
			color: null,
			pronouns: null,
			description: null,
			created: new Date(),
			avatarUrl: null,
			webhookAvatarUrl: null,
			banner: null,
			lastMessageTimestamp: null,
			messageCount: 0,
			alterMode: "webhook",
			public: 0,
			avatarUrlMap: {},
			tagIds: [],
			flags: 0,
			fields: {},
			...input,
			proxyTags: (input.proxyTags ?? []).map((v, i) => ({
				prefix: v.prefix,
				suffix: v.suffix,
				id: createRandomId(i).toString(),
			})),
		} satisfies PAlter);

		if (!alter.data || alter.error) {
			return ctx.error({
				type: "zod",
				friendly: z.treeifyError(alter.error),
			});
		}

		await Promise.allSettled([
			ctx.alterCollection.insertOne(alter.data),
			ctx.userCollection.updateOne(
				{ userId: ctx.auth.accountId },
				{ $push: { "system.alterIds": alter.data.alterId } },
			),
		]);

		return ctx.respond(alter.data);
	},
);
