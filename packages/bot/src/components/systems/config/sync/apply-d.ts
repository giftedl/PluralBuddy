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
import {
	alterCollection,
	alterOperationCollection,
	importTranscriptCollection,
    userCollection,
} from "@/mongodb";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";

export default class SetPronounsButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Syncing.ApplyTranscriptDestructively.startsWith(
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
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom((await ctx.userTranslations()).PREPARING_WRITE),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		const id =
			InteractionIdentifier.Systems.Syncing.ApplyTranscriptDestructively.substring(
				ctx.customId,
			)[0];
		const alterOperation = await importTranscriptCollection.findOne({
			_id: new ObjectId(id),
			userId: ctx.author.id,
		});

		if (!id || !alterOperation) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ALTER_OPERATION_DOESNT_EXIST",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom((await ctx.userTranslations()).CREATING_ALTERS_STAGE),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		if (alterOperation.alters.add.length > 0)
			await alterCollection.insertMany(alterOperation.alters.add);

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom(
				(await ctx.userTranslations()).UPDATING_ALTERS_STAGE.replace(
					"{{ maxAlters }}",
					String(alterOperation.alters.update.length ?? 0),
				),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		await Promise.all(
			alterOperation.alters.update.map(async (element) => {
				await alterCollection.replaceOne(
					{ alterId: element.alterId, systemId: element.systemId },
					element,
				);
			}),
		);

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom((await ctx.userTranslations()).DELETING_ALTERS_STAGE),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		if (alterOperation.alters.remove.length > 0)
			await alterCollection.deleteMany({
				alterId: {
					$in: alterOperation.alters.remove.map((v) => Number(v.alterId)),
				},
				systemId: alterOperation.userId,
			});

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom(
				(await ctx.userTranslations()).CLEANING_UP.replace(
					"{{ maxAlters }}",
					String(alterOperation.alters.update.length ?? 0),
				),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		await importTranscriptCollection.deleteOne({ _id: new ObjectId(id) });
		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{ $set: { "syncConfiguration.pluralkit.lastSynced": new Date() } },
		);

		await ctx.interaction.editResponse({
			components: new AlertView(await ctx.userTranslations()).successViewCustom(
				(await ctx.userTranslations()).DONE_SYNCING.replace(
					"{{ id }}",
					String(alterOperation._id),
				),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
