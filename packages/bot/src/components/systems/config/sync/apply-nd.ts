import { ModalCommand, ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";


export default class SetPronounsButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.SyncPreferences.SyncManuallyForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		let { system: systemPB, syncConfiguration } = await ctx.retrievePUser();
    }
}
