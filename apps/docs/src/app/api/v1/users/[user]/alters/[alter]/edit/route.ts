import { isEqual } from "lodash";
import { PAlterObject } from "plurography";
import { api } from "@/lib/rpc";
import { createOAuthFunction } from "@/server/wrapper";

const AlterEditInput = PAlterObject.omit({
	alterId: true,
	systemId: true,
	created: true,
	lastMessageTimestamp: true,
	messageCount: true,
})
	.strict()
	.partial()
	.default({});

export const POST = createOAuthFunction<
	{ user: string; alter: string },
	typeof AlterEditInput
>(
	{
		mustMatchOAuth: true,
		expectSystem: true,
		scopes: ["alters:write", "system:admin"],
		bodyResolver: AlterEditInput,
	},
	async (ctx) => {
		const { alter } = ctx.urlData.params;
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

		const { fields, tagIds, ...omittedData } = await ctx.body();

		if (!isEqual(omittedData.proxyTags, alterObj.proxyTags)) {
			await api.cache.$delete({
				json: { type: "alterProxy", key: String(alterObj.alterId) },
			});
		}

		const successfulTags =
			tagIds === undefined
				? []
				: await ctx.tagCollection
						.find({ systemId: ctx.auth.accountId, tagId: { $in: tagIds } })
						.toArray();

		if (tagIds) {
			const missingTags = alterObj.tagIds.filter(
				(v) => !(tagIds ?? []).includes(v),
			);

			for (const missingTag of missingTags) {
				ctx.tagCollection.updateOne(
					{ tagId: missingTag, systemId: ctx.auth.accountId },
					{
						$pull: { associatedAlters: alter },
					},
				);
			}
		}

		for (const tag of successfulTags) {
			if (!tag.associatedAlters.includes(alter))
				ctx.tagCollection.updateOne(
					{ tagId: tag.tagId, systemId: tag.systemId },
					{
						$push: { associatedAlters: alter },
					},
				);
		}

		await Promise.allSettled([
			ctx.alterCollection.updateOne(
				{
					$and: [{ systemId: ctx.auth.accountId }, { alterId: Number(alter) }],
				},
				{
					$set: Object.assign(
						{},
						...Object.entries({
							...omittedData,
							tagIds: successfulTags.map((v) => v.tagId),
						}).map(([v, c]) => ({
							// @ts-ignore
							[v]: c ?? alterObj?.[v],
						})),
					),
				},
			),
			...(fields !== undefined && fields[ctx.auth.clientId ?? ""] !== undefined
				? [
						ctx.alterCollection.updateOne(
							{
								$and: [
									{ systemId: ctx.auth.accountId },
									{ alterId: Number(alter) },
								],
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
			...alterObj,
			...Object.assign(
				{},
				...Object.entries(await ctx.body()).map(([v, c]) => ({
					// @ts-ignore
					[v]: c ?? alterObj?.[v],
				})),
			),
		});
	},
);
