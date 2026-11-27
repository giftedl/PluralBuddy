import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { MongoClient } from "mongodb";
import { PUser } from "plurography";
import { getSystemIdBySessionId } from "@/lib/discord-id";
import { APIUser } from "discord-api-types/v10";
import { DiscordSnowflake } from "@sapphire/snowflake";

export const SocialRouter = createTRPCRouter({
	getSocialSettings: baseProcedure.query(async ({ ctx }) => {
		const session = ctx.session;

		if (!session) throw new Error("Session error.");

		const client = new MongoClient(process.env.MONGO ?? "");
		await client.connect();

		const db = client.db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);
		const users = db.collection<PUser>("users");
		const owner = await getSystemIdBySessionId(session.user.id);
		const systemUser = await users.findOne({ userId: owner });

		if (!systemUser || !systemUser.system) return { noSystem: true };

		return {
			nudging: systemUser.nudging ?? {
				blockedUsers: [],
				currentlyEnabled: true,
				dmReply: false,
			},
			systemPrivacy: systemUser.system?.public,
		};
	}),

	getUser: baseProcedure
		.input(
			z.object({
				userId: z.string().refine(c => DiscordSnowflake.deconstruct(c).workerId !== BigInt(0)),
			}),
		)
		.query(async ({ ctx, input }) => {
			const session = ctx.session;

			if (!session) throw new Error("Session error.");

			return (await (
				await fetch(`https://discord.com/api/v10/users/${input.userId}`, {
					headers: {
						Authorization: `Bot ${process.env.PFP_FETCHER}`,
						Accept: "application/json",
					},
				})
			).json()) as APIUser;
		}),

	updateNudgingSettings: baseProcedure
		.input(
			z.object({
				nudgingEnabled: z.boolean().optional(),
				dmReplied: z.boolean().optional(),
				blockedUsers: z
					.string()
					.max(20)
					.refine(c => DiscordSnowflake.deconstruct(c).workerId !== BigInt(0))
					.array()
					.optional(),
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
			const systemUser = await users.findOne({ userId: owner });

			if (!systemUser || !systemUser.system) return { noSystem: true };

			let editObject: Record<string, boolean | string[]> = {};

			if (input.nudgingEnabled !== undefined)
				editObject["nudging.currentlyEnabled"] = input.nudgingEnabled;

			if (input.dmReplied !== undefined) editObject["nudging.dmReply"] = input.dmReplied;

			if (input.blockedUsers !== undefined)
				editObject["nudging.blockedUsers"] = input.blockedUsers;

			await users.updateOne(
				{
					userId: owner,
				},
				{
					$set: editObject,
				},
			);

			return { success: true };
		}),

	updateSystemPrivacy: baseProcedure
		.input(z.number().max(255))
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
			const systemUser = await users.findOne({ userId: owner });

			if (!systemUser || !systemUser.system) return { noSystem: true };
			
			await users.updateOne({
				userId: owner
			}, {
				$set: {
					"system.public": input
				}
			})

			return { success: true }
		}),
});
