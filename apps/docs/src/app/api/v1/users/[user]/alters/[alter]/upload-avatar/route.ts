import { assetStringGeneration } from "plurography";
import type z from "zod";
import { FileTooBigException } from "@/server/obj-storage/file-too-big";
import {
	getOldObject,
	initalizeS3,
	uploadAttachment,
} from "@/server/obj-storage/object-storage";
import { createOAuthFunction } from "@/server/wrapper";

export const POST = createOAuthFunction<
	{ user: string; alter: string },
	z.ZodType,
	undefined,
	true
>(
	{
		scopes: ["alters:write", "system:admin"],
		mustMatchOAuth: true,
		expectSystem: true,
	},
	async (ctx) => {
		const { storagePrefix } = await ctx.fetchUser();
		const alterObj = await ctx.fetchAlter({
			systemId: ctx.auth.accountId,
			alterId: ctx.urlData.params.alter,
		});
		if (!alterObj) {
			return ctx.error(
				{
					type: "unknown-alter",
					friendly: "Couldn't find this alter.",
				},
				404,
			);
		}

		initalizeS3();

		const objectName = `${storagePrefix}/${assetStringGeneration(32)}`;

		let avatar = null;
		try {
			avatar = await uploadAttachment(
				await ctx.request.arrayBuffer(),
				objectName,
				{
					authorId: ctx.auth.accountId,
					alterId: ctx.urlData.params.alter,
					type: "profile-picture",
				},
				getOldObject({
					imageProperty: alterObj.avatarUrl,
					storagePrefix: storagePrefix,
				}),
			);
		} catch (e) {
			if (e instanceof FileTooBigException) {
				return ctx.error({
					type: "file-too-big",
					friendly: "That file is too big. (1mb)",
				});
			}
		}

		await ctx.alterCollection.updateOne(
			{
				alterId: Number(ctx.urlData.params.alter),
				systemId: ctx.auth.accountId,
			},
			{
				$set: {
					avatarUrl: avatar,
				},
			},
		);

		return ctx.respond({ ...alterObj, avatarUrl: avatar });
	},
);
