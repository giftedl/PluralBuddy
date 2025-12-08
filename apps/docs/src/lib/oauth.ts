/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateOAuth(request: NextRequest, requiredScopes: string[]) {
	const authorization = request.headers.get("authorization");

	if (!authorization) {
		return {
			response: NextResponse.json(
				{
					error_description: "authorization header not found",
					error: 10001,
				},
				{ status: 405 },
			),
		};
	}

	const client = new MongoClient(process.env.MONGO ?? "");
	const oauthCollection = client
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection("oauthAccessToken");
	const theoreticalOAuthToken = await oauthCollection.findOne({
		accessToken: authorization.replace("Bearer ", ""),
	});

	if (!theoreticalOAuthToken) {
		return {
			response: NextResponse.json({
				error_description: "unknown auth token",
				error: 10002,
			}),
		};
	}

    const authUserId = theoreticalOAuthToken.userId as ObjectId;
    const dateExpiresAt = theoreticalOAuthToken.accessTokenExpiresAt as Date;

    if (dateExpiresAt.getTime() < Date.now()) {
		return {
			response: NextResponse.json({
				error_description: "auth token expired",
				error: 10003,
			}),
		};
    }


    const discordAccountId = await client
        .db(`${process.env.ENV}-pluralbuddy-app`)
        .collection("account")
		.findOne({ userId: new ObjectId(authUserId) });
    const scopes = (theoreticalOAuthToken.scopes as string).split(" ");

	if (!requiredScopes.some(scope => scopes.includes(scope))) {
		return {
			response: NextResponse.json({
				error_description: "missing required scope",
				error: 10004,
			}),
		};
	}

	await client.close();

	return { mongo: client, accountId: discordAccountId?.accountId };
}
