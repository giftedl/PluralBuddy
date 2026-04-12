import { authenticateOAuth } from "@/lib/oauth";
import { api } from "@/lib/rpc";
import { waitUntil } from "@vercel/functions";
import { NextRequest } from "next/server";
import { PAlter, PAlterObject, PSystemObject, PTag, PTagObject, PUser } from "plurography";
import z from "zod";

const TagEditInput = PTagObject.omit({
	tagId: true,
	systemId: true,
	associatedAlters: true
}).partial().default({});

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string; tag: string }> },
) {
	const { user, tag } = await params;

	const oauthResponse = await authenticateOAuth(request, [
		"alters:write",
		"system:admin",
	]);

	if ("response" in oauthResponse) return oauthResponse.response;

	if (user !== oauthResponse.accountId && user !== "@me") {
		return Response.json(
			{
				errors: [
					{
						type: "not-matching-oauth",
						friendly:
							"This endpoint requires the user currently logged in via OAuth.",
					},
				],
			},
			{ status: 400 },
		);
	}

	const input = TagEditInput.safeParse(await request.json());

	if (input.error) {
		return Response.json({ errors: input.error }, { status: 400 });
	}

	const { data } = input;
	const db = oauthResponse.mongo.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const tagCollection = db.collection<PTag>("tags");
	const tagObj = await tagCollection.findOne({
		$and: [{ systemId: oauthResponse.accountId,}, { tagId: tag }]
	});

	if (!tagObj) {
		return Response.json(
			{
				errors: [
					{ type: "unknown-alter", friendly: "Couldn't find this alter." },
				],
			},
			{ status: 404 },
		);
	}

	await tagCollection.updateOne(
		{
			$and: [{ systemId: oauthResponse.accountId,}, { tagId: tag }]
		},
		{
			$set: Object.assign({}, ...Object.entries(data).map(([v, c]) => ({
				// @ts-ignore
				[v]: c ?? tagObj?.[v],
			})))
		},
	);

	waitUntil(oauthResponse.mongo.close());

	return Response.json({
		...tagObj,

		...Object.assign({}, ...Object.entries(data).map(([v, c]) => ({
			// @ts-ignore
			[v]: c ?? tagObj?.[v],
		})))
	});
}
