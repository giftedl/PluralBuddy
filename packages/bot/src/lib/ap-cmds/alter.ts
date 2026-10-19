/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { alterCollection, userCollection } from "@/mongodb";
import type { PAutoProxy } from "@/types/auto-proxy";
import { AlertView } from "@/views/alert";
import {
	type CommandContext,
	createStringOption,
	Declare,
	SubCommand,
	Options,
	User,
	IgnoreCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getCorrectLabel } from "../autoproxy-util";

export const alterOptions = {
	alter: createStringOption({
		description: "The alter to automatically proxy.",
		autocomplete: autocompleteAlters,
		required: true,
	}),
	scope: createStringOption({
		description: "Where to use this auto-proxy mode.",
		choices: [
			{ name: "Globally", value: "global" },
			{ name: "Server-wide", value: "server" },
			{ name: "Channel-wide", value: "channels" },
		],
	}),
};

export async function runAlterCommand(
	ctx: CommandContext<typeof alterOptions>,
) {
	await ctx.deferReply(true);
	const { alter: alterName } = ctx.options;

	const systemId = ctx.author.id;
	const query = Number.isNaN(Number.parseInt(alterName))
		? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
		: alterCollection.findOne({
				$or: [{ username: alterName }, { alterId: Number(alterName) }],
				systemId,
			});
	const alter = await query;
	const { system } = await ctx.retrievePUser();

	if (alter === null || system === undefined) {
		return await ctx.editResponse({
			components: new AlertView(await ctx.userTranslations()).errorView(
				"ERROR_ALTER_DOESNT_EXIST",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}

	const guild = await ctx.guild();

	if (guild === undefined) {
		return await ctx.editResponse({
			components: new AlertView(await ctx.userTranslations()).errorView(
				"DN_ERROR_SE",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
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
					"system.systemAutoproxy.$[serverEntry].autoproxyMode": "alter",
					"system.systemAutoproxy.$[serverEntry].autoproxyAlter":
						alter.alterId.toString(),
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
						autoproxyMode: "alter",
						autoproxyAlter: alter.alterId.toString(),
						serverId: label,
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
		"alter",
	);

	return await ctx.editResponse({
		components: new AlertView(await ctx.userTranslations()).successViewCustom(
			(await ctx.userTranslations())[
				ctx.options.scope !== "global"
					? "SET_AUTO_PROXY_SRV"
					: "SET_AUTO_PROXY_GLOBAL"
			]
				.replaceAll(
					"%server_name%",
					(ctx.options.scope ?? "server") !== "server"
						? `<#${ctx.channelId}>`
						: guild.name,
				)
				.replaceAll("%mode%", "alter"),
		),
		flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
	});
}
