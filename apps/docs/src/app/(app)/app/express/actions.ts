"use server";

import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
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
		throw new Error("Only 50 at a time can be fetched")
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
		.find({ alterId: { $in: applicationsList.map((v) => v.alterId) }, systemId: owner })
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