import { authenticateOAuth } from "@/lib/oauth";
import { api } from "@/lib/rpc";
import { waitUntil } from "@vercel/functions";
import { NextRequest } from "next/server";
import { PSystemObject, PUser } from "plurography";
import z from "zod";

const SystemEditInput = PSystemObject.omit({
	alterIds: true,
	tagIds: true,
	systemAutoproxy: true,
	createdAt: true,
	associatedUserId: true,
}).partial();

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
			{ status: 400 },
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
			{ status: 400 },
		);
	}

	await userCollection.updateOne(
		{
			userId: oauthResponse.accountId,
		},
		{
			$set: {
				"system.systemName": data.systemName ?? system.system?.systemName,
				"system.systemDisplayTag":
					data.systemDisplayTag ?? system.system.systemDisplayTag,
				"system.systemDescription":
					data.systemDescription ?? system.system.systemDescription,
				"system.systemAvatar": data.systemAvatar ?? system.system.systemAvatar,
				"system.systemBanner": data.systemBanner ?? system.system.systemBanner,
				"system.systemPronouns":
					data.systemPronouns ?? system.system.systemPronouns,
				"system.nicknameFormat":
					data.nicknameFormat ?? system.system.nicknameFormat,
				"system.disabled": data.disabled ?? system.system.disabled,
				"system.latchExpiration":
					data.latchExpiration ?? system.system.latchExpiration,
				"system.public": data.public ?? system.system.public,
			},
		},
	);

	waitUntil(oauthResponse.mongo.close());


	await api.systems.operation.$post({
		json: {
			method: "exchange",
			changedOperation: input.data,
			oldSystem: system.system
		},
	})

	return Response.json({
		...system.system,

		systemName: data.systemName ?? system.system?.systemName,
		systemDisplayTag: data.systemDisplayTag ?? system.system.systemDisplayTag,
		systemDescription:
			data.systemDescription ?? system.system.systemDescription,
		systemAvatar: data.systemAvatar ?? system.system.systemAvatar,
		systemBanner: data.systemBanner ?? system.system.systemBanner,
		systemPronouns: data.systemPronouns ?? system.system.systemPronouns,
		nicknameFormat: data.nicknameFormat ?? system.system.nicknameFormat,
		disabled: data.disabled ?? system.system.disabled,
		latchExpiration: data.latchExpiration ?? system.system.latchExpiration,
		public: data.public ?? system.system.public,
	});
}
