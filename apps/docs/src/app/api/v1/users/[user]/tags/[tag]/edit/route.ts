import { createOAuthFunction } from "@/server/wrapper";
import { PTagObject } from "plurography";

const TagEditInput = PTagObject.omit({
	tagId: true,
	systemId: true,
	associatedAlters: true,
})
	.strict()
	.partial()
	.default({});

export const POST = createOAuthFunction<
	{ user: string; tag: string },
	typeof TagEditInput
>(
	{
		bodyResolver: TagEditInput,
		scopes: ["tags:write", "system:admin"],
		expectSystem: true,
		mustMatchOAuth: true,
	},
	async (ctx) => {
		const { tag } = ctx.urlData.params;
		const tagObj = await ctx.fetchTag({
			systemId: ctx.auth.accountId,
			tagId: tag,
		});
		

		if (!tagObj) {
			return ctx.error(
				{ type: "unknown-tag", friendly: "Couldn't find this tag." },
				404,
			);
		}
		const { fields, ...omittedData } = await ctx.body();

		await Promise.allSettled([
			ctx.tagCollection.updateOne(
				{
					$and: [{ systemId: ctx.auth.accountId }, { tagId: tag }],
				},
				{
					$set: Object.assign(
						{},
						...Object.entries(omittedData).map(([v, c]) => ({
							// @ts-ignore
							[v]: c ?? tagObj?.[v],
						})),
					),
				},
			),
			...(fields !== undefined && fields[ctx.auth.clientId ?? ""] !== undefined
				? [
						ctx.tagCollection.updateOne(
							{
								$and: [{ systemId: ctx.auth.accountId }, { tagId: tag }],
							},
							{
								$set: {
									[`fields.${ctx.auth.clientId}`]:
										fields[ctx.auth.clientId ?? ""],
								},
							},
						),
					]
				: []),
		]);

		return ctx.respond({
			...tagObj,

			...Object.assign(
				{},
				...Object.entries({ fields, ...omittedData }).map(([v, c]) => ({
					// @ts-ignore
					[v]: c ?? tagObj?.[v],
				})),
			),
		});
	},
);
