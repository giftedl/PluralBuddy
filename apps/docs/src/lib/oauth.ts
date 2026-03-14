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
				errors: [{ type: "no-access-token", friendly: "no access token" }],
			}, { status: 401 }),
		};
	}

	const userInfo = await auth.api
		.oauth2UserInfo({
			request,
		})
		.catch((e) => {return null});
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
					errors: [{ type: "invalid-scopes", friendly:e?.body?.message }],
				}, { status: 401 }),
			};
		return { response: NextResponse.json({ errors: [{ type: "invalid-auth", friendly: "invalid auth token." } ]})}
	});

	if (token && "response" in token)
		return { response: token.response as NextResponse };

	const client = new MongoClient(process.env.MONGO ?? "");

	await client.connect();

	if (!userInfo) {
		return {
			response: NextResponse.json({
				errors: [{ type: "unknown-token", friendly: "unknown auth token" }],
			}, { status: 401 }),
		};
	}

	const discordAccountId = await client
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection("account")
		.findOne({ userId: new ObjectId(userInfo.sub) });

	return { mongo: client, accountId: discordAccountId?.accountId };
}


export async function userlessOAuth(
	request: NextRequest,
	requiredScopes: string[],
): Promise<
	{ response: NextResponse } | { success: true }
> {
	const authorization = request.headers.get("authorization");
	const accessToken = authorization?.startsWith("Bearer ")
		? authorization.replace("Bearer ", "")
		: authorization;

	if (!accessToken) {
		return {
			response: NextResponse.json({
				errors: [{ type: "no-access-token", friendly: "no access token" }],
			}, { status: 401 }),
		};
	}

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
					errors: [{ type: "invalid-scopes", friendly:e?.body?.message }],
				}, { status: 403 }),
			};
		return { response: NextResponse.json({ errors: [{ type: "invalid-auth", friendly: "invalid auth token." } ]})}
	});

	return { success: true };
}
