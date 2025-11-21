/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, createStringOption, Declare, Options, type OKFunction, IgnoreCommand, type OnOptionsReturnObject } from "seyfert";
import { AlertView } from "../../views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { PAlterObject } from "../../types/alter";
import { DiscordSnowflake } from "@sapphire/snowflake"
import { getUserById, writeUserById } from "../../types/user";
import { alterCollection } from "../../mongodb";
import { SubCommand } from "seyfert"
import z from "zod";

const options = {
    username: createStringOption({
        description: 'The username for the alter. These **cannot** include spaces.',
        required: true,
        max_length: 20,
        value: (data, ok: OKFunction<string>, no) => {
            if (data.value.includes(" "))
                no("contains a space; yet usernames do not contain a space")
            if (data.value.includes("@") || data.value.includes("/") || data.value.includes("\\"))
                no("contains a slash or @ symbol. usernames cannot have either of those")
            ok(data.value);
        }
    }),
    "display-name": createStringOption({
        description: 'The display name for the alter. These can include spaces.',
        required: true,
        max_length: 100
    })
};

@Declare({
    name: 'create-alter',
    description: "Creates a new alter",
    aliases: ["ca", "alter", "new-alter"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class CreateAlterCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
        const { username, "display-name": displayName } = ctx.options;

        await ctx.write(ctx.loading(ctx.userTranslations()))

        const user = await ctx.retrievePUser();
        const server = await ctx.retrievePGuild();

        if (user.system === undefined) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        const alter = PAlterObject.safeParse({
            alterId: Number(DiscordSnowflake.generate()),
            systemId: user.system.associatedUserId,

            username,
            displayName,
            nameMap: [],
            color: null,
            pronouns: null,
            description: null,
            created: new Date(),
            avatarUrl: null,
            webhookAvatarUrl: null,
            banner: null,
            lastMessageTimestamp: null,
            messageCount: 0,
            alterMode: "webhook"
        })

        if (alter.error) {
            return await ctx.editResponse({
                components: [
                    ...new AlertView(ctx.userTranslations()).errorViewCustom(`There was an error while creating that alter:

\`\`\`
${z.prettifyError(alter.error)}
\`\`\`                        `)
                ]
            })
        }

        await writeUserById(user.system.associatedUserId, {
            ...(await getUserById(user.system.associatedUserId)),
            system: {
                ...user.system,
                alterIds: [
                    ...user.system.alterIds,
                    alter.data.alterId
                ]
            }
        })

        alterCollection.insertOne(alter.data);
        
        await ctx.editResponse({
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().CREATE_NEW_ALTER_DONE
                    .replace("%prefix%", server.prefixes[0] ?? "/")
                    .replace("%alter_id%", alter.data.username))
            ]
        })
    }

    override async onOptionsError(
        context: CommandContext,
        metadata: OnOptionsReturnObject
    ) {
        const errors = Object.entries(metadata)
            .filter((_) => _[1].failed)
            .map((error) => `${error[0]}: ${error[1].value}`)
            .join("\n")
            
        await context.editOrReply({
            components: [...new AlertView(context.userTranslations()).errorViewCustom(context.userTranslations().PLURALBUDDY_OPTIONS_ERROR.replace("%options_errors%", errors))],
            flags: MessageFlags.IsComponentsV2
        });
    }
}