import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { getOAuthConsents } from "@/lib/oauth";
import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import type { PAutoProxy } from "plurography";
import {
	type CommandContext,
	Container,
	createStringOption,
	Declare,
	IgnoreCommand,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getCorrectLabel } from "../autoproxy-util";

export const customOptions = {
	provider: createStringOption({
		description: "Integration used as auto-proxy mode.",
		required: true,
		autocomplete: async (ctx) => {
			const oauthConsents = await getOAuthConsents(ctx.user.id);
			const focus = ctx.getInput();

			return ctx.respond(
				oauthConsents
					.filter(
						(ch) =>
							(ch.metadata?.aaid ?? "").includes(focus) ||
							ch.name?.includes(focus) ||
							ch.clientId === focus,
					)
					.map((ch) => ({
						name: `${ch.name} - ${ch.metadata?.aaid} (AI/AP ID)`,
						value: ch.clientId,
					})),
			);
		},
	}),
	scope: createStringOption({
		description: "Where to use this auto-proxy mode. Default server-wide.",
		choices: [
			{ name: "Globally", value: "global" },
			{ name: "Server-wide", value: "server" },
			{ name: "Channel-wide", value: "channels" },
		],
	}),
};

export async function runCustomProviderCommand(
	ctx: CommandContext<typeof customOptions>,
) {
	await ctx.deferReply(true);

	const guild = await ctx.guild();

	if (guild === undefined) {
		return await ctx.editResponse({
			components: new AlertView(await ctx.userTranslations()).errorView(
				"DN_ERROR_SE",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}

	const { system } = await ctx.retrievePUser();

	if (system === undefined) {
		return await ctx.editResponse({
			components: new AlertView(await ctx.userTranslations()).errorView(
				"ERROR_ALTER_DOESNT_EXIST",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}

	const { provider } = ctx.options;
	const translations = await ctx.userTranslations();
	const oauthConsents = await getOAuthConsents(ctx.author.id);
	const providerApp = oauthConsents.find((v) => v.clientId === provider);

	if (
		!providerApp ||
		!providerApp.scopes.includes("system:ai-ap") ||
		!providerApp.metadata
	) {
		return await ctx.editResponse({
			components: [
				...new AlertView(translations).errorViewCustom(
					translations.PROVIDER_NOT_FOUND.replace("{{ id }}", provider),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}

	const label = getCorrectLabel(
		(ctx.options.scope as "server" | "global" | "channels") ?? "server",
		guild.id,
		ctx.channelId,
	);
	const existingGuildPolicies = system.systemAutoproxy.some(
		(ap) => ap.serverId === label,
	);

	if (existingGuildPolicies) {
		await userCollection.updateOne(
			{ userId: system.associatedUserId },
			{
				$set: {
					"system.systemAutoproxy.$[serverEntry].autoproxyMode":
						providerApp.metadata.aaid,
					"system.systemAutoproxy.$[serverEntry].autoproxyAlter": undefined,
				},
			},
			{
				arrayFilters: [{ "serverEntry.serverId": label }],
			},
		);
	} else {
		// Append a new mapping to the nameMap array
		await userCollection.updateOne(
			{ userId: system.associatedUserId },
			{
				$push: {
					"system.systemAutoproxy": {
						autoproxyMode: providerApp.metadata.aaid,
						autoproxyAlter: undefined,
						serverId: ctx.guildId,
					} satisfies Partial<PAutoProxy>,
				},
			},
		);
	}

	await sendAutoproxyOperationDM(
		system,
		guild,
		await ctx.userTranslations(),
		"discord",
		providerApp.metadata.aaid,
	);

	return await ctx.editResponse({
		components: new AlertView(await ctx.userTranslations()).successViewCustom(
			(await ctx.userTranslations())[
				ctx.options.scope !== "global"
					? "SET_AUTO_PROXY_CUSTOM"
					: "SET_AUTO_PROXY_CUSTOM_GLOBAL"
			]
				.replaceAll(
					"%server_name%",
					(ctx.options.scope ?? "server") !== "server"
						? `<#${ctx.channelId}>`
						: guild.name,
				)
				.replaceAll("%app%", providerApp.name ?? providerApp.metadata.aaid),
		),
		flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
	});
}
