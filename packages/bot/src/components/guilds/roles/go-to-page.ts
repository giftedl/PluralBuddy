import { ComponentCommand, Middlewares, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ServerConfigView } from "@/views/server-cfg";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class GoToPageButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.GoToPage.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const pluralGuild = await ctx.retrievePGuild();
		const nativeGuild = await ctx.guild();
        const page = InteractionIdentifier.Guilds.RolesTab.GoToPage.substring(ctx.customId)[0];

		if (!nativeGuild) throw new Error("What.");

		return await ctx.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"roles",
					pluralGuild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).rolesTab(
					pluralGuild,
					nativeGuild,
                    Number(page ?? "1")
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
