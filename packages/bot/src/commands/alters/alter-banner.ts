/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	type Attachment,
	type CommandContext,
	Container,
	createAttachmentOption,
	createStringOption,
	Declare,
	MediaGallery,
	MediaGalleryItem,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { FileTooBigException } from "@/lib/file-too-big";
import {  deleteOldObject, getOldObject, uploadAttachment } from "@/object-storage";
import { w } from "@/webhooks";
import { autocompleteAlters } from "../../lib/autocomplete-alters";
import { alterCollection } from "../../mongodb";
import {
	assetStringGeneration,
	operationStringGeneration,
} from "../../types/operation";
import { AlertView } from "../../views/alert";
import { LoadingView } from "../../views/loading";

const options = {
	"alter-name": createStringOption({
		description: "The name of the alter.",
		required: true,
		autocomplete: autocompleteAlters,
	}),
	"alter-banner-text": createStringOption({
		description: "The URL for a banner to use for the alter.",
	}),
	"alter-banner": createAttachmentOption({
		description: "The banner to use for the alter. (leave blank to clear)",
		value(data, ok, fail) {
			if (!data.value.contentType?.startsWith("image"))
				fail("This attachment is not an image.");
			if (data.value.size > 5_000_000)
				fail("This attachment is too big. Attachments at most can be 5MB.");
			ok(data);
		},
	}),
};

@Declare({
	name: "banner",
	description: "Set an alter's banner.",
	aliases: ["b"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditAlterPictureCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.write({
			components: new LoadingView(await ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();
		let {
			"alter-name": alterName, 
			"alter-banner": attachment,
			"alter-banner-text": attachmentText,
		} = ctx.options;
		const systemId = ctx.author.id;

		const alter =
			ctx.contextAlter() ??
			(await (Number.isNaN(Number.parseInt(alterName))
				? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
				: alterCollection.findOne({
						$or: [{ username: alterName }, { alterId: Number(alterName) }],
						systemId,
					})));

		if (alter === null) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (attachment === undefined && attachmentText === undefined) {
			await deleteOldObject({
				imageProperty: alter.banner,
				storagePrefix: user.storagePrefix,
			});
			
			await alterCollection.updateOne(
				{ alterId: alter.alterId },
				{ $set: { banner: null } },
			);
			
			w(ctx.author.id, "alter.update", {
				type: "alter.update",
				alter: {
					...alter,
					banner: null,
				},
			});

			return await ctx.editResponse({
				components: [
					...new AlertView(await ctx.userTranslations()).successViewCustom(
						(await ctx.userTranslations()).PFP_SUCCESS.replace(
							"%alter%",
							alterName,
						),
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
		}

		if (attachmentText === undefined) {
			try {
				const objectUrl = await uploadAttachment(
					(attachment as { value: Attachment }).value,
					`${user.storagePrefix}/${assetStringGeneration(32)}`,
					{
						authorId: ctx.author.id,
						alterId: String(alter.alterId),
						type: "banner",
					},
					getOldObject({
						imageProperty: alter.banner,
						storagePrefix: user.storagePrefix,
					}),
					{ height: 450 }
				);

				attachmentText = objectUrl;
			} catch (error) {
			if (error instanceof FileTooBigException)
				return await ctx.editResponse({
					components: new AlertView(await ctx.userTranslations()).errorView(
						"AFTER_COMPRESSION_TOO_BIG",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_FAILED_TO_UPLOAD_TO_GCP",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
			}
		} else
			await deleteOldObject({
				imageProperty: alter.banner,
				storagePrefix: user.storagePrefix,
			});

		await alterCollection.updateOne(
			{ alterId: alter.alterId },
			{ $set: { banner: attachmentText } },
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				banner: attachmentText,
			},
		});

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).BANNER_SUCCESS.replace(
						"%alter%",
						alter.username,
					),
				),
				new Container().setComponents(
					new MediaGallery().addItems(
						new MediaGalleryItem()
							.setMedia(attachmentText)
							.setDescription(`@${alter.username}'s profile`),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}