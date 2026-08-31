/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	type Attachment,
	type CommandContext,
	Container,
	createAttachmentOption,
	createBooleanOption,
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
	"alter-avatar-text": createStringOption({
		description: "The URL for an avatar to use for the alter.",
	}),
	"alter-avatar": createAttachmentOption({
		description: "The picture to use for the alter. (leave blank to clear)",
		value(data, ok, fail) {
			if (!data.value.contentType?.startsWith("image"))
				fail("This attachment is not an image.");
			if (data.value.size > 5_000_000)
				fail("This attachment is too big. Attachments at most can be 5MB.");
			ok(data);
		},
	}),

	se: createBooleanOption({
		description: "Whether the new avatar is server specific.",
		flag: true,
	}),
};

@Declare({
	name: "avatar",
	description: "Set an alter's avatar.",
	aliases: ["pfp", "pic"],
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
			"alter-avatar": attachment,
			"alter-avatar-text": attachmentText,
			se,
		} = ctx.options;
		const systemId = ctx.author.id;

		if (se && ctx.guildId === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"DN_ERROR_SE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

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

		if (attachmentText === undefined && attachment === undefined) {
			if (!(se && ctx.guildId))
				await deleteOldObject({
					imageProperty: alter.avatarUrl,
					storagePrefix: user.storagePrefix,
				});
				
			await alterCollection.updateOne(
				{ alterId: alter.alterId },
				{
					$set:
						se && ctx.guildId
							? { [`avatarUrlMap.${ctx.guildId}`]: undefined }
							: { avatarUrl: null },
				},
			);

			w(ctx.author.id, "alter.update", {
				type: "alter.update",
				alter: {
					...alter,
					avatarUrlMap: {
						...alter.avatarUrlMap,
						...(se && ctx.guildId
							? { [ctx.guildId]: undefined }
							: { avatarUrl: null }),
					},
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

		if (attachmentText && !attachmentText.startsWith("https://")) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"INVALID_URL",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (attachmentText === undefined && se) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"NO_GCP_SE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		let objectName = `${user.storagePrefix}/${assetStringGeneration(32)}`;

		if (attachmentText === undefined) {

			try {
				attachmentText = await uploadAttachment(
					(attachment as { value: Attachment }).value,
					objectName,
					{
						authorId: ctx.author.id,
						alterId: String(alter.alterId),
						type: "profile-picture",
					},
					getOldObject({ imageProperty: alter.avatarUrl, storagePrefix: user.storagePrefix }),
					{ width: 512, height: 512 }
				);
			} catch (error) {
			if (error instanceof FileTooBigException)
				return await ctx.editResponse({
					components: new AlertView(await ctx.userTranslations()).errorView(
						"AFTER_COMPRESSION_TOO_BIG",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			// ctx.client.logger.fatal(error);
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_FAILED_TO_UPLOAD_TO_GCP",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
			}
		} else 
			await deleteOldObject({
				imageProperty: alter.avatarUrl,
				storagePrefix: user.storagePrefix,
			});


		await alterCollection.updateOne(
			{ alterId: alter.alterId },
			{
				$set:
					se && ctx.guildId
						? { [`avatarUrlMap.${ctx.guildId}`]: attachmentText }
						: { avatarUrl: attachmentText },
			},
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				avatarUrl: attachmentText,
			},
		});

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).PFP_SUCCESS.replace(
						"%alter%",
						alter.username,
					),
				),
				new Container().setComponents(
					new MediaGallery().addItems(
						new MediaGalleryItem()
							.setMedia(attachmentText ?? "")
							.setDescription(`@${alter.username}'s profile`),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
