/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { userCollection } from "@/mongodb";
import type { PAutoProxy } from "@/types/auto-proxy";
import { AlertView } from "@/views/alert";
import {
	type CommandContext,
	createStringOption,
	Declare,
	IgnoreCommand,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getCorrectLabel } from "../autoproxy-util";

export const offOptions = {
	scope: createStringOption({
		description: "Where to use this auto-proxy mode. Default server-wide.",
		choices: [
			{ name: "Globally", value: "global" },
			{ name: "Server-wide", value: "server" },
			{ name: "Channel-wide", value: "channels" },
			{ name: "Everything - disable ALL auto-proxy", value: "everything" },
		],
	}),
};

export async function runOffCommand(ctx: CommandContext<typeof offOptions>) {
	await ctx.deferReply(true);

	const { system } = await ctx.retrievePUser();

	if (system === undefined) {
		return await ctx.editResponse({
			components: new AlertView(await ctx.userTranslations()).errorView(
				"ERROR_SYSTEM_DOESNT_EXIST",
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

	if (ctx.options.scope !== "everything") {
		const label = getCorrectLabel(
			(ctx.options.scope as "server" | "global" | "channels") ?? "server",
			guild.id,
			ctx.channelId,
		);

		await userCollection.updateOne(
			{ userId: system.associatedUserId },
			{
				$pull: {
					"system.systemAutoproxy": {
						serverId: label,
					} satisfies Partial<PAutoProxy>,
				},
			},
		);
	} else {
		await userCollection.updateOne(
			{ userId: system.associatedUserId },
			{
				$set: {
					"system.systemAutoproxy": [],
				},
			},
		);
	}

	await sendAutoproxyOperationDM(
		system,
		guild,
		await ctx.userTranslations(),
		"discord",
		"off",
	);

	return await ctx.editResponse({
		components: new AlertView(await ctx.userTranslations()).successViewCustom(
			(await ctx.userTranslations())[
				ctx.options.scope !== "global" && ctx.options.scope !== "everywhere"
					? "SET_AUTO_PROXY_SRV"
					: "SET_AUTO_PROXY_GLOBAL"
			]
				.replaceAll(
					"%server_name%",
					(ctx.options.scope ?? "server") !== "server"
						? `<#${ctx.channelId}>`
						: guild.name,
				)
				.replaceAll("%mode%", "off"),
		),
		flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
	});
}
