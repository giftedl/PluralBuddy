import { terminologyDefaults } from "plurography";
import { CacheFrom, ModalCommand, ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { terminologyMemoryCache } from "@/types/user";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

export default class SetPronounsButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.TerminologyTab.EditNormalTermsForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		let { system, terminology } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const [alter, tag, displayTag, systemArgument, proxyTag] = [
			InteractionIdentifier.Systems.Configuration.TerminologyTab.Alter.create(),
			InteractionIdentifier.Systems.Configuration.TerminologyTab.Tags.create(),
			InteractionIdentifier.Systems.Configuration.TerminologyTab.DisplayTag.create(),
			InteractionIdentifier.Systems.Configuration.TerminologyTab.System.create(),
			InteractionIdentifier.Systems.Configuration.TerminologyTab.ProxyTags.create(),
		].map((c) => ctx.interaction.getInputValue(c, true));

		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{
				$set: {
					terminology: {
						...(terminology ?? terminologyDefaults),
						alters: (alter as string) ?? "",
						tags: (tag as string) ?? "",
						system: (systemArgument as string) ?? "",
						proxy_tag: (proxyTag as string) ?? "",
						display_tag: (displayTag as string) ?? "",
					},
				},
			},
		);

		const newObj = JSON.stringify({
			...(terminology ?? terminologyDefaults),
			alters: (alter as string) ?? "",
			tags: (tag as string) ?? "",
			system: (systemArgument as string) ?? "",
			proxy_tag: (proxyTag as string) ?? "",
			display_tag: (displayTag as string) ?? "",
		});

		terminologyMemoryCache[ctx.author.id] = newObj;
		ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
			terms: newObj,
		});

		return await ctx.interaction.update({
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
	}
}
