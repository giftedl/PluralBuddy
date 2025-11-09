/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Attachment, type CommandContext, Container, createAttachmentOption, createStringOption, Declare, MediaGallery, MediaGalleryItem, Options, SubCommand } from "seyfert";
import { alterCollection } from "../../mongodb";
import { BaseErrorSubCommand } from "../../base-error-subcommand";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../views/alert";
import { autocompleteAlters } from "../../lib/autocomplete-alters";
import { Storage } from "@google-cloud/storage";
import { assetStringGeneration, operationStringGeneration } from "../../types/operation";
import { LoadingView } from "../../views/loading";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    "alter-avatar": createAttachmentOption({
        description: "The picture to use for the alter. (leave blank to clear)",
        value(data, ok, fail) {
            if (!data.value.contentType?.startsWith("image"))
                fail("This attachment is not an image.")
            ok(data)
        },
    })
}

@Declare({
	name: "avatar",
	description: "Set an alter's avatar.",
    aliases: ["pfp", "pic", "edit-member"]
})
@Options(options)
export default class EditAlterPictureCommand extends BaseErrorSubCommand {

	override async run(ctx: CommandContext<typeof options>) {
        await ctx.write({
            components: new LoadingView(ctx.userTranslations()).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })

        const { "alter-name": alterName, "alter-avatar": attachment } = ctx.options;
        const systemId = ctx.author.id;
        const query = Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId })
        const alter = await query;

        const storage = new Storage();

        if (alter === null) {
            return await ctx.ephemeral({
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

        const objectName = `${process.env.BRANCH}/${ctx.author.id}/${alter.alterId}/${assetStringGeneration(32)}.${((attachment as {value: Attachment}).value.contentType ?? "").replace(/(.*)\//g, '')}`;
        const bucketName = process.env.GCP_BUCKET ?? "";
        const contentType = (attachment as {value: Attachment}).value.contentType ?? "application/octet-stream";

        const accessToken = process.env.GCP_TOKEN;
        const attachmentUrl = (attachment as {value: Attachment}).value.url;
        const discordResponse = await fetch(attachmentUrl);
        
        if (!discordResponse.ok) {
            throw new Error("Failed to fetch the image from Discord.");
        }

        if (!discordResponse.body) {
            throw new Error("Response body is null.");
        }

        const gcpUploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucketName)}/o?uploadType=media&name=${encodeURIComponent(objectName)}`;
        
        const gcpResponse = await fetch(gcpUploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': contentType
            },
            body: discordResponse.body
        });

        if (!gcpResponse.ok) {
            const errorText = await gcpResponse.text();
            throw new Error(`Failed to upload to GCS: ${gcpResponse.status} ${errorText}`);
        }
        
        // Construct the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;

        await alterCollection.updateOne({ alterId: alter.alterId }, { $set: { avatarUrl: publicUrl }})

        return await ctx.editResponse({
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().PFP_SUCCESS
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