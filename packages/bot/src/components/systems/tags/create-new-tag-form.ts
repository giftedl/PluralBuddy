/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getEmojiFromTagColor } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, tagCollection } from "@/mongodb";
import { PAlterObject } from "@/types/alter";
import { PTagObject } from "@/types/tag";
import { getUserById, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import z from "zod";

export default class CreateNewAlterForm extends ModalCommand {
    override filter(context: ModalContext) {
        return InteractionIdentifier.Systems.Configuration.FormSelection.Tags.CreateNewTagForm.equals(context.customId)
    }

    override async run(ctx: ModalContext) {
        const displayName = ctx.interaction.getInputValue(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDisplayNameType.create(), true);
        const color = ctx.interaction.getInputValue(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorType.create(), true)

        await ctx.interaction.update(ctx.loading())

        const user = await ctx.retrievePUser();
        const server = await ctx.retrievePGuild();


		if ((user.system?.tagIds.length ?? 0) >= 500) {
			return await ctx.write({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"TOO_MANY_TAGS",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

        if (user.system === undefined) {
            return await ctx.ephemeral({
                components: new AlertView((await ctx.userTranslations())).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        const tag = PTagObject.safeParse({
			tagId: Number(DiscordSnowflake.generate()).toString(),
			systemId: user.system.associatedUserId,

			tagFriendlyName: displayName,
			tagColor: (color as string[])[0]?.substring("selection/tag-color/".length),

			associatedAlters: [],

			/** @see {@link TagProtectionFlags} */
			public: 0,
        })

        if (tag.error) {
            return await ctx.editResponse({
                components: [
                    ...new SystemSettingsView((await ctx.userTranslations())).topView("tags", user.system.associatedUserId),
                    ...new AlertView((await ctx.userTranslations())).errorViewCustom(`There was an error while creating that tag:

\`\`\`
${z.prettifyError(tag.error)}
\`\`\`                        `)
                ]
            })
        }

		await writeUserById(user.system.associatedUserId, {
			...(await getUserById(user.system.associatedUserId)),
			system: {
				...user.system,
				tagIds: [...user.system.tagIds, tag.data.tagId],
			},
		});

		await tagCollection.insertOne(tag.data);
        
        await ctx.editResponse({
            components: await new SystemSettingsView((await ctx.userTranslations())).tagsSettings(user.system)
        })
    }
}