import { auth } from "@/lib/auth";
import { initTRPC } from "@trpc/server";
import superjson from 'superjson';
import {getDiscordIdBySessionId} from "@/lib/discord-id";
import {MongoClient} from "mongodb";
import {waitUntil} from "@vercel/functions";
import {after} from "next/server";

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await auth.api.getSession({ headers: opts.headers });
    const mongo = await new MongoClient(process.env.MONGO ?? "").connect();
    const userId = session ? await getDiscordIdBySessionId(session.user.id, mongo) : null;

    after(async () => { await mongo.close() })
	return { session, userId, mongo };
};

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC
	.context<Awaited<ReturnType<typeof createTRPCContext>>>()
	.create({
        transformer: superjson
	});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
