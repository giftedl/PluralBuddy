import { OAuthClient } from "@better-auth/oauth-provider";
import { MongoClient, ObjectId } from "mongodb";
import { headers } from "next/headers";
import {
	PAlter,
	PAlterOperation,
	PExpressApplication,
	PMessage,
	POperation,
	PTag,
	PUser,
} from "plurography";
import z from "zod";
import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { baseProcedure, createTRPCRouter } from "../init";
import { deleteS3AssetPrefix } from "../object-storage";

export const AccountRouter = createTRPCRouter({
	getAccountSettings: baseProcedure.query(async ({ ctx }) => {
		const session = ctx.session;

		if (!session) throw new Error("Session error.");

		const client = new MongoClient(process.env.MONGO ?? "");
		await client.connect();

		const db = client.db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);
		const users = db.collection<PUser>("users");
		const owner = await getDiscordIdBySessionId(session.user.id);
		const systemUser = await users.findOne({ userId: owner });

		if (!systemUser || !systemUser.system) return { noSystem: true };

		return {
			username: ctx.session?.user.name,
			systemName: systemUser.system.systemName,
			systemPronouns: systemUser.system.systemPronouns,
		};
	}),

	updateAccountSettings: baseProcedure
		.input(
			z.object({
				systemName: z.string().max(100).min(1),
				systemPronouns: z.string().max(100).min(1).optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const session = ctx.session;

			if (!session) throw new Error("Session error.");

			const client = new MongoClient(process.env.MONGO ?? "");
			await client.connect();

			const db = client.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const users = db.collection<PUser>("users");
			const owner = await getDiscordIdBySessionId(session.user.id);
			const systemUser = await users.findOne({ userId: owner });

			if (!systemUser || !systemUser.system) return { noSystem: true };

			await users.updateOne(
				{
					userId: owner,
				},
				{
					$set: {
						"system.systemName": input.systemName,
						"system.systemPronouns": input.systemPronouns,
					},
				},
			);

			return { success: true };
		}),

	destructiveStats: baseProcedure.query(async ({ ctx }) => {
		const session = ctx.session;

		if (!session) throw new Error("Session error.");

		const client = new MongoClient(process.env.MONGO ?? "");
		await client.connect();

		const db = client.db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);
		const users = db.collection<PUser>("users");
		const messages = db.collection<PMessage>("messages");
		const owner = await getDiscordIdBySessionId(session.user.id);
		const systemUser = await users.findOne({ userId: owner });

		return {
			alterCount: systemUser?.system?.alterIds.length ?? 0,
			tagCount: systemUser?.system?.tagIds.length ?? 0,
			messageCount: await messages.countDocuments({ systemId: owner }),
			oauthClients:
				(
					await auth.api.getOAuthClients({
						headers: await headers(),
					})
				)?.length ?? 0,
		};
	}),

	deleteAccount: baseProcedure.mutation(async ({ ctx }) => {
		const session = ctx.session;

		if (!session) throw new Error("Session error.");

		const client = new MongoClient(process.env.MONGO ?? "");
		await client.connect();
		const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
		const pb = client.db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);
		const discordId = await getDiscordIdBySessionId(session.user.id);

		const accounts = db.collection("account");
		const oauthClient = db.collection("oauthClient");
		const oauthConsent = db.collection("oauthConsent");
		const oauthAccessToken = db.collection("oauthAccessToken");
		const oauthRefreshToken = db.collection("oauthRefreshToken");
		const sessions = db.collection("session");
		const user = db.collection("user");

		const users = pb.collection<PUser>("users");
		const systemUser = await users.findOne({ userId: discordId });
		const alterOperations = pb.collection<PAlterOperation>("alter-operations");
		const systemOperations = pb.collection<POperation>("system-operations");
		const alters = pb.collection<PAlter>("alters");
		const tags = pb.collection<PTag>("tags");
		const messages = pb.collection<PMessage>("messages");
		const apps = pb.collection<PExpressApplication>("applications");

		await Promise.allSettled([
			accounts.deleteOne({ userId: new ObjectId(session.user.id) }),
			oauthClient.deleteMany({ userId: new ObjectId(session.user.id) }),
			oauthConsent.deleteMany({ userId: new ObjectId(session.user.id) }),
			sessions.deleteMany({ userId: new ObjectId(session.user.id) }),
			user.deleteOne({ _id: new ObjectId(session.user.id) }),
			oauthAccessToken.deleteMany({ userId: new ObjectId(session.user.id) }),
			oauthRefreshToken.deleteMany({ userId: new ObjectId(session.user.id) }),
			users.deleteOne({ userId: discordId }),
			alterOperations.deleteMany({ "oldAlter.systemId": discordId }),
			alters.deleteMany({ systemId: discordId }),
			tags.deleteMany({ systemId: discordId }),
			messages.deleteMany({ systemId: discordId }),
			apps.deleteMany({ owner: discordId }),
			systemOperations.deleteMany({ "oldSystem.associatedUserId": discordId }),
		]);

		try {
			if (systemUser?.storagePrefix)
				await deleteS3AssetPrefix(systemUser?.storagePrefix);
		} catch (e) {
			console.warn("error while deleting attachments", e);
		}

		return { success: true };
	}),
});
