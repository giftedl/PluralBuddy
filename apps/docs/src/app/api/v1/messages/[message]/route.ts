import { authenticateOAuth, userlessOAuth } from "@/lib/oauth";
import { waitUntil } from "@vercel/functions";
import { MongoClient } from "mongodb";
import { NextRequest } from "next/server";
import { PMessage } from "plurography";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ message: string }> },
) {
	const { message: messageId } = await params;

	const oauthResponse = await userlessOAuth(request, []);

	if ("response" in oauthResponse) return oauthResponse.response;
	const client = new MongoClient(process.env.MONGO ?? "");
	await client.connect();

	const db = client.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const messages = db.collection<PMessage>("messages");
	const message = await messages.findOne({ messageId });

	if (!message) return Response.json({ message: null });

	waitUntil(client.close());
	return Response.json({
		message: {
			...message,
			endpoints: { system: `/api/exchange/users/${message.systemId}/system` },
		},
	});
}
