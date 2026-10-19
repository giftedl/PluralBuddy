import { type AnyContext, CheckboxGroup, CheckboxGroupOption, Label, Modal, TextDisplay } from "seyfert";
import type { CollectorInteraction } from "seyfert/lib/components/handler";
import { client } from ".";
import { InteractionIdentifier } from "./lib/interaction-ids";


export async function policyModal(
	ctx: AnyContext | CollectorInteraction,
	nextPage: string
) {
	return new Modal()
		.setTitle(
			("userTranslations" in ctx
				? await ctx.userTranslations()
				: client.t("en").get()
			).POLICY_MODAL_TITLE
		)
		.setCustomId(InteractionIdentifier.PolicyForm.create(nextPage))
		.setComponents([
			new TextDisplay().setContent(
				("userTranslations" in ctx
					? await ctx.userTranslations()
					: client.t("en").get()
				).POLICY_MODAL_DESCRIPTION
			),
			new Label()
				.setLabel(
					("userTranslations" in ctx
						? await ctx.userTranslations()
						: client.t("en").get()
					).POLICY_MODAL_CONFIRMATION
				)
				.setComponent(
					new CheckboxGroup()
						.setRequired(true)
						.setCustomId(InteractionIdentifier.PolicyFormAcceptance.create())
						.setSelectionLimit({ max: 2, min: 2 })
						.setOptions([
							new CheckboxGroupOption({
								value: "acceptance",
								label: ("userTranslations" in ctx
									? await ctx.userTranslations()
									: client.t("en").get()
								).POLICY_MODAL_DETAIL,
							}),
							new CheckboxGroupOption({
								value: "block-acceptance",
								label: ("userTranslations" in ctx
									? await ctx.userTranslations()
									: client.t("en").get()
								).POLICY_MODAL_BLOCK_DETAIL,
								description: ("userTranslations" in ctx
									? await ctx.userTranslations()
									: client.t("en").get()
								).POLICY_MODAL_BLOCK_DESC,
							}),
						])
				),
		]);
}
