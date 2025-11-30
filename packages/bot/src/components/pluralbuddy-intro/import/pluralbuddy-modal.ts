/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext, ActionRow, Button } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { LoadingView } from "../../../views/loading";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { PSystemObject } from "../../../types/system";
import { ImportNotation } from "../../../lib/export";
import { AlertView } from "../../../views/alert";
import { z } from "zod";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { alterCollection } from "../../../mongodb";
import { getUserById, writeUserById } from "../../../types/user";

export default class PluralBuddyImportModal extends ModalCommand {
    override filter(ctx: ModalContext) {
        return InteractionIdentifier.Setup.FormSelection.ImportForm.equals(ctx.customId);
      }

    
    async run(ctx: ModalContext) {
		await ctx.interaction.update({
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const file = ctx.interaction.getFiles(
			InteractionIdentifier.Setup.FormSelection.ImportType.create(),
			true,
		)[0];
		if (!file) {
			throw new Error("?");
		}

		const MAX_FILE_SIZE = 2 * 1024 * 1024;
		if (file.size > MAX_FILE_SIZE) {
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"PLURALBUDDY_IMPORT_ERROR_TOO_LARGE",
					),
					new ActionRow().addComponents(
						new Button()
							.setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
							.setCustomId(
								InteractionIdentifier.Setup.Pagination.Page2.create(),
							)
							.setStyle(ButtonStyle.Secondary),
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const fileData = await (await fetch(file.url)).text();
        const parsed = ImportNotation.safeParse(JSON.parse(fileData));

        if (parsed.error) {
            return await ctx.editResponse({
                components: [ 
                    ...new AlertView(ctx.userTranslations()).errorViewCustom(ctx.userTranslations().PLURALBUDDY_IMPORT_ERROR.replace("%zod_errors%", z.prettifyError(parsed.error))),
                    new ActionRow().addComponents(
                        new Button()
                            .setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
                            .setCustomId(InteractionIdentifier.Setup.Pagination.Page2.create())
                            .setStyle(ButtonStyle.Secondary)
                    )
                ],
            
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        const { data } = parsed;

        data.system.associatedUserId = ctx.author.id;
        data.system.alterIds = [];

        const newAlters = data.alters.map((v,i ) => {
            return {...v, systemId: ctx.author.id, lastMessageTimestamp: null, messageCount: 0, alterId: Number(DiscordSnowflake.generate({ processId: BigInt(i) }))}
        })

        data.system.alterIds = newAlters.map((v) => v.alterId)

        await alterCollection.insertMany(newAlters)
        await writeUserById(ctx.author.id, {
            ...(await getUserById(ctx.author.id)),
            system: data.system
        })

        await ctx.editResponse({
            components: [...new AlertView(ctx.userTranslations()).successViewCustom(
                ctx.userTranslations().SUCCESSFULLY_IMPORTED
                    .replace("%alter_count%", String(data.system.alterIds.length))
                    .replace("%system_name%", String(data.system.systemName))
            )],
            flags: MessageFlags.IsComponentsV2
        });
    }
}