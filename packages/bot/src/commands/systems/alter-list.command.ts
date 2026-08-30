/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { SystemProtectionFlags } from "plurography";
import {
	ActionRow,
	Button,
	type CommandContext,
	Container,
	createBooleanOption,
	createUserOption,
	Declare,
	Options,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { has } from "@/lib/privacy-bitmask";
import { alterCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

const options = {
	"other-user": createUserOption({
		description: "Find alters of another user's system.",
		required: false,
	}),
	plain: createBooleanOption({
		description: "View all alters in a view as a plain list with no containers.",
		flag: true,
	}),
};

@Declare({
	name: "alters",
	description: "See system alters",
	aliases: ["a", "m", "members", "l", "list"],
	contexts: ["BotDM", "Guild"],
})
@Shortcut()
@Options(options)
export default class AlterListCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();
		const { "other-user": otherUser } = ctx.options;

		if (otherUser) {
			const user = await userCollection.findOne({ userId: otherUser.id });

			if (
				user?.system === undefined ||
				!has(SystemProtectionFlags.ALTERS, user?.system?.public)
			) {
				return await ctx.ephemeral(
					{
						components: new AlertView(await ctx.userTranslations()).errorView(
							"ERROR_SYSTEM_DOESNT_EXIST",
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					},
					undefined,
					undefined,
					ctx,
				);
			}

			return await ctx.ephemeral(
				{
					components: [
						...(await new SystemSettingsView(
							await ctx.userTranslations(),
							getSystemFeatures(user.system)?.preferAccessiblity,
						).otherAltersSettings(user.system)),
					],
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		if (user.system === undefined) {
			return await ctx.ephemeral(
				{
					components: new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_SYSTEM_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}
		if (options.plain) {
			const alters = await alterCollection
				.find({ systemId: user.system.associatedUserId })
				.limit(90)
				.toArray();
			return await ctx.ephemeral(
				{
					components: [
						new TextDisplay().setContent(
							alters
								.map(
									(alter) =>
										`[\`@${alter.username}\`] (\`pb;alter ${alter.username}\`)`,
								)
								.join("\n"),
						),

						new ActionRow().setComponents(
							new Button()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.create(
										0,
									),
								)
								.setDisabled(true)
								.setLabel(
									(await ctx.userTranslations()).PAGINATION_PREVIOUS_PAGE,
								)
								.setStyle(ButtonStyle.Primary),
							new Button()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.create(
										2,
									),
								)
								.setLabel((await ctx.userTranslations()).PAGINATION_NEXT_PAGE)
								.setDisabled(alters.length !== 90)
								.setStyle(ButtonStyle.Primary),
							new Button()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPage.create(
										"1"
									),
								)
								.setLabel(`1/${Math.ceil(user.system.alterIds.length / 90)}`)
								.setStyle(ButtonStyle.Secondary),
						),
					],
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		return await ctx.ephemeral(
			{
				components: [
					...(await new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(user.system)?.preferAccessiblity,
					).altersSettings(user.system)),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			undefined,
			undefined,
			ctx,
		);
	}
}
