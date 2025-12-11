/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

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
import { alterCollection } from "../../mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../views/alert";
import { autocompleteAlters } from "../../lib/autocomplete-alters";
import {
	assetStringGeneration,
	operationStringGeneration,
} from "../../types/operation";
import { LoadingView } from "../../views/loading";
import { getGcpAccessToken, uploadDiscordAttachmentToGcp } from "@/gcp";
import { createSystemOperation } from "@/lib/system-operation";

const options = {
	"system-avatar": createAttachmentOption({
		description: "The picture to use for the alter. (leave blank to clear)",
		value(data, ok, fail) {
			if (!data.value.contentType?.startsWith("image"))
				fail("This attachment is not an image.");
			if (data.value.size > 1_000_000)
				fail("This attachment is too big. Attachments at most can be 1mb.");
			ok(data);
		},
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
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser()
		const { "system-avatar": attachment } = ctx.options;

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (attachment === undefined) {
			await createSystemOperation(
				user.system, { systemAvatar: null }, ctx.userTranslations(), "discord"
			);

			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).successViewCustom(
						ctx.userTranslations().PFP_SUCCESS.replace("@%alter%", "your system"),
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
		}

		const objectName = `${(process.env.BRANCH ?? "c")[0]}/${user.storagePrefix}/${assetStringGeneration(32)}.${((attachment as { value: Attachment }).value.contentType ?? "").replace(/(.*)\//g, "")}`;
		const bucketName = process.env.GCP_BUCKET ?? "";

		try {
			const accessToken = await getGcpAccessToken();
			await uploadDiscordAttachmentToGcp(
				(attachment as { value: Attachment }).value,
				accessToken,
				bucketName,
				objectName,
				{ authorId: ctx.author.id, alterId: '@system', type: "profile-picture" },
			);
		} catch (error) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_FAILED_TO_UPLOAD_TO_GCP",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const publicUrl = `https://pluralbuddy.giftedly.dev/${objectName}`;

		await createSystemOperation(
			user.system, { systemAvatar: publicUrl }, ctx.userTranslations(), "discord"
		);

		return await ctx.editResponse({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx.userTranslations().PFP_SUCCESS.replace("@%alter%", "your system"),
				),
				new Container().setComponents(
					new MediaGallery().addItems(
						new MediaGalleryItem()
							.setMedia(`https://wsrv.nl/?url=${publicUrl}&w=256&h=256`)
							.setDescription(`System profile`),
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
