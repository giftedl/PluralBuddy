/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { verifyAccessToken } from "better-auth/oauth2";

export async function authenticateOAuth(
	request: NextRequest,
	requiredScopes: string[],
): Promise<
	{ response: NextResponse } | { mongo: MongoClient; accountId: string }
> {
	const authorization = request.headers.get("authorization");
	const accessToken = authorization?.startsWith("Bearer ")
		? authorization.replace("Bearer ", "")
		: authorization;

	if (!accessToken) {
		return {
			response: NextResponse.json({
				error_description: "no access token",
				error: 10003,
			}),
		};
	}

	const userInfo = await auth.api
		.oauth2UserInfo({
			request,
		})
		.catch(() => null);
	const token = await verifyAccessToken(accessToken, {
		verifyOptions: {
			issuer: `${process.env.BETTER_AUTH_URL}/api/auth`,
			audience: process.env.BETTER_AUTH_URL ?? "",
		},
		scopes: requiredScopes,
		jwksUrl: `${process.env.BETTER_AUTH_URL}/api/auth/jwks`,
	}).catch((e) => {
		if (e?.body?.code === "INVALID_SCOPE_SYSTEMREAD")
			return {
				response: NextResponse.json({
					error_description: e?.body?.message,
					error: 10004,
				}),
			};
	});

	if (token && "response" in token)
		return { response: token.response as NextResponse };

	const client = new MongoClient(process.env.MONGO ?? "");

	await client.connect()

	if (!userInfo) {
		return {
			response: NextResponse.json({
				error_description: "unknown auth token",
				error: 10002,
			}),
		};
	}

	const discordAccountId = await client
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection("account")
		.findOne({ userId: new ObjectId(userInfo.sub) });

	return { mongo: client, accountId: discordAccountId?.accountId };
}
