/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ user: string }> }) {
	const authorization = request.headers.get("authorization");
    const { user } = await params;

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

    if (user !== "@me") {

		return Response.json({
			error_description: "you cannot get data about users other than the current OAuth scope",
			error: 20002,
		}, { status: 400 });
    }

	try {
		const userInfo = await auth.api.oAuth2userInfo({
            request
		});

		return Response.json(userInfo);
	} catch (e) {
		return Response.json({
			error_description: (e as APIError).body?.error_description,
			error: 20001,
		}, { status: (e as APIError).statusCode });
	}
}
