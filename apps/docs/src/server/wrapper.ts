import { SchemaClient } from "@better-auth/oauth-provider";
import { Collection, Db, MongoClient } from "mongodb";
import { unstable_cache } from "next/cache";
import { after, NextRequest, NextResponse } from "next/server";
import { PAlter, PIntegrationFront, PTag, PUser } from "plurography";
import z from "zod";
import { authenticateOAuth } from "@/lib/oauth";
import clientPromise from "./db";

export const getCachedTag = unstable_cache(
	async (id: string, userId: string) => {
		const db = (await clientPromise).db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);

		return db.collection<PTag>("tags").findOne({ tagId: id, systemId: userId });
	},
	["tag"],
	{
		tags: ["tag"],
		revalidate: 3600,
	},
);

export const getCachedAlter = unstable_cache(
	async (id: string, userId: string) => {
		const db = (await clientPromise).db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);

		return db
			.collection<PAlter>("alters")
			.findOne({ alterId: Number(id), systemId: userId });
	},
	["alter"],
	{
		tags: ["alter"],
		revalidate: 3600,
	},
);

type OptionalArray<K> = K | K[];

export type Ctx<Params, SearchParams, BodyResolver extends z.ZodType> = {
		db: MongoClient;
		request: NextRequest;
		urlData: { params: Params; searchParams: SearchParams };
		error: (
			errors: OptionalArray<{
				type: string;
				friendly: string | Record<string, unknown>;
			}>,
			statusCode?: number,
		) => NextResponse;
		respond: <K>(data?: K, statusCode?: number) => NextResponse<K>;

		webDb: Db;
		botDb: Db;
		userCollection: Collection<PUser>;
		alterCollection: Collection<PAlter>;
		tagCollection: Collection<PTag>;
		frontCollection: Collection<PIntegrationFront>;
		oauthClientsCollection: Collection<SchemaClient>;

		body: () => Promise<z.infer<BodyResolver>>;

		fetchUser: () => Promise<PUser | undefined>;
		fetchAlter: (
			query: { systemId: string; alterId: string },
			cache?: boolean,
		) => Promise<PAlter | undefined>;
		fetchTag: (
			query: { systemId: string; tagId: string },
			cache?: boolean,
		) => Promise<PTag | undefined>;

		auth: {
			accountId: string;
			clientId: string;
			scopes: string[];
		};
	};

export function createOAuthFunction<
	Params = unknown,
	BodyResolver extends z.ZodType = z.ZodType,
	SearchParams = unknown,
>(
	options: {
		mustMatchOAuth?: boolean;
		scopes: string[];
		expectSystem?: boolean;
		bodyResolver?: BodyResolver;
	},
	wrapper: (
		ctx: Ctx<Params, SearchParams, BodyResolver>,
	) => Promise<NextResponse | Response>,
) {
	return async (
		request: NextRequest,
		data: { params: Promise<Params>; searchParams: Promise<SearchParams> },
	) => {
		const db = await clientPromise;
		await db.connect();
		
		const oauthResponse = await authenticateOAuth(request, options.scopes, db);
		const [botDb, webDb] = [
			db.db(`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`),
			db.db(`${process.env.ENV}-pluralbuddy-app`),
		];
		let selfUserCache: PUser | null = null;
		let bodyCache: unknown | null = null;

		if ("response" in oauthResponse) return oauthResponse.response;

		const ctx = {
			db,
			request,
			urlData: {
				params: await data.params,
				searchParams: await data.searchParams,
			},
			error: (errors, statusCode) => {
				return NextResponse.json(
					{ errors: "type" in errors ? [errors] : errors },
					{ status: statusCode ?? 400 },
				);
			},
			respond: (data, statusCode) => {
				if (!data) {
					return new NextResponse(null, { status: 204 });
				}

				return NextResponse.json(data, { status: statusCode ?? 200 });
			},

			botDb,
			webDb,
			userCollection: botDb.collection("users"),
			alterCollection: botDb.collection("alters"),
			tagCollection: botDb.collection("tags"),
			frontCollection: botDb.collection("fronts"),

			oauthClientsCollection: webDb.collection("oauthClient"),
			data: () => {},

			fetchUser: async (userId?: string) => {
				const users = botDb.collection<PUser>("users");

				if (!userId && selfUserCache !== null) {
					return selfUserCache;
				}

				if (!userId) {
					const user = await users.findOne({
						userId: oauthResponse.accountId,
					});
					selfUserCache = user;
					return user;
				}

				return await users.findOne({ userId: userId });
			},

			fetchAlter: async (query, cache) => {
				if (cache === true) {
					return await getCachedAlter(query.alterId, query.systemId);
				}

				return await botDb.collection<PAlter>("alters").findOne({
					systemId: query.systemId,
					alterId: Number(query.alterId),
				});
			},
			fetchTag: async (query, cache) => {
				if (cache === true) {
					return await getCachedTag(query.tagId, query.systemId);
				}

				return await botDb.collection<PTag>("tags").findOne(query);
			},

			auth: {
				accountId: oauthResponse.accountId,
				clientId: oauthResponse.clientId,
				scopes: oauthResponse.scopes,
			},
			body: async () => {
				if (options.bodyResolver && bodyCache) {
					return options.bodyResolver.parse(bodyCache);
				}
				if (options.bodyResolver) {
					const data = await request.json();

					bodyCache = data;
					return options.bodyResolver.parse(data);
				}
				if (bodyCache) {
					return bodyCache;
				}
				
				const data = await request.json();
				bodyCache = data;

				return data;
			},
		} as Ctx<Params, SearchParams, BodyResolver>;

		if (options.mustMatchOAuth) {
			if (
				(ctx.urlData.params as { user: string }).user !==
					oauthResponse.accountId &&
				(ctx.urlData.params as { user: string }).user !== "@me"
			) {
				return ctx.error({
					type: "not-matching-oauth",
					friendly:
						"This endpoint requires the user currently logged in via OAuth.",
				});
			}
		}

		try {

		if (options.bodyResolver !== undefined) {
			const data = await request.json();
			const input = options.bodyResolver.safeParse(data);

			bodyCache = data;

			if (input.error) {
				return ctx.error({
					type: "zod",
					friendly: z.treeifyError(input.error),
				});
			}
		}
		} catch (e ) {
			return ctx.error({ type: "no-json", friendly: "There is no JSON to parse here." })
		}

		if (options.expectSystem === true) {
			const user = await ctx.fetchUser();

			if (!user || !user.system)
				return Response.json(
					{
						errors: [
							{
								type: "no-system",
								friendly: "This system doesn't exist.",
							},
						],
					},
					{ status: 400 },
				);
		}

		after(() => db.close());

		return await wrapper(ctx);
	};
}
