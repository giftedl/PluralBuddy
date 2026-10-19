/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { DiscordSnowflake } from "@sapphire/snowflake";
import { assetStringGeneration } from "plurography";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import z from "zod";
import { FileTooBigException } from "@/lib/file-too-big";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { writeBack } from "@/lib/pk-sync-engine";
import { getMaxAlterPublicValue } from "@/lib/privacy-bitmask";
import { alterCollection } from "@/mongodb";
import { uploadAttachment } from "@/object-storage";
import { AlterProtectionFlags, PAlterObject } from "@/types/alter";
import { getUserById, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";
import { w } from "@/webhooks";

export default class CreateNewAlterForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.CreateNewAlterForm.equals(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const username = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create(),
			true,
		);
		const displayName = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameType.create(),
			true,
		);
		const proxyTag = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.ProxyType.create(),
			false,
		);
		const avatar = ctx.interaction.getFiles(
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPFPType.create(),
			false,
		);

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (user.system.alterIds.length >= 2000) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"TOO_MANY_ALTERS",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const alterId = Number(DiscordSnowflake.generate());
		let avatarAsString = null;
		let proxyTagSafe = null;

		if (avatar !== undefined && avatar[0] !== undefined) {
			const objectName = `${user.storagePrefix}/${assetStringGeneration(32)}`;

			try {
				avatarAsString = await uploadAttachment(
					avatar[0],
					objectName,
					{
						authorId: ctx.author.id,
						alterId: String(alterId),
						type: "profile-picture",
					},
					undefined,
					{ width: 512, height: 512 },
				);
			} catch (error) {
				if (error instanceof FileTooBigException)
					return await ctx.editOrReply({
						components: new AlertView(await ctx.userTranslations()).errorView(
							"AFTER_COMPRESSION_TOO_BIG",
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					});
				// ctx.client.logger.fatal(error);
				return await ctx.editOrReply({
					components: new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_FAILED_TO_UPLOAD_TO_GCP",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			}
		}

		(() => {if (proxyTag !== undefined && (proxyTag.includes("text") || proxyTag.includes("Text"))) {

			// Get the prefix and suffix based on "text" position
			const textIndex =
				proxyTag.indexOf("text") === -1
					? proxyTag.indexOf("Text")
					: proxyTag.indexOf("text");
			const prefix = (proxyTag as string).substring(0, textIndex);
			const suffix = (proxyTag as string).substring(textIndex + 4);

			if (prefix.length > 20 || suffix.length > 20) {
				return;
			}
			if (prefix === "" && suffix === "") {
				return;
			}

			const id = DiscordSnowflake.generate();

			proxyTagSafe = {
				prefix,
				suffix,
				id: String(id),
			};
		}})()

		const alter = PAlterObject.safeParse({
			alterId: alterId,
			systemId: user.system.associatedUserId,

			username,
			displayName,
			nameMap: [],
			color: null,
			pronouns: null,
			description: null,
			created: new Date(),
			proxyTags: proxyTagSafe === null ? [] : [proxyTagSafe],
			avatarUrl: avatarAsString,
			webhookAvatarUrl: null,
			banner: null,
			lastMessageTimestamp: null,
			messageCount: 0,
			alterMode: "webhook",
			public: getSystemFeatures(user.system).publicDefault
				? getMaxAlterPublicValue()
				: 0,
		});

		if (alter.error) {
			return await ctx.interaction.update({
				components: [
					...new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(user.system)?.preferAccessiblity,
					).topView("alters", user.system.associatedUserId),
					...new AlertView(
						await ctx.userTranslations(),
					).errorViewCustom(`There was an error while creating that alter:

\`\`\`
${z.prettifyError(alter.error)}
\`\`\`                        `),
				],
			});
		}

		await writeUserById(user.system.associatedUserId, {
			...(await getUserById(user.system.associatedUserId)),
			system: {
				...user.system,
				alterIds: [...user.system.alterIds, alter.data.alterId],
			},
		});

		await alterCollection.insertOne(alter.data);
		writeBack({
			type: "create-alter",
			id: String(alter.data.alterId),
			change: { ...alter.data, userId: ctx.author.id },
			syncConfig: user.syncConfiguration,
		});

		await ctx.interaction.update({
			components: await new SystemSettingsView(
				await ctx.userTranslations(),
				getSystemFeatures(user.system)?.preferAccessiblity,
			).altersSettings({
				...user.system,
				alterIds: [...user.system.alterIds, alter.data.alterId],
			}),
		});

		w(ctx.author.id, "alter.create", {
			userId: ctx.author.id,
			type: "alter.create",
			alter: alter.data,
		});
	}
}
