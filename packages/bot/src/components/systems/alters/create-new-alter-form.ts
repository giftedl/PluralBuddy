/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { PAlterObject } from "@/types/alter";
import { getUserById, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import z from "zod";

export default class CreateNewAlterForm extends ModalCommand {
    override filter(context: ModalContext) {
        return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.CreateNewAlterForm.equals(context.customId)
    }

    override async run(ctx: ModalContext) {
        const username = ctx.interaction.getInputValue(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create(), true);
        const displayName = ctx.interaction.getInputValue(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameType.create(), true);

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
            alterMode: "webhook",
            public: 0
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
}