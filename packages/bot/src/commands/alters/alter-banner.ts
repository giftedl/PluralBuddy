/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Attachment, type CommandContext, Container, createAttachmentOption, createStringOption, Declare, MediaGallery, MediaGalleryItem, Options, SubCommand } from "seyfert";
import { alterCollection } from "../../mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../views/alert";
import { autocompleteAlters } from "../../lib/autocomplete-alters";
import { assetStringGeneration, operationStringGeneration } from "../../types/operation";
import { LoadingView } from "../../views/loading";
import { getGcpAccessToken, uploadDiscordAttachmentToGcp } from "@/gcp";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-banner-text": createStringOption({
        description: "The URL for a banner to use for the alter.",
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

        const user = await ctx.retrievePUser()
        const { "alter-name": alterName, "alter-banner": attachment, "alter-banner-text": attachmentText } = ctx.options;
        const systemId = ctx.author.id;

        const alter = ctx.contextAlter() ?? await (Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId }))

        if (alter === null) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        if (attachment === undefined && attachmentText === undefined) {
            await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { banner: null }})

            return await ctx.editResponse({
                components: [
                    ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().PFP_SUCCESS
                        .replace("%alter%", alterName))
                ],
                flags: MessageFlags.IsComponentsV2
    
            })
        }

        let objectName: string | undefined;

        if (attachmentText === undefined) {

            objectName =`${(process.env.BRANCH ?? "c")[0]}/${user.storagePrefix}/${assetStringGeneration(32)}`;
            const bucketName = process.env.GCP_BUCKET ?? "";
    
            try {
                const accessToken = await getGcpAccessToken();
                const {newObject} = await uploadDiscordAttachmentToGcp(
                    (attachment as { value: Attachment }).value,
                    accessToken,
                    bucketName,
                    objectName,
                    { authorId: ctx.author.id, alterId: String(alter.alterId), type: "banner" },
                );

                objectName = newObject;
            } catch (error) {
                return await ctx.editResponse({
                    components: new AlertView(ctx.userTranslations()).errorView("ERROR_FAILED_TO_UPLOAD_TO_GCP"),
                    flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
                })
            }
        }
        
        const publicUrl = objectName !== undefined ? `https://pluralbuddy.giftedly.dev/${objectName}` : attachmentText;
        await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { banner: publicUrl }})

        return await ctx.editResponse({
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().BANNER_SUCCESS
                    .replace("%alter%", alter.username)),
                new Container()
                    .setComponents(
                        new MediaGallery().addItems(
                            new MediaGalleryItem()
                                .setMedia(`https://wsrv.nl/?url=${publicUrl}&w=1024&h=84`)
                                .setDescription(`@${alter.username}'s profile`)
                                
                        )
                    )
            ],
            flags: MessageFlags.IsComponentsV2

        })
	}
}