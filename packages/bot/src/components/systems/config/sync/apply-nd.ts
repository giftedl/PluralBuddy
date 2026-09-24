import { ObjectId } from "bson";
import {
	ComponentCommand,
	ComponentContext,
	ModalCommand,
	ModalContext,
} from "seyfert";
import { ComponentHandler } from "seyfert/lib/components/handler";
import { MessageFlags } from "seyfert/lib/types";
import { client } from "@/index";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import {
	alterCollection,
	alterOperationCollection,
	importTranscriptCollection,
	tagCollection,
	userCollection,
} from "@/mongodb";
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
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom((await ctx.userTranslations()).PREPARING_WRITE),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		const id = InteractionIdentifier.Systems.Syncing.ApplyTranscript.substring(
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

		alterOperation.alters.update.forEach((v) => client.cache.alterProxy.remove(String(v.alterId)))

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom((await ctx.userTranslations()).CREATING_TAGS_STAGE),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		if (alterOperation.tags.add.length > 0)
			await tagCollection.insertMany(alterOperation.tags.add);

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom(
				(await ctx.userTranslations()).UPDATING_TAGS_STAGE.replace(
					"{{ maxTags }}",
					String(alterOperation.tags.update.length ?? 0),
				),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});

		await Promise.all(
			alterOperation.tags.update.map(async (element) => {
				await tagCollection.replaceOne(
					{ tagId: element.tagId, systemId: element.systemId },
					element,
				);
			}),
		);

		await userCollection.updateOne({ userId: ctx.author.id }, { $set: { "system": alterOperation.system.nondestructive } })

		await ctx.interaction.editResponse({
			components: new LoadingView(
				await ctx.userTranslations(),
			).loadingViewCustom(
				(await ctx.userTranslations()).CLEANING_UP,
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
