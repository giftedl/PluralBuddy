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
import { alterCollection } from "../../mongodb";

export default class DeleteSystemButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.DeleteSystem.equals(ctx.customId);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.update({
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
			),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await ctx.author.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						.SYSTEM_DELETION_DM.replace(
							"%time%",
							`<t:${Math.floor(Date.now() / 1000)}>`,
						),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
        await ctx.author.write({
			files: [
				new AttachmentBuilder()
					.setName("system.json")
					.setFile(
						"buffer",
						Buffer.from(await buildExportPayload(user.system)),
					),
			]
        })

		await writeUserById(ctx.author.id, {
			userId: ctx.author.id,
			blacklisted: false,
		});
		await alterCollection.deleteMany({ systemId: ctx.author.id });

		return await ctx.editResponse({
			components: new AlertView(ctx.userTranslations()).successView(
				"SYSTEM_DELETION_FINISHED",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
