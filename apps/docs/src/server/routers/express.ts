import z from "zod";
import { baseProcedure } from "../init";
import { router } from "../trpc";
import { PAlter, PExpressApplication } from "plurography";
import {
	APIApplication,
	OAuth2Scopes,
	RESTPatchCurrentApplicationJSONBody,
} from "discord-api-types/v10";

export const ExpressRouter = router({
	getAllExpressApplications: baseProcedure
		.input(
			z.object({
				skip: z.number().optional(),
				max: z.number().max(50).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			const session = ctx.session;

			if (!session) throw new Error("Session error.");

			const db = ctx.mongo.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const applications = db.collection<PExpressApplication>("applications");
			const alters = db.collection<PAlter>("alters");
			const applicationsList = await applications
				.find({ owner: ctx.userId })
				.skip(input.skip ?? 0)
				.limit(input.max ?? 0)
				.toArray();
			const alterList = await alters
				.find({
					alterId: { $in: applicationsList.map((v) => v.alterId) },
					systemId: ctx.userId,
				})
				.toArray();

			return await Promise.all(
				applicationsList.map(async (v) => {
					const { token, _id, ...c } = v;
					const alter = alterList.find((c) => c.alterId === v.alterId);

					if (alter) {
						const { _id, ...safeAlter } = alter;

						return {
							...c,
							alter: safeAlter,
							usesContainer: c.usesContainer ?? false,
						};
					}

					return { ...c, alter: null, usesContainer: c.usesContainer ?? false };
				}),
			);
		}),
	createExpressApplication: baseProcedure
		.input(
			z.object({
				token: z.string(),
				alterId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const session = ctx.session;

			if (!session) throw new Error("Session error.");

			const db = ctx.mongo.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const applications = db.collection<PExpressApplication>("applications");
			const alters = db.collection<PAlter>("alters");

			const alter = await alters.findOne({
				alterId: Number(input.alterId),
				systemId: ctx.userId,
			});
			const existingApplication = await applications.findOne({
				owner: ctx.userId,
				alterId: Number(input.alterId),
			});

			if (!alter || existingApplication) {
				throw new Error(
					"Not in correct state to create an express application.",
				);
			}

			const res = await fetch("https://discord.com/api/v10/applications/@me", {
				headers: { Authorization: `Bot ${input.token}` },
			});

			if (!res.ok) {
				throw new Error("Invalid token");
			}

			const discordData: APIApplication = await res.json();
			const key = process.env.EXPRESS_DECRYPTION_KEY ?? "";

			const importedKey = await crypto.subtle.importKey(
				"raw",
				// @ts-ignore
				hexToBuffer(key),
				"AES-GCM",
				true,
				["encrypt", "decrypt"],
			);

			const iv = crypto.getRandomValues(new Uint8Array(16));
			const encrypted = await crypto.subtle.encrypt(
				{ name: "AES-GCM", iv },
				importedKey,
				Buffer.from(input.token),
			);

			await applications.insertOne({
				application: discordData.id,
				token: {
					iv: Buffer.from(iv).toString("hex"),
					value: Buffer.from(encrypted).toString("hex"),
				},
				publicKey: discordData.verify_key,
				owner: ctx.userId,
				alterId: Number(input.alterId),
				usesContainer: false,
			});

			await fetch("https://discord.com/api/v10/applications/@me", {
				method: "PATCH",
				headers: {
					Authorization: `Bot ${input.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					interactions_endpoint_url: `${process.env.NEXT_PUBLIC_HOST}/api/v1/express/${discordData.id}`,
					integration_types_config: {
						"0": {
							oauth2_install_params: {
								scopes: [OAuth2Scopes.Bot],
								permissions: "0",
							},
						},
						"1": {
							oauth2_install_params: {
								scopes: [OAuth2Scopes.ApplicationsCommands],
								permissions: "0",
							},
						},
					},
				} satisfies RESTPatchCurrentApplicationJSONBody),
			});

			return {};
		}),

	edit: baseProcedure
		.input(
			z.object({
				alter_id: z.string(),
				options: z.object({
					usesContainer: z.boolean().optional().default(false),
					profileName: z.string().optional()
				}),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const session = ctx.session;

			if (!session) throw new Error("Session error.");

			const db = ctx.mongo.db(
				`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
			);
			const applications = db.collection<PExpressApplication>("applications");
			const application = await applications
				.find({ owner: ctx.userId, alterId: Number(input.alter_id) })
				.toArray();

			if (!application) throw new Error("Doesn't exist");

			if (input.options.profileName === "")
				input.options.profileName = undefined;

			await applications.updateOne(
				{
                    owner: ctx.userId,
					alterId: Number(input.alter_id),
				},
				{
					$set: input.options,
				},
			);

			return { ...application, ...input.options };
		}),
});

function hexToBuffer(hex: string) {
	const arr = new Uint8Array(
		(hex.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)),
	);
	return arr.buffer;
}
