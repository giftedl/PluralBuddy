import { CacheFrom, ComponentCommand, ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { terminologyTemplates } from "@/lib/terminology-templates";
import { userCollection } from "@/mongodb";
import { terminologyMemoryCache } from "@/types/user";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

export default class GeneralTab extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.TerminologyTab.TemplatesSelect.equals(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system } = await ctx.retrievePUser();
		const template = terminologyTemplates.find(
			(c) =>
				(ctx.interaction.data.values[0] as string).toLocaleLowerCase() ===
				c.name.toLocaleLowerCase(),
		);

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (!template)
			throw new Error("Invalid template sent as custom id ? :thinking:");

		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{
				$set: {
					terminology: template.data,
				},
			},
		);

		const newObj = JSON.stringify(template.data);

		terminologyMemoryCache[ctx.author.id] = newObj;
		ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
			terms: newObj,
		});

		await ctx.interaction.update({
			components: [
				...new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(system)?.preferAccessiblity,
				).topView("terminology", system.associatedUserId),
				...(await new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(system)?.preferAccessiblity,
				).terminologySettings(system)),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		return await ctx.interaction.followup({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					`${(await ctx.userTranslations()).SUCCESSFULLY_APPLIED_TEMPLATE}

${Object.entries(template.data)
	.map(([k, v]) => `> **${k.replaceAll("_", " ")}:** ${v}`)
	.join("\n")}`,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
