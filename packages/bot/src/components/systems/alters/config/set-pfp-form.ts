/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { type Attachment, ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";
import { getGcpAccessToken, uploadDiscordAttachmentToGcp } from "@/gcp";
import { assetStringGeneration } from "@/types/operation";

export default class SetPFPForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPFPForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPFPForm.substring(
				ctx.customId,
			)[0];

		const user = await ctx.retrievePUser()
		const systemId = ctx.author.id;
		const query = alterCollection.findOne({
			$and: [{ alterId: Number(alterId) }, { systemId }],
		});

		const alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const attachment = {
			value: ctx.interaction.getFiles(
				InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPFPType.create(),
				true,
			)[0] as Attachment,
		};

		if (attachment.value.size > 1_000_000) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ATTACHMENT_TOO_LARGE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const objectName = `${(process.env.BRANCH ?? "c")[0]}/${user.storagePrefix}/${assetStringGeneration(32)}.${(attachment.value.contentType ?? "").replace(/(.*)\//g, '')}`;;
		const bucketName = process.env.GCP_BUCKET ?? "";

		try {
			const accessToken = await getGcpAccessToken();
			await uploadDiscordAttachmentToGcp(
				(attachment as { value: Attachment }).value,
				accessToken,
				bucketName,
				objectName,
				{ authorId: ctx.author.id, alterId: String(alter.alterId), type: "profile-picture/form" },
			);
		} catch (error) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_FAILED_TO_UPLOAD_TO_GCP",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const publicUrl = `https://pluralbuddy.giftedly.dev/${objectName}`;
		await alterCollection.updateOne(
			{ alterId: alter.alterId },
			{ $set: { avatarUrl: publicUrl } },
		);

		return await ctx.interaction.update({
			components: [
				...new AlterView(ctx.userTranslations()).alterTopView(
					"public-settings",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(ctx.userTranslations()).altersPublicView(
					alter,
					(await ctx.guild()) ?? { name: "", id: "" },
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction.message?.messageReference === undefined
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
