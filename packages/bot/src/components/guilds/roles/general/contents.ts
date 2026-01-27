import {
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class RoleGeneralContentsButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.ChangeRoleContents.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const roleId =
			InteractionIdentifier.Guilds.RolesTab.ChangeRoleContents.substring(
				ctx.customId,
			)[0];

		if (!roleId) throw new Error("no role");

        const guild = await ctx.retrievePGuild();
        const role = guild.rolePreferences.find(c => c.roleId === roleId) ?? { containerContents: "" }

		return await ctx.modal(
			new Modal()
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.ChangeRoleContentsForm.create(
						roleId,
					),
				)
				.setTitle(ctx.userTranslations().FORM_ROLE_CONFIG)
				.setComponents([
					new Label()
						.setLabel(ctx.userTranslations().ROLE_CONTENTS)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Paragraph)
								.setRequired(false)
                                .setValue(role.containerContents ?? "")
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.ChangeRoleContentsSelection.create(),
								),
						),
				]),
		);
	}
}
