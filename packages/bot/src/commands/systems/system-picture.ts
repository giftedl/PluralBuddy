/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

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
import { object } from "zod";
import { FileTooBigException } from "@/lib/file-too-big";
import { createSystemOperation } from "@/lib/system-operation";
import {
	deleteOldObject,
	getOldObject,
	uploadAttachment,
} from "@/object-storage";
import { autocompleteAlters } from "../../lib/autocomplete-alters";
import { alterCollection } from "../../mongodb";
import {
	assetStringGeneration,
	operationStringGeneration,
} from "../../types/operation";
import { AlertView } from "../../views/alert";
import { LoadingView } from "../../views/loading";

const options = {
	"system-avatar-text": createStringOption({
		description: "The URL for an avatar to use for the system.",
	}),
	"system-avatar": createAttachmentOption({
		description: "The picture to use for the alter. (leave blank to clear)",
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
	name: "avatar",
	description: "Set an alter's avatar.",
	aliases: ["pfp", "pic", "picture"],
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
		let { "system-avatar": attachment, "system-avatar-text": attachmentText } =
			ctx.options;

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (attachmentText === undefined && attachment === undefined) {
			await deleteOldObject({
				imageProperty: user.system.systemAvatar,
				storagePrefix: user.storagePrefix,
			});

			await createSystemOperation(
				user.system,
				{ systemAvatar: null },
				await ctx.userTranslations(),
				"discord",
			);

			return await ctx.editResponse({
				components: [
					...new AlertView(await ctx.userTranslations()).successViewCustom(
						(await ctx.userTranslations()).PFP_SUCCESS.replace(
							"@%alter%",
							"your system",
						),
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const objectName = `${user.storagePrefix}/${assetStringGeneration(32)}}`;

		if (attachmentText === undefined) {
			try {
				attachmentText = await uploadAttachment(
					(attachment as { value: Attachment }).value,
					objectName,
					{
						authorId: ctx.author.id,
						alterId: "@system",
						type: "profile-picture",
					},
					getOldObject({
						imageProperty: user.system.systemAvatar,
						storagePrefix: user.storagePrefix,
					}),
					{ height: 512, width: 512 }
				);
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
				imageProperty: user.system.systemAvatar,
				storagePrefix: user.storagePrefix,
			});

		await createSystemOperation(
			user.system,
			{ systemAvatar: attachmentText },
			await ctx.userTranslations(),
			"discord",
		);

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).PFP_SUCCESS.replace(
						"@%alter%",
						"your system",
					),
				),
				new Container().setComponents(
					new MediaGallery().addItems(
						new MediaGalleryItem()
							.setMedia(attachmentText)
							.setDescription(`System profile`),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
