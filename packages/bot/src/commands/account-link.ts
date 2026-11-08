import { client } from "@/index";
import { mongoClient, userCollection } from "@/mongodb";
import {
	assetStringGeneration,
	defaultUserStructure,
	type PAlterOperation,
	type POperation,
	type PSystemAccountLinkRequest,
	type PUser,
} from "plurography";
import {
	Command,
	createStringOption,
	createUserOption,
	Declare,
	Options,
	type CommandContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	action: createStringOption({
		description: "What to do with linked Discord accounts.",
		required: true,
		choices: [
			{ name: "Invite an account", value: "request" },
			{ name: "Accept an invitation", value: "accept" },
			{ name: "Decline an invitation", value: "decline" },
			{ name: "List linked accounts", value: "list" },
			{ name: "Unlink this account", value: "unlink" },
		],
	}),
	"account-id": createUserOption({
		description: "Account to invite, or the owner who invited you.",
		required: false,
	}),
};

async function transferSystemOwner(
	oldOwner: PUser,
	newOwnerId: string,
): Promise<void> {
	const oldOwnerId = oldOwner.system?.associatedUserId;
	if (!oldOwnerId || !oldOwner.system) {
		throw new Error("Cannot transfer ownership without an existing system.");
	}

	const nextSystem = {
		...oldOwner.system,
		associatedUserId: newOwnerId,
		verifiedSubAccounts: (oldOwner.system.verifiedSubAccounts ?? []).filter(
			(id) => id !== newOwnerId,
		),
		subAccounts: (oldOwner.system.subAccounts ?? []).filter(
			(id) => id !== oldOwnerId && id !== newOwnerId,
		),
	};
	const session = mongoClient.startSession();

	try {
		await session.withTransaction(async () => {
			const currentOwner = await userCollection.findOne(
				{
					userId: oldOwnerId,
					"system.associatedUserId": oldOwnerId,
					"system.verifiedSubAccounts": newOwnerId,
				},
				{ session },
			);
			if (!currentOwner?.system) {
				throw new Error("System ownership changed before transfer.");
			}

			const targetUser = await userCollection.findOne(
				{ userId: newOwnerId },
				{ session },
			);
			if (targetUser) {
				await userCollection.updateOne(
					{ userId: newOwnerId },
					{
						$set: {
							system: nextSystem,
							storagePrefix: oldOwner.storagePrefix,
						},
					},
					{ session },
				);
			} else {
				await userCollection.insertOne(
					{
						...defaultUserStructure(newOwnerId),
						storagePrefix: oldOwner.storagePrefix,
						system: nextSystem,
					},
					{ session },
				);
			}

			await userCollection.updateOne(
				{ userId: oldOwnerId },
				{
					$unset: { system: "" },
					$set: { storagePrefix: assetStringGeneration(8) },
				},
				{ session },
			);

			const systemDatabase = mongoClient.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			for (const collectionName of ["alters", "tags", "messages", "fronts"]) {
				await systemDatabase
					.collection(collectionName)
					.updateMany(
						{ systemId: oldOwnerId },
						{ $set: { systemId: newOwnerId } },
						{ session },
					);
			}

			const alterOperations =
				systemDatabase.collection<PAlterOperation>("alter-operations");
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

			const systemOperations =
				systemDatabase.collection<POperation>("system-operations");
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

			await mongoClient
				.db(`${process.env.ENV}-pluralbuddy-app`)
				.collection<PSystemAccountLinkRequest>("system-account-link-requests")
				.deleteMany({ systemId: oldOwnerId }, { session });
		});
	} finally {
		await session.endSession();
	}
}

@Declare({
	name: "account-link",
	description: "Manage Discord accounts linked to your system",
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class AccountLinkCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);

		const { action, "account-id": selectedAccount } = ctx.options;
		const accountId = selectedAccount?.id;
		const user = await ctx.retrievePUser();
		const system = user.system;
		if (!system && action !== "accept" && action !== "decline") {
			return ctx.editResponse({
				content: "You need a system before you can link accounts.",
				flags: MessageFlags.Ephemeral,
			});
		}

		const ownerId = system?.associatedUserId ?? "";
		const linkedAccounts = system?.verifiedSubAccounts ?? [];
		const isLinked =
			system !== undefined &&
			(ctx.author.id === ownerId || linkedAccounts.includes(ctx.author.id));
		if (!isLinked && action !== "accept" && action !== "decline") {
			return ctx.editResponse({
				content: "This Discord account is not linked to that system.",
				flags: MessageFlags.Ephemeral,
			});
		}

		const requests = mongoClient
			.db(`${process.env.ENV}-pluralbuddy-app`)
			.collection<PSystemAccountLinkRequest>("system-account-link-requests");

		if (action === "list") {
			const pending = await requests
				.find({ systemId: ownerId, expiresAt: { $gt: new Date() } })
				.toArray();
			return ctx.editResponse({
				content: [
					`Owner: ${ownerId}`,
					`Linked accounts: ${linkedAccounts.join(", ") || "none"}`,
					`Pending requests: ${pending.map((request) => request.targetAccountId).join(", ") || "none"}`,
				].join("\n"),
				flags: MessageFlags.Ephemeral,
			});
		}

		if (action === "unlink") {
			if (ctx.author.id === ownerId) {
				const newOwnerId = linkedAccounts[0];
				if (!newOwnerId) {
					return ctx.editResponse({
						content:
							"The only account cannot unlink itself. Delete the system instead.",
						flags: MessageFlags.Ephemeral,
					});
				}
				await transferSystemOwner(user, newOwnerId);
			} else {
				const updated = await userCollection.updateOne(
					{
						userId: ownerId,
						"system.verifiedSubAccounts": ctx.author.id,
					},
					{
						$pull: {
							"system.verifiedSubAccounts": ctx.author.id,
							"system.subAccounts": ctx.author.id,
						},
					},
				);
				if (updated.matchedCount !== 1) {
					return ctx.editResponse({
						content: "This account is no longer linked to that system.",
						flags: MessageFlags.Ephemeral,
					});
				}
				await requests.deleteMany({
					systemId: ownerId,
					targetAccountId: ctx.author.id,
				});
			}
			return ctx.editResponse({
				content:
					ctx.author.id === ownerId
						? `System ownership transferred to ${linkedAccounts[0]}.`
						: "Your Discord account has been unlinked from the system.",
				flags: MessageFlags.Ephemeral,
			});
		}

		if (action === "request") {
			if (!accountId || !/^\d{17,20}$/.test(accountId)) {
				return ctx.editResponse({
					content: "Provide a valid Discord account ID to invite.",
					flags: MessageFlags.Ephemeral,
				});
			}
			if (
				accountId === ctx.author.id ||
				accountId === ownerId ||
				linkedAccounts.includes(accountId)
			) {
				return ctx.editResponse({
					content: "That account is already part of this system.",
					flags: MessageFlags.Ephemeral,
				});
			}
			if (linkedAccounts.length >= 2) {
				return ctx.editResponse({
					content: "A system can have at most three linked Discord accounts.",
					flags: MessageFlags.Ephemeral,
				});
			}
			await requests.createIndex(
				{ systemId: 1, targetAccountId: 1 },
				{ unique: true },
			);
			await requests.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
			await requests.deleteMany({
				systemId: ownerId,
				targetAccountId: accountId,
				expiresAt: { $lte: new Date() },
			});
			const existingRequest = await requests.findOne({
				systemId: ownerId,
				targetAccountId: accountId,
			});
			if (existingRequest) {
				return ctx.editResponse({
					content: "There is already an active invitation for that account.",
					flags: MessageFlags.Ephemeral,
				});
			}
			const targetOwnsSystem = await userCollection.findOne({
				$or: [
					{ userId: accountId, system: { $exists: true } },
					{ "system.verifiedSubAccounts": accountId },
				],
			});
			if (targetOwnsSystem) {
				return ctx.editResponse({
					content: "That account already belongs to a system.",
					flags: MessageFlags.Ephemeral,
				});
			}

			const request: PSystemAccountLinkRequest = {
				requestId: crypto.randomUUID(),
				systemId: ownerId,
				targetAccountId: accountId,
				requestedBy: ctx.author.id,
				createdAt: new Date(),
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			};
			await requests.insertOne(request);

			let notified = true;
			try {
				const recipient = await client.users.fetch(accountId, true);
				await recipient.write({
					content:
						`A PluralBuddy system (${ownerId}) invited you to link accounts. ` +
						"Review it in the PluralBuddy account settings page.",
				});
			} catch (error) {
				notified = false;
				console.warn("Could not send account link invitation DM:", error);
			}

			return ctx.editResponse({
				content: notified
					? "Invitation sent. The other account must accept it."
					: "Invitation created, but Discord did not allow a DM. The other account can accept it in PluralBuddy account settings.",
				flags: MessageFlags.Ephemeral,
			});
		}

		if (action === "accept" || action === "decline") {
			if (!accountId || !/^\d{17,20}$/.test(accountId)) {
				return ctx.editResponse({
					content: "Provide the inviting system owner's Discord account ID.",
					flags: MessageFlags.Ephemeral,
				});
			}
			const request = await requests.findOne({
				systemId: accountId,
				targetAccountId: ctx.author.id,
				expiresAt: { $gt: new Date() },
			});
			if (!request) {
				return ctx.editResponse({
					content: "There is no active invitation from that account.",
					flags: MessageFlags.Ephemeral,
				});
			}
			if (action === "accept") {
				const targetOwnsSystem = await userCollection.findOne({
					$or: [
						{ userId: ctx.author.id, system: { $exists: true } },
						{ "system.verifiedSubAccounts": ctx.author.id },
					],
				});
				if (targetOwnsSystem) {
					return ctx.editResponse({
						content: "Your account already belongs to a system.",
						flags: MessageFlags.Ephemeral,
					});
				}
				const updated = await userCollection.updateOne(
					{
						userId: accountId,
						"system.associatedUserId": accountId,
						"system.verifiedSubAccounts": { $ne: ctx.author.id },
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
							"system.verifiedSubAccounts": ctx.author.id,
							"system.subAccounts": ctx.author.id,
						},
					},
				);
				if (updated.matchedCount !== 1) {
					return ctx.editResponse({
						content:
							"The system is no longer available or has reached its three-account limit.",
						flags: MessageFlags.Ephemeral,
					});
				}
			}

			await requests.deleteOne({ requestId: request.requestId });
			return ctx.editResponse({
				content:
					action === "accept"
						? `Your account is now linked to system ${accountId}.`
						: "Invitation declined.",
				flags: MessageFlags.Ephemeral,
			});
		}

		return ctx.editResponse({
			content: "Choose request, accept, decline, list, or unlink.",
			flags: MessageFlags.Ephemeral,
		});
	}
}
