"use server";

import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { APIApplication, RESTGetAPICurrentUserResult } from "discord-api-types/v10";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { PAlter, PExpressApplication } from "plurography";

export async function getAllExpressApplications(
	skip?: number,
	max: number = 0,
): Promise<Omit<PExpressApplication, "token">[]> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) throw new Error("Session error.");

	if (max > 50) {
		throw new Error("Only 50 at a time can be fetched");
	}

	const client = new MongoClient(process.env.MONGO ?? "");
	await client.connect();

	const db = client.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const applications = db.collection<PExpressApplication>("applications");
	const alters = db.collection<PAlter>("alters");
	const owner = await getDiscordIdBySessionId(session.user.id);
	const applicationsList = await applications
		.find({ owner })
		.skip(skip ?? 0)
		.limit(max ?? 0)
		.toArray();
	const alterList = await alters
		.find({
			alterId: { $in: applicationsList.map((v) => v.alterId) },
			systemId: owner,
		})
		.toArray();

	return await Promise.all(
		applicationsList.map(async (v) => {
			const { token, _id, ...c } = v;
			const alter = alterList.find((c) => c.alterId === v.alterId);

			if (alter) {
				const { _id, ...safeAlter } = alter;

				return { ...c, alter: safeAlter };
			}

			return { ...c, alter: null };
		}),
	);
}

export async function createExpressApplication(data: {
	token: string;
	alterId: string;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) throw new Error("Session error.");

	const client = new MongoClient(process.env.MONGO ?? "");
	await client.connect();

	const db = client.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const applications = db.collection<PExpressApplication>("applications");
	const alters = db.collection<PAlter>("alters");

	const owner = await getDiscordIdBySessionId(session.user.id);

	const alter = await alters.findOne({
		alterId: Number(data.alterId),
		systemId: owner,
	});
	const existingApplication = await applications
		.findOne({ owner, alterId: Number(data.alterId) });

	if (!alter || existingApplication) {
		throw new Error("Not in correct state to create an express application.");
	}

	
	const res = await fetch("https://discord.com/api/v10/applications/@me", { headers: { Authorization: `Bot ${data.token}`}});

	if (!res.ok) {
		throw new Error("Invalid token")
	}

	const discordData: APIApplication = await res.json();
	const key = process.env.EXPRESS_DECRYPTION_KEY ?? "";

	const importedKey = await crypto.subtle.importKey(
		"raw",
		Uint8Array.fromHex(key),
		"AES-GCM",
		true,
		["encrypt", "decrypt"],
	);

	const iv = crypto.getRandomValues(new Uint8Array(16));
	const encrypted = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv },
		importedKey,
		Buffer.from(data.token),
	);

	applications.insertOne({
		application: discordData.id,
		token: {
			iv: Buffer.from(iv).toString("hex"),
			value: Buffer.from(encrypted).toString("hex"),
		},
		publicKey: discordData.verify_key,
		owner,
		alterId: Number(data.alterId),
	});

	return {};
}
