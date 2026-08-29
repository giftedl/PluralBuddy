/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { type Attachment, ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { FileTooBigException } from "@/lib/file-too-big";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import {  getOldObject, uploadAttachment } from "@/object-storage";
import { assetStringGeneration } from "@/types/operation";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { w } from "@/webhooks";

export default class SetPFPForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterBannerForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterBannerForm.substring(
				ctx.customId,
			)[0];

		const user = await ctx.retrievePUser();
		const systemId = ctx.author.id;
		const query = alterCollection.findOne({
			$and: [{ alterId: Number(alterId) }, { systemId }],
		});

		const alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const attachment = {
			value: ctx.interaction.getFiles(
				InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterBannerType.create(),
				true,
			)[0] as Attachment,
		};

		if (attachment.value.size > 5_000_000) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ATTACHMENT_TOO_LARGE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const objectName = `${user.storagePrefix}/${assetStringGeneration(32)}`;
		let url = "";

		try {
			url = await uploadAttachment(
				(attachment as { value: Attachment }).value,
				objectName,
				{
					authorId: ctx.author.id,
					alterId: String(alter.alterId),
					type: "banner/form",
				},
				getOldObject({ imageProperty: alter.banner, storagePrefix: user.storagePrefix }),
				{ height: 450 }
			);
		} catch (error) {

			if (error instanceof FileTooBigException)
				return await ctx.editResponse({
					components: new AlertView(await ctx.userTranslations()).errorView(
						"AFTER_COMPRESSION_TOO_BIG",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_FAILED_TO_UPLOAD_TO_GCP",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await alterCollection.updateOne(
			{ alterId: alter.alterId },
			{ $set: { banner: url } },
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				banner: url,
			},
		});

		return await ctx.interaction.update({
			components: [
				...new AlterView(await ctx.userTranslations()).alterTopView(
					"public-settings",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(await ctx.userTranslations()).altersPublicView(
					alter,
					(await ctx.guild()) ?? { name: "", id: "" },
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
