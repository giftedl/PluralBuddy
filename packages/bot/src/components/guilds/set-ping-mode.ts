import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { ComponentCommand, Middlewares, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import z from "zod";

const pingModeSchema = z.enum([
	"unaffected",
	"always-on",
	"always-off",
	"opposite",
]);

@Middlewares(["ensureGuildPermissions"])
export default class SetPingMode extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.GeneralTab.SetPingMode.equals(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const pingMode = pingModeSchema.parse(ctx.interaction.values[0]);
		const guild = await ctx.retrievePGuild();

		await guildCollection.updateOne(
			{ guildId: guild.guildId },
			{ $set: { pingMode } },
			{ upsert: true },
		);
		ctx.client.cache.pguild.remove(guild.guildId);

		guild.pingMode = pingMode;

		return await ctx.interaction.update({
			components: [
				...new ServerConfigView(await ctx.userTranslations()).topView(
					"general",
					guild.guildId,
				),
				...(await new ServerConfigView(
					await ctx.userTranslations(),
				).generalSettings(
					guild,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				)),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
