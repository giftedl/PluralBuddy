import { ComponentCommand, Middlewares, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { errorCollection, guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";

@Middlewares(["ensureGuildPermissions"])
export default class ClearError extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.ErrorsTab.ClearError.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const pluralGuild = await ctx.retrievePGuild();
        const nativeGuild = await ctx.guild()
		const errorId = InteractionIdentifier.Guilds.ErrorsTab.ClearError.substring(
			ctx.customId,
		)[0];

        if (!nativeGuild) throw new Error("Guild doesn't exist")

		if (!pluralGuild.errorLog.some((c) => c.id === errorId)) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_DOESNT_EXIST",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		await guildCollection.updateOne(
			{ guildId: pluralGuild.guildId },
			{ $pull: { errorLog: { id: errorId } } },
		);
		ctx.client.cache.pguild.remove(pluralGuild.guildId)

        await errorCollection.deleteOne({ id: errorId });

        pluralGuild.errorLog = pluralGuild.errorLog.filter((c) => c.id !== errorId)

		return await ctx.update({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"errors",
					pluralGuild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).errorSettings(
					pluralGuild,
					nativeGuild
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
