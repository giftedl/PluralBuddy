/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { auth } from "@/lib/auth";
import { authenticateOAuth } from "@/lib/oauth";
import { redactAlter } from "@/lib/redact";
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";
import { PAlter } from "plurography";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string; alter: string }> },
) {
	const { user, alter } = await params;

	const oauthResponse = await authenticateOAuth(request, [
		"alters:read",
		"system:admin",
	]);

	if (oauthResponse.response) return oauthResponse.response;

	const parsedUserId = user === "@me" ? oauthResponse.accountId : user;
	const db = oauthResponse.mongo.db("pluralbuddy-canary");
	const alterCollection = db.collection<PAlter>("alters");
	const isSelf = user === "@me" || user === oauthResponse.accountId;
	const response = await alterCollection.findOne({
		alterId: Number(alter),
		systemId: parsedUserId,
	});

	return Response.json({ isSelf, data: redactAlter(isSelf, response) });
}
