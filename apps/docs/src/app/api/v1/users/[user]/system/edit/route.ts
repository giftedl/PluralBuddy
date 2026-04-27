import { authenticateOAuth } from "@/lib/oauth";
import { api } from "@/lib/rpc";
import { waitUntil } from "@vercel/functions";
import { NextRequest } from "next/server";
import { PSystemObject, PUser } from "plurography";

const SystemEditInput = PSystemObject.omit({
	alterIds: true,
	tagIds: true,
	systemAutoproxy: true,
	createdAt: true,
	associatedUserId: true,
	systemOperationDM: true,
	subAccounts: true
}).partial().default({});

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string }> },
) {
	const { user } = await params;

	const oauthResponse = await authenticateOAuth(request, [
		"system:write",
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
			{ status: 404 },
		);
	}

	const input = SystemEditInput.safeParse(await request.json());

	if (input.error) {
		return Response.json({ errors: input.error }, { status: 400 });
	}

	const { data } = input;
	const db = oauthResponse.mongo.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const userCollection = db.collection<PUser>("users");
	const system = await userCollection.findOne({
		userId: oauthResponse.accountId,
	});

	if (!system || !system.system) {
		return Response.json(
			{
				errors: [
					{ type: "no-system", friendly: "This user does not have a system." },
				],
			},
			{ status: 404 },
		);
	}

	await userCollection.updateOne(
		{
			userId: oauthResponse.accountId,
		},
		{
			$set: Object.assign({}, ...Object.entries(data).map(([v, c]) => ({
				// @ts-ignore
				[`system.${v}`]: c ?? system.system?.[v],
			}))),
		},
	);

	waitUntil(oauthResponse.mongo.close());

	await api.systems.operation.$post({
		json: {
			method: "exchange",
			changedOperation: input.data,
			oldSystem: system.system,
		},
	});

	return Response.json({
		...system.system,

		...Object.assign({}, ...Object.entries(data).map(([v, c]) => ({
			// @ts-ignore
			[v]: c ?? system.system?.[v],
		})))
	});
}
