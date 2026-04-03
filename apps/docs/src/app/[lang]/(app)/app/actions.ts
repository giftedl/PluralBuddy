"use server";

import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { PAlter, PExpressApplication } from "plurography";

function stripId(obj: any) {
	if (!obj) return null;

	let { _id, ...ret } = obj;

	if (ret.token) {
		const { token, ...newo } = ret;

		ret = newo;
	}

	return ret;
}

type Expressified<T> = T & { isExpressified: boolean };

export async function getAvailableAlters({
	skip,
	max = 10,
	search,
}: {
	skip?: number;
	max?: number;
	search?: string;
}): Promise<Expressified<PAlter>[]> {
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
	const applications = db.collection<PAlter>("applications");
	const owner = await getDiscordIdBySessionId(session.user.id);
	const altersList = await alters
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
	const applicationsList = await applications
		.find({ alterId: { $in: altersList.map((v) => v.alterId) } })
		.toArray();

	return altersList.map((v) => {
		let { _id, ...c } = v;
		return {
			...c,
			isExpressified: applicationsList.some((v) => v.alterId === c.alterId),
		};
	});
}

export async function getAlter(id: string): Promise<(PAlter & { express: PExpressApplication | null }) | null> {
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
	const applications = db.collection<PExpressApplication>("applications");
	const owner = await getDiscordIdBySessionId(session.user.id);
	const alter = await alters.findOne({ alterId: Number(id), systemId: owner });

	if (!alter)
		return null;

	return {
		...stripId(alter),
		express:
			stripId(
				await applications.findOne({ alterId: Number(id), owner: owner }),
			) ?? null,
	};
}
