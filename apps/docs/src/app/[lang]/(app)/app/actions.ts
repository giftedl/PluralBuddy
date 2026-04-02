"use server";

import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { PAlter } from "plurography";

function stripId(obj: any) {
	const { _id, ...ret } = obj;

	return ret;
}

export async function getAvailableAlters({
	skip,
	max = 10,
	search,
}: {
	skip?: number;
	max?: number;
	search?: string;
}): Promise<PAlter[]> {
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
	const alters = db.collection<PAlter>("alters");
	const owner = await getDiscordIdBySessionId(session.user.id);
	const applicationsList = await alters
		.find({
			systemId: owner,
			...(search
				? {
						$or: [
							{ $text: { $search: search, $caseSensitive: false } },
							{ username: { $regex: `^${search}` } },
						],
					}
				: {}),
		})
		.skip(skip ?? 0)
		.limit(max)
		.toArray();

	return applicationsList.map((v) => {
		let { _id, ...c } = v;
		return c;
	});
}

export async function getAlter(id: string): Promise<PAlter> {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) throw new Error("Session error.");

	const client = new MongoClient(process.env.MONGO ?? "");
	await client.connect();

	const db = client.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const alters = db.collection<PAlter>("alters");
	const owner = await getDiscordIdBySessionId(session.user.id);

	return stripId(
		await alters.findOne({ alterId: Number(id), systemId: owner }),
	);
}
