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
	{ user: string },
	z.ZodType,
	undefined,
	true
>(
	{
		scopes: ["system:write", "system:admin"],
		mustMatchOAuth: true,
		expectSystem: true,
	},
	async (ctx) => {
		const { system, storagePrefix } = await ctx.fetchUser();

		initalizeS3();

		const objectName = `${storagePrefix}/${assetStringGeneration(32)}`;

		let banner = null;
		try {
			banner = await uploadAttachment(
				await ctx.request.arrayBuffer(),
				objectName,
				{
					authorId: ctx.auth.accountId,
					alterId: "@system",
					type: "banner",
				},
				getOldObject({
					imageProperty: system?.systemBanner,
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

		await ctx.userCollection.updateOne(
			{
				userId: ctx.auth.accountId,
			},
			{
				$set: {
					"system.systemBanner": banner,
				},
			},
		);

		return ctx.respond({ ...system, systemBanner: banner });
	},
);
