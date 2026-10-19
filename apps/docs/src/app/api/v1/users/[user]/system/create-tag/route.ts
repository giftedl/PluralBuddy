import { DiscordSnowflake } from "@sapphire/snowflake";
import { type NextRequest, NextResponse } from "next/server";
import { type PTag, PTagObject, type PUser, tagColors } from "plurography";
import z from "zod";
import { authenticateOAuth } from "@/lib/oauth";
import { createOAuthFunction } from "@/server/wrapper";

const CreateTagParams = PTagObject.omit({
	tagId: true,
	tagFriendlyName: true,
	tagColor: true,
	systemId: true,
	associatedAlters: true,
	fields: true
}).optional().and(z.object({
	color: z.enum(tagColors),
	displayName: z.string().max(100).min(3),
}));

export const POST = createOAuthFunction<
	{ user: string },
	typeof CreateTagParams
>(
	{
		scopes: ["tags:write", "system:admin"],
		mustMatchOAuth: true,
		expectSystem: true,
		bodyResolver: CreateTagParams,
	},
	async (ctx) => {
		const user = await ctx.fetchUser();
		const input = await ctx.body();

		if (!user || !user.system || user.system.tagIds.length >= 1000) {
			return ctx.error({
				type: "too-many-tags",
				friendly: "There are too many tags in the system or it doesn't exist.",
			});
		}

		const tag = PTagObject.safeParse({
			tagId: Number(DiscordSnowflake.generate()).toString(),
			systemId: user.system.associatedUserId,

			tagFriendlyName: input.displayName,
			tagColor: input.color,

			associatedAlters: [],
			fields: {},
			...input
		} satisfies PTag);

		if (!tag.data || tag.error) {
			return ctx.error({
				type: "zod",
				friendly: z.treeifyError(tag.error),
			});
		}

		await Promise.allSettled([
			ctx.tagCollection.insertOne(tag.data),
			ctx.userCollection.updateOne(
				{ userId: ctx.auth.accountId },
				{ $push: { "system.tagIds": tag.data.tagId } },
			),
		]);

		return ctx.respond(tag.data);
	},
);
