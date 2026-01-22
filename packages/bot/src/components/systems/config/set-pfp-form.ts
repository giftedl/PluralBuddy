/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { type Attachment, ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";
import { getGcpAccessToken, uploadDiscordAttachmentToGcp } from "@/gcp";
import { assetStringGeneration } from "@/types/operation";
import { createSystemOperation } from "@/lib/system-operation";
import { SystemSettingsView } from "@/views/system-settings";

export default class SetPFPForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.SystemPFPForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		await ctx.interaction.update(ctx.loading());

		const { system, storagePrefix } = await ctx.retrievePUser()

		if (system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const attachment = {
			value: ctx.interaction.getFiles(
				InteractionIdentifier.Systems.Configuration.FormSelection.SystemPFPType.create(),
				true,
			)[0] as Attachment,
		};

		if (attachment.value.size > 1_000_000) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ATTACHMENT_TOO_LARGE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const objectName = `${(process.env.BRANCH ?? "c")[0]}/${storagePrefix}/${assetStringGeneration(32)}.${(attachment.value.contentType ?? "").replace(/(.*)\//g, '')}`;;
		const bucketName = process.env.GCP_BUCKET ?? "";

		try {
			const accessToken = await getGcpAccessToken();
			await uploadDiscordAttachmentToGcp(
				(attachment as { value: Attachment }).value,
				accessToken,
				bucketName,
				objectName,
				{ authorId: ctx.author.id, alterId: '@system', type: "profile-picture/form" },
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
			system, { systemAvatar: publicUrl }, ctx.userTranslations(), "discord"
		);

		return await ctx.editResponse({
			components: [
				...new SystemSettingsView(ctx.userTranslations()).topView(
					"public-settings",
					system.associatedUserId,
				),
				...new SystemSettingsView(ctx.userTranslations()).publicProfile(
					system,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
