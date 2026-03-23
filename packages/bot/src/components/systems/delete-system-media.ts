/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Attachment,
	AttachmentBuilder,
	Button,
	ComponentCommand,
	File,
	type ComponentContext,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { PluralBuddyIntro } from "../../views/pluralbuddy-intro";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { LoadingView } from "../../views/loading";
import { writeUserById } from "../../types/user";
import { AlertView } from "../../views/alert";
import { buildExportPayload } from "../../lib/export";
import { alterCollection, tagCollection, userCollection } from "../../mongodb";
import { deleteAttachment, getGcpAccessToken } from "@/gcp";
import { assetStringGeneration } from "@/types/operation";

export default class DeleteSystemButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.DeleteSystemMedia.equals(ctx.customId);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.update({
			components: new LoadingView((await ctx.userTranslations())).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		await ctx.followup({
			files: [
				new AttachmentBuilder()
					.setName("system.json")
					.setFile(
						"buffer",
						Buffer.from(await buildExportPayload(user.system)),
					),
			],
			flags: MessageFlags.Ephemeral
		});

		// Add lifecycle rule to delete prefixed storage prefixes
		const gcpToken = await getGcpAccessToken();

		await deleteAttachment(user.storagePrefix, gcpToken);

		await userCollection.deleteOne({ userId: ctx.author.id });
		await alterCollection.deleteMany({ systemId: ctx.author.id });
		await tagCollection.deleteMany({ systemId: ctx.author.id });

		return await ctx.editResponse({
			components: new AlertView((await ctx.userTranslations())).successView(
				"SYSTEM_DELETION_MEDIA_FINISHED",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
