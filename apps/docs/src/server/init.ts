import { initTRPC } from "@trpc/server";
import { ObjectId } from "mongodb";
import { after } from "next/server";
import superjson from "superjson";
import { auth } from "@/lib/auth";
import clientPromise from "./db";

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await auth.api.getSession({ headers: opts.headers });

	const mongoClient = await clientPromise;
	await mongoClient.connect();

	after(() => mongoClient.close());

	const botDatabase = mongoClient.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const webDatabase = mongoClient.db(`${process.env.ENV}-pluralbuddy-app`);
	let discordAccountId: string | null = null;

	if (session !== null) {
		discordAccountId =
			(
				await webDatabase
					.collection("account")
					.findOne({ userId: new ObjectId(session.user.id) })
			)?.accountId ?? null;
	}

	return { session, mongoClient, discordAccountId, botDatabase, webDatabase };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
	.context<Awaited<ReturnType<typeof createTRPCContext>>>()
	.create({
		transformer: superjson,
	});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
