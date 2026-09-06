import {
	ActionRow,
	Button,
	ComponentCommand,
	type ComponentContext,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

export default class NextPageAP extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const page =
			InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.substring(
				ctx.customId,
			)[0];


		const alters = await alterCollection
			.find({ systemId: user.system.associatedUserId })
			.limit(90)
			.skip((Number(page ?? "1") - 1) * 90)
			.toArray();

		if (alters.length === 0) {
			return await ctx.interaction.update({
				components: [
					new ActionRow().setComponents(
						new Button()
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.create(
									Number(page ?? "1") - 1,
								),
							)
							.setDisabled(Number(page ?? "1") === 1)
							.setLabel((await ctx.userTranslations()).PAGINATION_PREVIOUS_PAGE)
							.setStyle(ButtonStyle.Primary),
						new Button()
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.create(
									Number(page ?? "1") + 1,
								),
							)
							.setLabel((await ctx.userTranslations()).PAGINATION_NEXT_PAGE)
							.setDisabled(true)
							.setStyle(ButtonStyle.Primary),
						new Button()
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPage.create(
									(page as string) ?? "1",
								),
							)
							.setLabel(
								`${page}/${Math.ceil(user.system.alterIds.length / 90)}`,
							)
							.setStyle(ButtonStyle.Secondary),
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.update({
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
								Number(page ?? "1") - 1,
							),
						)
						.setDisabled(Number(page ?? '1') === 1)
						.setLabel((await ctx.userTranslations()).PAGINATION_PREVIOUS_PAGE)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPlainPagination.Page.create(
								Number(page ?? "1") + 1,
							),
						)
						.setLabel((await ctx.userTranslations()).PAGINATION_NEXT_PAGE)
						.setDisabled(alters.length !== 90)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setCustomId(InteractionIdentifier.Systems.Configuration.AlterPlainPagination.CustomPage.create(page ?? '1'))
						.setLabel(`${page}/${Math.ceil(user.system.alterIds.length / 90)}`)
						.setStyle(ButtonStyle.Secondary),
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
