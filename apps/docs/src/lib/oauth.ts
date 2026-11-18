/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { requestToResourceInput, verifyAccessTokenRequest } from "better-auth/oauth2";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function authenticateOAuth(
	request: NextRequest,
	requiredScopes: string[],
	mongoClient?: MongoClient
): Promise<
	| { response: NextResponse }
	| { mongo: MongoClient; accountId: string; clientId: string | null; scopes: string[]; }
> {
	const authorization = request.headers.get("authorization");
	const accessToken = authorization?.startsWith("Bearer ")
		? authorization.replace("Bearer ", "")
		: authorization;

	if (!accessToken) {
		return {
			response: NextResponse.json(
				{
					errors: [{ type: "no-access-token", friendly: "no access token" }],
				},
				{ status: 401 },
			),
		};
	}

	// Prevent double rate-limit access attacks by requiring Bearer to start all tokens.
	// Since Vercel only rate limits based on what exactly is in the Authorization header. (regardless of if Bearer is preceeding or not.)
	// if (!authorization?.startsWith("Bearer")) {
	// 	return {
	// 		response: NextResponse.json(
	// 			{
	// 				errors: [{ type: "no-access-token", friendly: "no access token" }],
	// 			},
	// 			{ status: 401 },
	// 		),
	// 	};
	// }

  // Goes to Better Auth to actually verify the token. If it fails, send it back to the request depending on the error.
	const token = await verifyAccessTokenRequest(
		requestToResourceInput(request), {
		verifyOptions: {
			issuer: `${process.env.BETTER_AUTH_URL}/api/auth`,
			audience: process.env.BETTER_AUTH_URL ?? "",
      		typ: "at+jwt",
      		requiredClaims: ["azp"],
		},
		jwksUrl: `${process.env.BETTER_AUTH_URL}/api/auth/jwks`,
		// Does not use Better Auth's scope management
		requiredScopes: [],
	}).catch((e) => {
		console.log(e)
		if (e?.body?.code === "INVALID_SCOPE_SYSTEMREAD")
			return {
				response: NextResponse.json(
					{
						errors: [{ type: "invalid-scopes", friendly: e?.body?.message }],
					},
					{ status: 401 },
				),
			};

		console.warn("error while oauth authenticating:", e);
		return {
			response: NextResponse.json(
				{ errors: [{ type: "invalid-auth", friendly: "invalid auth token." }] },
				{ status: 401 },
			),
		};
	});

	if (token && "response" in token)
		return { response: token.response as NextResponse };

	const scope = token.scope;

	if (!scope) {
		return {
			response: NextResponse.json(
				{ errors: [{ type: "invalid-auth", friendly: "invalid auth token." }] },
				{ status: 401 },
			),
		};
	}

	const scopes = (scope as string).split(" ");
	if (requiredScopes.length !== 0 && !scopes.some((v) => requiredScopes.includes(v))) {
		return {
			response: NextResponse.json(
				{
					errors: [
						{
							type: "invalid-scopes",
							friendly: "you are missing a scope to use this endpoint.",
						},
					],
				},
				{ status: 401 },
			),
		};
	}

	const client = mongoClient ?? new MongoClient(process.env.MONGO ?? "");

	if (!mongoClient)
		await client.connect();

	if (!token) {
		return {
			response: NextResponse.json(
				{
					errors: [{ type: "unknown-token", friendly: "unknown auth token" }],
				},
				{ status: 401 },
			),
		};
	}
	const discordAccountId = await client
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection("account")
		.findOne({ userId: new ObjectId(token.sub) });

	return {
		mongo: client,
		accountId: discordAccountId?.accountId,
		clientId: (token.client_id as string) ?? token.azp ?? null,
		scopes
	};
}

export async function userlessOAuth(
	request: NextRequest,
	requiredScopes: string[],
): Promise<{ response: NextResponse } | { success: true }> {
	const authorization = request.headers.get("authorization");
	const accessToken = authorization?.startsWith("Bearer ")
		? authorization.replace("Bearer ", "")
		: authorization;

	if (!accessToken) {
		return {
			response: NextResponse.json(
				{
					errors: [{ type: "no-access-token", friendly: "no access token" }],
				},
				{ status: 401 },
			),
		};
	}

	const token = await verifyAccessTokenRequest(
		requestToResourceInput(request), {
		verifyOptions: {
			issuer: `${process.env.BETTER_AUTH_URL}/api/auth`,
			audience: process.env.BETTER_AUTH_URL ?? "",
      		typ: "at+jwt",
      		requiredClaims: ["azp"],
		},
		jwksUrl: `${process.env.BETTER_AUTH_URL}/api/auth/jwks`,
		requiredScopes,
	}).catch((e) => {
		if (e?.body?.code === "INVALID_SCOPE_SYSTEMREAD")
			return {
				response: NextResponse.json(
					{
						errors: [{ type: "invalid-scopes", friendly: e?.body?.message }],
					},
					{ status: 403 },
				),
			};
		return {
			response: NextResponse.json(
				{ errors: [{ type: "invalid-auth", friendly: "invalid auth token." }] },
				{ status: 401 },
			),
		};
	});

	if (token && "response" in token)
		return { response: token.response as NextResponse };

	return { success: true };
}