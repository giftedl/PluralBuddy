import { ObjectId } from "bson";
import {
	ComponentCommand,
	ComponentContext,
	ModalCommand,
	ModalContext,
} from "seyfert";
import { ComponentHandler } from "seyfert/lib/components/handler";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterOperationCollection, importTranscriptCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";

export default class SetPronounsButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Syncing.ApplyTranscript.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		let user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await ctx.interaction.update({
			components: [...new LoadingView().loadingView()]
		})

		const id = InteractionIdentifier.Systems.Syncing.ApplyTranscript.substring(
			ctx.customId,
		)[0];
		const alterOperation = await importTranscriptCollection.findOne({ _id: new ObjectId(id), userId: ctx.author.id });

		if ()
		
	}
}
