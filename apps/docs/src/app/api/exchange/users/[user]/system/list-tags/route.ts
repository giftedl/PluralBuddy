import { authenticateOAuth } from "@/lib/oauth";
import { NextRequest } from "next/server";
import { PAlter, PTag, PUser } from "plurography";

export async function GET(
	request: NextRequest,
	{
		params,
		searchParams,
	}: {
		params: Promise<{ user: string }>;
		searchParams: Promise<{
			max: string | undefined;
			skip: string | undefined;
		}>;
	},
) {
	const { user } = await params;

	const oauthResponse = await authenticateOAuth(request, [
		"alters:read",
		"system:admin",
	]);

	if ("response" in oauthResponse) return oauthResponse.response;

	const parsedUserId = user === "@me" ? oauthResponse.accountId : user;
	const db = oauthResponse.mongo.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const tagCollection = db.collection<PTag>("tags");

	if (parsedUserId !== oauthResponse.accountId) {
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

	const maxAlters = Number((await searchParams).max ?? 30);
	const skipAlters = Number((await searchParams).skip ?? 0);

	if (maxAlters > 30)
		return Response.json(
			{
				errors: [
					{
						type: "max-too-high",
						friendly: "At most, you can only get 30 tags.",
					},
				],
			},
			{ status: 400 },
		);

	const applicationsList = await tagCollection
		.find({ systemId: user })
		.skip(skipAlters ?? 0)
		.limit(maxAlters)
		.toArray();

	return applicationsList.map((v) => {
		let { _id, ...c } = v;
		return c;
	});
}
