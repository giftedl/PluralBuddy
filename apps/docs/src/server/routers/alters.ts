import z from "zod";
import { baseProcedure } from "../init";
import { router } from "../trpc";
import { MongoClient } from "mongodb";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { PAlter, PExpressApplication } from "plurography";
import { APIApplication, APIUser } from "discord-api-types/v10";
import { decryptExpressToken } from "@/lib/express-token-encryption";
import { stripId } from "../util";

export const AlterRouter = router({
	getAvailableAlters: baseProcedure
		.input(
			z.object({
				skip: z.number().optional(),
				max: z.number().max(50).default(10),
				search: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
            const session = ctx.session;

			if (!session) throw new Error("Session error.");

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
					...(input.search
						? {
								$or: [
									{ $text: { $search: input.search, $caseSensitive: false } },
									{ username: { $regex: `^${input.search}` } },
								],
							}
						: {}),
				})
				.skip(input.skip ?? 0)
				.limit(input.max)
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
		}),
    getAlter: baseProcedure.input(z.object({ id: z.string(), with_app_data: z.boolean().default(false) })).query(async ({ ctx, input }) => {

        const session = ctx.session;

        if (!session) throw new Error("Session error.");

        const client = new MongoClient(process.env.MONGO ?? "");
        await client.connect();
    
        const db = client.db(
            `pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
        );
        const alters = db.collection<PAlter>("alters");
        const applications = db.collection<PExpressApplication>("applications");
        const owner = await getDiscordIdBySessionId(session.user.id);
        const alter = await alters.findOne({ alterId: Number(input.id), systemId: owner });
    
        if (!alter) return null;
    
        const expressData =
            (await applications.findOne({ alterId: Number(input.id), owner: owner })) ?? null;
    
        let discordUser: APIUser | undefined;
        let discordApp: APIApplication | undefined;
    
        if (input.with_app_data && expressData !== null) {
            const botToken = await decryptExpressToken(
                expressData.token.iv,
                expressData.token.value,
            );
    
            discordUser = await (
                await fetch("https://discord.com/api/v10/users/@me", {
                    headers: {
                        Authorization: `Bot ${botToken}`,
                    },
                })
            ).json();
    
            discordApp = await (
                await fetch("https://discord.com/api/v10/applications/@me", {
                    headers: {
                        Authorization: `Bot ${botToken}`,
                    },
                })
            ).json();
        }
    
        return {
            ...stripId(alter),
            express: {...(stripId(expressData) ?? null), usesContainer: expressData?.usesContainer ?? false},
            user: discordUser,
            application: discordApp,
        };
    })
});
