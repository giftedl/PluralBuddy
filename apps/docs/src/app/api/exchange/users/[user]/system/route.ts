/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { authenticateOAuth } from "@/lib/oauth";
import type { NextRequest } from "next/server";
import type { PAlter, PUser } from "plurography";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string }> },
) {
	const { user } = await params;

	const oauthResponse = await authenticateOAuth(request, [
		"system:read",
		"system:admin",
	]);


	if (oauthResponse.response) return oauthResponse.response;

	const parsedUserId = user === "@me" ? oauthResponse.accountId : user;
	const db = oauthResponse.mongo.db("pluralbuddy-canary");
	const userCollection = db.collection<PUser>("users");

    if (parsedUserId !== oauthResponse.accountId) {
		return Response.json({
			error_description: "you cannot get data about users other than the current OAuth scope",
			error: 20002,
		}, { status: 400 });
    }

    const systemData = await userCollection.findOne({ userId: parsedUserId })

	return Response.json({ data: systemData?.system ?? null });
}