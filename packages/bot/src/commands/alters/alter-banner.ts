/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Attachment, type CommandContext, Container, createAttachmentOption, createStringOption, Declare, MediaGallery, MediaGalleryItem, Options, SubCommand } from "seyfert";
import { alterCollection } from "../../mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../views/alert";
import { autocompleteAlters } from "../../lib/autocomplete-alters";
import { Storage } from "@google-cloud/storage";
import { assetStringGeneration, operationStringGeneration } from "../../types/operation";
import { LoadingView } from "../../views/loading";
import { getGcpAccessToken, uploadDiscordAttachmentToGcp } from "@/gcp";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-banner": createAttachmentOption({
        description: "The banner to use for the alter. (leave blank to clear)",
        value(data, ok, fail) {
            if (!data.value.contentType?.startsWith("image"))
                fail("This attachment is not an image.")
            if (data.value.size > 1_000_000)
                fail("This attachment is too big. Attachments at most can be 1mb.")
            ok(data)
        },
    })
}

@Declare({
	name: "banner",
	description: "Set an alter's banner.",
    aliases: ["b"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class EditAlterPictureCommand extends SubCommand {

	override async run(ctx: CommandContext<typeof options>) {
        await ctx.write({
            components: new LoadingView(ctx.userTranslations()).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })

        const { "alter-name": alterName, "alter-banner": attachment } = ctx.options;
        const systemId = ctx.author.id;
        const query = Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId })
        const alter = await query;

        if (alter === null) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        if (attachment === undefined) {
            await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { avatarUrl: null }})

            return await ctx.editResponse({
                components: [
                    ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().PFP_SUCCESS
                        .replace("%alter%", alterName))
                ],
                flags: MessageFlags.IsComponentsV2
    
            })
        }

        const objectName =`${(process.env.BRANCH ?? "c")[0]}/${assetStringGeneration(32)}.${((attachment as {value: Attachment}).value.contentType ?? "").replace(/(.*)\//g, '')}`;
        const bucketName = process.env.GCP_BUCKET ?? "";

        try {
            const accessToken = await getGcpAccessToken();
			await uploadDiscordAttachmentToGcp(
				(attachment as { value: Attachment }).value,
				accessToken,
				bucketName,
				objectName,
				{ authorId: ctx.author.id, alterId: String(alter.alterId), type: "banner" },
			);
        } catch (error) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_FAILED_TO_UPLOAD_TO_GCP"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }
        
        const publicUrl = `https://pluralbuddy.giftedly.dev/${objectName}`;
        await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { banner: publicUrl }})

        return await ctx.editResponse({
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().BANNER_SUCCESS
                    .replace("%alter%", alter.username)),
                new Container()
                    .setComponents(
                        new MediaGallery().addItems(
                            new MediaGalleryItem()
                                .setMedia(`https://wsrv.nl/?url=${publicUrl}&w=256&h=256`)
                                .setDescription(`@${alter.username}'s profile`)
                                
                        )
                    )
            ],
            flags: MessageFlags.IsComponentsV2

        })
	}
}