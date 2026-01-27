/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { SubCommand } from "seyfert"
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { LoadingView } from "@/views/loading";
import { type CommandContext, createStringOption, Declare, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-proxy": createStringOption({
        description: "The proxy mode to use for the alter",
        choices: [
            { name: "webhook", value: "webhook" },
            { name: "nickname", value: "nickname" },
            { name: "both", value: "both" }
        ] as const
    })
}

@Declare({
	name: "proxy-mode",
	description: "Set alter's proxy mode",
    aliases: ["pm", "proxy"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class EditAlterProxyModeCommand extends SubCommand {

	override async run(ctx: CommandContext<typeof options>) {

        const { "alter-name": alterName, "alter-proxy": alterProxy } = ctx.options;
        const systemId = ctx.author.id;
        const guild = await ctx.retrievePGuild();
        let alter = ctx.contextAlter() ?? await (Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId }))

        if (alter === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        if (alterProxy === undefined) {
            return await ctx.ephemeral({
                components: [
                    ...new AlterView(ctx.userTranslations()).altersSetMode(alter.username, alter.alterId, alter.alterMode, guild)
                ],
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }


        await alterCollection.updateOne(
            { alterId: Number(alter.alterId), systemId },
            {
                $set: {
                    alterMode: alterProxy
                },
            },
        );
    
        alter = await alterCollection.findOne({
            alterId: Number(alter.alterId),
            systemId,
        }) ?? alter;
        
        return await ctx.ephemeral({
            components: [
                ...new AlterView(ctx.userTranslations()).alterTopView(
                    "general",
                    alter.alterId.toString(),
                    alter.username,
                ),
                ...await new AlterView(ctx.userTranslations()).alterGeneralView(alter, ctx.guildId),
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
        });
    }
}