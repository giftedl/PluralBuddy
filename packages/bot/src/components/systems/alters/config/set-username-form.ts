/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";

export default class SetUsernameButton extends ModalCommand {
   
   override filter(context: ModalContext) {
	   return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameForm.startsWith(context.customId)
   }

   override async run(ctx: ModalContext) {
	const alterId = InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameForm.substring(
		ctx.customId,
	)[0];

	const systemId = ctx.author.id;
	const query = alterCollection.findOne({
		alterId: Number(alterId),
		systemId,
	});
	let alter = await query;

	if (alter === null) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
		})
	}

	const newAlterUsername = ctx.interaction.getInputValue(
		InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create(),
		true,
	);

	if (newAlterUsername.includes(" ")) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView("ALTER_SET_USERNAME_SPACES"),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
		})

	}

	await alterCollection.updateOne(
		{ alterId: Number(alterId), systemId },
		{
			$set: {
				username: newAlterUsername as string
			},
		},
	);

	alter = await alterCollection.findOne({
		alterId: Number(alterId),
		systemId,
	}) ?? alter;
	
	return await ctx.interaction.update({
		components: [
			...new AlterView(ctx.userTranslations()).alterTopView(
				"general",
				alter.alterId.toString(),
				alter.username,
			),
			...await new AlterView(ctx.userTranslations()).alterGeneralView(alter, ctx.guildId),
		],
		flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
	});
   }
}