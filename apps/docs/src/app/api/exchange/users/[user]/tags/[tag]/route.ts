/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { auth } from "@/lib/auth";
import { authenticateOAuth } from "@/lib/oauth";
import { redactAlter, redactTag } from "@/lib/redact";
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";
import { PAlter, PTag } from "plurography";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ user: string; tag: string }> },
) {
	const { user, tag } = await params;

	const oauthResponse = await authenticateOAuth(request, [
		"tags:read",
		"system:admin",
	]);

	if ("response" in oauthResponse) return oauthResponse.response;

	const parsedUserId = user === "@me" ? oauthResponse.accountId : user;
	const db = oauthResponse.mongo.db("pluralbuddy-canary");
	const tagCollection = db.collection<PTag>("tags");
	const isSelf = user === "@me" || user === oauthResponse.accountId;
	const response = await tagCollection.findOne({
		tagId: tag,
		systemId: parsedUserId,
	});

	await oauthResponse.mongo.close();
	return Response.json({ isSelf, data: redactTag(isSelf, response) });
}
