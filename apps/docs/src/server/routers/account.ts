import type { OAuthClient } from "@better-auth/oauth-provider";
import { TRPCError } from "@trpc/server";
import { MongoClient, ObjectId } from "mongodb";
import type { Collection } from "mongodb";
import { headers } from "next/headers";
import {
	assetStringGeneration,
	defaultUserStructure,
} from "plurography";
import type {
	PAlter,
	PAlterOperation,
	PExpressApplication,
	PMessage,
	POperation,
	PSystemAccountLinkRequest,
	PTag,
	PUser,
} from "plurography";
import z from "zod";
import { auth } from "@/lib/auth";
import {
	getDiscordIdBySessionId,
	getSystemIdBySessionId,
} from "@/lib/discord-id";
import { baseProcedure, createTRPCRouter } from "../init";
import { deleteS3AssetPrefix } from "../object-storage";

const linkRequestLifetimeMs = 7 * 24 * 60 * 60 * 1000;

async function findSystemUser(
	users: Collection<PUser>,
	accountId: string,
) {
	return (
		(await users.findOne({ userId: accountId, system: { $exists: true } })) ??
		(await users.findOne({ "system.verifiedSubAccounts": accountId }))
	);
}

async function transferSystemOwner(
	client: MongoClient,
	users: Collection<PUser>,
	systemUser: PUser,
	newOwnerId: string,
) {
	const oldOwnerId = systemUser.system?.associatedUserId;
	if (!oldOwnerId || !systemUser.system)
		throw new TRPCError({ code: "NOT_FOUND", message: "System not found." });

	const nextSystem = {
		...systemUser.system,
		associatedUserId: newOwnerId,
		verifiedSubAccounts: (
			systemUser.system.verifiedSubAccounts ?? []
		).filter((id) => id !== newOwnerId),
		subAccounts: (systemUser.system.subAccounts ?? []).filter(
			(id) => id !== oldOwnerId && id !== newOwnerId,
		),
	};
	const session = client.startSession();

	try {
		await session.withTransaction(async () => {
			const targetUser = await users.findOne(
				{ userId: newOwnerId },
				{ session },
			);
			const storagePrefix = systemUser.storagePrefix;
			if (targetUser) {
				await users.updateOne(
					{ userId: newOwnerId },
					{
						$set: {
							system: nextSystem,
							storagePrefix,
						},
					},
					{ session },
				);
			} else {
				await users.insertOne(
					{
						...defaultUserStructure(newOwnerId),
						storagePrefix,
						system: nextSystem,
					},
					{ session },
				);
			}

			await users.updateOne(
				{ userId: oldOwnerId },
				{
					$unset: { system: "" },
					$set: { storagePrefix: assetStringGeneration(8) },
				},
				{ session },
			);

			for (const collectionName of [
				"alters",
				"tags",
				"messages",
				"fronts",
			]) {
				await client
					.db(`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`)
					.collection(collectionName)
					.updateMany(
						{ systemId: oldOwnerId },
						{ $set: { systemId: newOwnerId } },
						{ session },
					);
			}

			const botDb = client.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const alterOperations =
				botDb.collection<PAlterOperation>("alter-operations");
			await alterOperations.updateMany(
				{ "oldAlter.systemId": oldOwnerId },
				{ $set: { "oldAlter.systemId": newOwnerId } },
				{ session },
			);
			await alterOperations.updateMany(
				{ "changedOperation.systemId": oldOwnerId },
				{ $set: { "changedOperation.systemId": newOwnerId } },
				{ session },
			);
			const systemOperations = botDb.collection<POperation>("system-operations");
			await systemOperations.updateMany(
				{ "oldSystem.associatedUserId": oldOwnerId },
				{ $set: { "oldSystem.associatedUserId": newOwnerId } },
				{ session },
			);
			await systemOperations.updateMany(
				{ "changedOperation.associatedUserId": oldOwnerId },
				{ $set: { "changedOperation.associatedUserId": newOwnerId } },
				{ session },
			);
			await client
				.db(`${process.env.ENV}-pluralbuddy-app`)
				.collection<PSystemAccountLinkRequest>("system-account-link-requests")
				.deleteMany({ systemId: oldOwnerId }, { session });
		});
	} finally {
		await session.endSession();
	}
}

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
		const accountId = ctx.discordAccountId;
		const owner = await getSystemIdBySessionId(session.user.id);
		const systemUser = owner
			? await findSystemUser(users, accountId ?? owner)
			: null;

		if (!systemUser || !systemUser.system) return { noSystem: true };

		const systemId = systemUser.system.associatedUserId;
		const webDb = client.db(`${process.env.ENV}-pluralbuddy-app`);
		const requests =
			webDb.collection<PSystemAccountLinkRequest>(
				"system-account-link-requests",
			);
		const now = new Date();
		const [outgoing, incoming] = await Promise.all([
			requests
				.find({ systemId, expiresAt: { $gt: now } })
				.project({
					_id: 0,
					requestId: 1,
					targetAccountId: 1,
					expiresAt: 1,
				})
				.toArray(),
			accountId
				? requests
						.find({ targetAccountId: accountId, expiresAt: { $gt: now } })
						.project({ _id: 0, requestId: 1, systemId: 1, expiresAt: 1 })
						.toArray()
				: [],
		]);

		return {
			username: ctx.session?.user.name,
			systemName: systemUser.system.systemName,
			systemPronouns: systemUser.system.systemPronouns,
			systemOwnerId: systemId,
			linkedAccounts: [
				systemId,
				...(systemUser.system.verifiedSubAccounts ?? []),
			],
			isSystemOwner: accountId === systemId,
			outgoingLinkRequests: outgoing,
			incomingLinkRequests: incoming,
		};
	}),

	getAccountLinkRequests: baseProcedure.query(async ({ ctx }) => {
		const accountId = ctx.discordAccountId;
		if (!accountId) throw new Error("Discord account not found.");

		const client = new MongoClient(process.env.MONGO ?? "");
		await client.connect();
		const requests = client
			.db(`${process.env.ENV}-pluralbuddy-app`)
			.collection<PSystemAccountLinkRequest>("system-account-link-requests");

		return requests
			.find({ targetAccountId: accountId, expiresAt: { $gt: new Date() } })
			.project({ _id: 0, requestId: 1, systemId: 1, expiresAt: 1 })
			.toArray();
	}),

	createAccountLinkRequest: baseProcedure
		.input(z.object({ targetAccountId: z.string().regex(/^\d{17,20}$/) }))
		.mutation(async ({ ctx, input }) => {
			const accountId = ctx.discordAccountId;
			if (!accountId) throw new Error("Discord account not found.");
			if (accountId === input.targetAccountId)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "You cannot link the account you are currently using.",
				});

			const client = new MongoClient(process.env.MONGO ?? "");
			await client.connect();
			const botDb = client.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const users = botDb.collection<PUser>("users");
			const systemUser = await findSystemUser(users, accountId);
			if (!systemUser?.system)
				throw new TRPCError({ code: "NOT_FOUND", message: "No system found." });

			const linkedAccounts =
				systemUser.system.verifiedSubAccounts ?? [];
			if (
				systemUser.system.associatedUserId === input.targetAccountId ||
				linkedAccounts.includes(input.targetAccountId)
			)
				throw new TRPCError({
					code: "CONFLICT",
					message: "This account is already linked to the system.",
				});
			if (linkedAccounts.length >= 2)
				throw new TRPCError({
					code: "CONFLICT",
					message: "A system can have at most three linked Discord accounts.",
				});

			const targetOwnsSystem = await users.findOne({
				$or: [
					{ userId: input.targetAccountId, system: { $exists: true } },
					{ "system.verifiedSubAccounts": input.targetAccountId },
				],
			});
			if (targetOwnsSystem)
				throw new TRPCError({
					code: "CONFLICT",
					message: "That Discord account already belongs to a system.",
				});

			const appDb = client.db(`${process.env.ENV}-pluralbuddy-app`);
			const linkRequests = appDb.collection<PSystemAccountLinkRequest>(
				"system-account-link-requests",
			);
			await linkRequests.createIndex(
				{ systemId: 1, targetAccountId: 1 },
				{ unique: true },
			);
			await linkRequests.createIndex(
				{ expiresAt: 1 },
				{ expireAfterSeconds: 0 },
			);
			const existingRequest = await linkRequests.findOne({
				systemId: systemUser.system.associatedUserId,
				targetAccountId: input.targetAccountId,
			});
			if (existingRequest)
				throw new TRPCError({
					code: "CONFLICT",
					message: "There is already an active invitation for that account.",
				});
			const targetHasAppAccount = await appDb
				.collection("account")
				.findOne({ accountId: input.targetAccountId });
			if (!targetHasAppAccount)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"The other account must sign in to the PluralBuddy web app before you can invite it.",
				});

			const request: PSystemAccountLinkRequest = {
				requestId: crypto.randomUUID(),
				systemId: systemUser.system.associatedUserId,
				targetAccountId: input.targetAccountId,
				requestedBy: accountId,
				createdAt: new Date(),
				expiresAt: new Date(Date.now() + linkRequestLifetimeMs),
			};
			await linkRequests.insertOne(request);

			return { success: true, requestId: request.requestId };
		}),

	respondToAccountLinkRequest: baseProcedure
		.input(
			z.object({
				requestId: z.string().uuid(),
				accept: z.boolean(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const accountId = ctx.discordAccountId;
			if (!accountId) throw new Error("Discord account not found.");

			const client = new MongoClient(process.env.MONGO ?? "");
			await client.connect();
			const appDb = client.db(`${process.env.ENV}-pluralbuddy-app`);
			const requests = appDb.collection<PSystemAccountLinkRequest>(
				"system-account-link-requests",
			);
			const request = await requests.findOne({
				requestId: input.requestId,
				targetAccountId: accountId,
				expiresAt: { $gt: new Date() },
			});
			if (!request)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "This link request is missing or expired.",
				});

			if (input.accept) {
				const users = client
					.db(`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`)
					.collection<PUser>("users");
				const targetOwnsSystem = await users.findOne({
					$or: [
						{ userId: accountId, system: { $exists: true } },
						{ "system.verifiedSubAccounts": accountId },
					],
				});
				if (targetOwnsSystem)
					throw new TRPCError({
						code: "CONFLICT",
						message: "Your Discord account already belongs to a system.",
					});
				const updated = await users.updateOne(
					{
						userId: request.systemId,
						"system.associatedUserId": request.systemId,
						"system.verifiedSubAccounts": { $ne: accountId },
						$expr: {
							$lt: [
								{
									$add: [
										1,
										{
											$size: {
												$ifNull: ["$system.verifiedSubAccounts", []],
											},
										},
									],
								},
								3,
							],
						},
					},
					{
						$addToSet: {
							"system.verifiedSubAccounts": accountId,
							"system.subAccounts": accountId,
						},
					},
				);
				if (updated.matchedCount !== 1)
					throw new TRPCError({
						code: "CONFLICT",
						message:
							"The system is no longer available or has reached its three-account limit.",
					});
			}

			await requests.deleteOne({ requestId: request.requestId });
			return { success: true };
		}),

	unlinkAccount: baseProcedure
		.input(z.object({ accountId: z.string().regex(/^\d{17,20}$/) }))
		.mutation(async ({ ctx, input }) => {
			const currentAccountId = ctx.discordAccountId;
			if (!currentAccountId) throw new Error("Discord account not found.");

			const client = new MongoClient(process.env.MONGO ?? "");
			await client.connect();
			const botDb = client.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const users = botDb.collection<PUser>("users");
			const systemUser = await findSystemUser(users, currentAccountId);
			if (!systemUser?.system)
				throw new TRPCError({ code: "NOT_FOUND", message: "No system found." });

			const ownerId = systemUser.system.associatedUserId;
			const linkedAccounts = systemUser.system.verifiedSubAccounts ?? [];
			const isOwner = currentAccountId === ownerId;
			if (!isOwner && input.accountId !== currentAccountId)
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Linked accounts can only unlink themselves.",
				});
			if (
				input.accountId !== ownerId &&
				!linkedAccounts.includes(input.accountId)
			)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "That account is not linked to this system.",
				});

			if (input.accountId === ownerId) {
				const newOwnerId = linkedAccounts[0];
				if (!newOwnerId)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"The only account cannot unlink itself. Delete the system instead.",
					});
				await transferSystemOwner(client, users, systemUser, newOwnerId);
			} else {
				await users.updateOne(
					{ userId: ownerId },
					{
						$set: {
							"system.verifiedSubAccounts": linkedAccounts.filter(
								(id) => id !== input.accountId,
							),
							"system.subAccounts": (
								systemUser.system.subAccounts ?? []
							).filter((id) => id !== input.accountId),
						},
					},
				);
			}

			await client
				.db(`${process.env.ENV}-pluralbuddy-app`)
				.collection<PSystemAccountLinkRequest>("system-account-link-requests")
				.deleteMany({
					$or: [
						{ systemId: ownerId, targetAccountId: input.accountId },
						{ targetAccountId: input.accountId },
					],
				});
			return { success: true };
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
			const owner = await getSystemIdBySessionId(session.user.id);
			const systemUser = owner ? await users.findOne({ userId: owner }) : null;

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
		const owner = await getSystemIdBySessionId(session.user.id);
		const systemUser = owner ? await users.findOne({ userId: owner }) : null;

		return {
			alterCount: systemUser?.system?.alterIds.length ?? 0,
			tagCount: systemUser?.system?.tagIds.length ?? 0,
			messageCount: owner
				? await messages.countDocuments({ systemId: owner })
				: 0,
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
		const systemUser = await findSystemUser(users, discordId);
		let storagePrefixToDelete =
			(await users.findOne({ userId: discordId }))?.storagePrefix;
		if (systemUser?.system) {
			const ownerId = systemUser.system.associatedUserId;
			const linkedAccounts = systemUser.system.verifiedSubAccounts ?? [];
			if (ownerId === discordId) {
				if (linkedAccounts[0]) {
					await transferSystemOwner(client, users, systemUser, linkedAccounts[0]);
					storagePrefixToDelete = undefined;
				} else {
					storagePrefixToDelete = systemUser.storagePrefix;
				}
			} else {
				await users.updateOne(
					{ userId: ownerId },
					{
						$pull: {
							"system.verifiedSubAccounts": discordId,
							"system.subAccounts": discordId,
						},
					},
				);
			}
		}
		await db
			.collection<PSystemAccountLinkRequest>("system-account-link-requests")
			.deleteMany({
				$or: [
					{ targetAccountId: discordId },
					{ requestedBy: discordId },
				],
			});
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
			if (storagePrefixToDelete)
				await deleteS3AssetPrefix(storagePrefixToDelete);
		} catch (e) {
			console.warn("error while deleting attachments", e);
		}

		return { success: true };
	}),
});
