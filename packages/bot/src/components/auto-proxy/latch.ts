/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import type { PAutoProxy } from "@/types/auto-proxy";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import type { PAlter } from "@/types/alter";

export default class LatchAutoProxySelectMenu extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Selection.AutoProxyModes.Latch.startsWith(
			context.interaction.values[0] as string,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const [initalAlterId] =
			InteractionIdentifier.Selection.AutoProxyModes.Latch.substring(
				ctx.interaction.values[0] ?? "",
			);
		let alter: PAlter | undefined;
		const { system } = await ctx.retrievePUser();
		const guild = await ctx.guild();

		if (guild === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (initalAlterId) {
			const systemId = ctx.author.id;
			const query = alterCollection.findOne({
				alterId: Number(initalAlterId),
				systemId,
			});
			alter = (await query) ?? undefined;

			if (alter === null) {
				return await ctx.write({
					components: new AlertView(ctx.userTranslations()).errorView(
						"ERROR_ALTER_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			}
		}
        
		const existingGuildPolicies = system.systemAutoproxy.some(
			(ap) => ap.serverId === guild?.id,
		);

		if (existingGuildPolicies) {
			await userCollection.updateOne(
				{ userId: system.associatedUserId },
				{
					$set: {
						"system.systemAutoproxy.$[serverEntry].autoproxyMode": "latch",
						...(alter !== undefined
							? {
									"system.systemAutoproxy.$[serverEntry].autoproxyAlter":
										alter.alterId.toString(),
								}
							: {
									"system.systemAutoproxy.$[serverEntry].autoproxyAlter": null,
								}),
					},
				},
				{
					arrayFilters: [{ "serverEntry.serverId": ctx.guildId }],
				},
			);
		} else {
			// Append a new mapping to the nameMap array
			await userCollection.updateOne(
				{ userId: system.associatedUserId },
				{
					$push: {
						"system.systemAutoproxy": {
							autoproxyMode: "latch",
							...(alter !== undefined
								? {
										autoproxyAlter: alter.alterId.toString(),
									}
								: {}),
							serverId: ctx.guildId,
						} satisfies Partial<PAutoProxy>,
					},
				},
			);
		}

		await sendAutoproxyOperationDM(
			system,
			guild,
			ctx.userTranslations(),
			"discord",
			"latch",
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx
					.userTranslations()
					.SET_AUTO_PROXY.replaceAll("%server_name%", guild?.name ?? "??")
					.replaceAll("%mode%", "latch"),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
