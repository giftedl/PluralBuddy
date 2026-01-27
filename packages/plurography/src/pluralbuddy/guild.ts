/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z, { date } from "zod";

export const defaultPrefixes = {
	canary: ["pbc;", "pbc!"],
	production: ["pb;", "pb!"],
};

export const GuildErrorTypes = z.enum([
	"EnforcedGuildTagRegulation",
	"EnforcedProxyModeRegulation",
	"BotPermissionsRequired",
	"UserPermissionsRequired",
	"FailedLogging",
]);

export enum GuildFlags {
	DISABLE_APP_EXPLAIN = 1 << 0,
	DISABLE_ABOUT = 1 << 1,
	DISABLE_HELP = 1 << 2,
	DISABLE_NUDGING = 1 << 3,
	DISABLE_MESSAGE_INFO = 1 << 4,
	MANDATORY_GUILD_TAG = 1 << 5,
	FORCED_WEBHOOK_MODE = 1 << 6,
	FORCED_NICKNAME_MODE = 1 << 7,
	LOGGING = 1 << 8,
	DISABLE_PERMISSION_CHECK = 1 << 9
}

export const PGuildObject = z
	.object({
		guildId: z.string(),

		/** command prefixes */
		prefixes: z
			.string()
			.array()
			.default(
				defaultPrefixes[
					(process.env.BRANCH as "production" | "canary") ?? "production"
				],
			),

		/** users allowed to use, channels allowed to proxy */
		blacklistedRoles: z.string().array().max(25).default([]),
		blacklistedChannels: z.string().array().max(25).default([]),

		// whitelistedNicknameRoles: z.string().array().default([]),
		// blacklistedNicknameRoles: z.string().array().default([]),

		managerRoles: z.string().array().max(25).default([]),
		allowedAlterModes: z.enum(["webhook", "nickname", "both"]).default("both"),
		flags: z.number().catch(0),
		logChannel: z.string().optional().nullable().catch(undefined),
		proxyDelay: z.number().max(2500).optional().catch(0),

		rolePreferences: z
			.object({
				roleId: z.string(),
				containerContents: z.string().optional().catch(undefined),
				containerLocation: z.enum(["top", "bottom"]).optional().catch(undefined),
				containerColor: z.string().optional().catch(undefined)
			})
			.array()
			.default([]),

		automod: z
			.object({
				enabled: z.boolean(),
				rules: z.string().array(),
				appliedOnce: z
					.enum(["sent-message", "user-joins-server", "both"])
					.optional(),
			})
			.default({
				enabled: false,
				rules: [],
				appliedOnce: "both",
			}),

		errorLog: z
			.object({
				id: z.string(),

				title: z.string(),
				description: z.string(),
				type: GuildErrorTypes,

				responsibleUserId: z.string().optional(),
				responsibleChannelId: z.string().optional(),
				timestamp: z.coerce.date(),
			})
			.array()
			.default([])
			.catch([]),
	})
	.transform((data) => ({
		...data,
		getFeatures: () => ({
			requiresGuildTag: (data.flags & GuildFlags.MANDATORY_GUILD_TAG) !== 0,
			forcedWebhookMode: (data.flags & GuildFlags.FORCED_WEBHOOK_MODE) !== 0,
			forcedNicknameMode: (data.flags & GuildFlags.FORCED_NICKNAME_MODE) !== 0,
			disabledAppExplain: (data.flags & GuildFlags.DISABLE_APP_EXPLAIN) !== 0,
			disabledAbout: (data.flags & GuildFlags.DISABLE_ABOUT) !== 0,
			disabledHelp: (data.flags & GuildFlags.DISABLE_HELP) !== 0,
			disabledNudging: (data.flags & GuildFlags.DISABLE_NUDGING) !== 0,
			disabledMessageInfo: (data.flags & GuildFlags.DISABLE_MESSAGE_INFO) !== 0,
			disabledPermissionCheck: (data.flags & GuildFlags.DISABLE_PERMISSION_CHECK) !== 0,
			logging: (data.flags & GuildFlags.LOGGING) !== 0,

			has: (flag: GuildFlags) => (data.flags & flag) !== 0,
			disable: (flag: GuildFlags) =>
				(data.flags & flag) ===
				0 /* doesn't have flag */
					? data.flags
					: data.flags - flag,
			enable: (flag: GuildFlags) =>
				(data.flags & flag) !== 0 /* does have flag */
					? data.flags
					: data.flags + flag,
			bool: (flag: GuildFlags, bool?: boolean) =>
				bool
					? (data.flags & flag) !==
						0 /* does have flag */
						? data.flags
						: data.flags + flag
					: (data.flags & flag) ===
							0 /* doesn't have flag */
						? data.flags
						: data.flags - flag,
		}),
	}));

export const PGuildErrorObject = z.object({
	id: z.string(),

	title: z.string(),
	description: z.string(),
	type: GuildErrorTypes,

	responsibleUserId: z.string().optional(),
	responsibleChannelId: z.string().optional(),
	responsibleGuildId: z.string(),

	createdAt: z.coerce.date(),
});

export type PGuild = z.infer<typeof PGuildObject>;
export type PGuildError = z.infer<typeof PGuildErrorObject>;

export const defaultGuildStructure = (guildId: string) => {
	return PGuildObject.parse({ guildId });
};
