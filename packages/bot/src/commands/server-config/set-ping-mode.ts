import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { ServerConfigView } from "@/views/server-cfg";
import { Command, Middlewares, type CommandContext, type Options, OptionsBuilder } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import z from "zod";

const pingModeSchema = z.enum([
    "unaffected",
    "always-on",
    "always-off",
    "opposite",
]);

const options = {
    mode: OptionsBuilder.string({
        name: "mode",
        description: "The ping mode to set for the server",
        required: true,
        choices: [
            { name: "Unaffected", value: "unaffected" },
            { name: "Always On", value: "always-on" },
            { name: "Always Off", value: "always-off" },
            { name: "Opposite", value: "opposite" },
        ],
    }),
};

@Middlewares(["ensureGuildPermissions"])
export default class SetPingModeSlash extends Command {
    name = "set-ping-mode";
    description = "Set the ping mode for this server";
    options = options;

    override async run(ctx: CommandContext<typeof this.options>) {
        const pingMode = pingModeSchema.parse(ctx.options.mode);
        const guild = await ctx.retrievePGuild();

        await guildCollection.updateOne(
            { guildId: guild.guildId },
            { $set: { pingMode } },
            { upsert: true },
        );
        ctx.client.cache.pguild.remove(guild.guildId);

        guild.pingMode = pingMode;

        return await ctx.interaction.write({
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
