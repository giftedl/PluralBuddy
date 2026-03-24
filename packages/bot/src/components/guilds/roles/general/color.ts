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
export default class RoleGeneralColorButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.ChangeRoleColor.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const roleId =
			InteractionIdentifier.Guilds.RolesTab.ChangeRoleColor.substring(
				ctx.customId,
			)[0];

		if (!roleId) throw new Error("no role");

        const guild = await ctx.retrievePGuild();
        const role = guild.rolePreferences.find(c => c.roleId === roleId) ?? { containerColor: "" }

		return await ctx.modal(
			new Modal()
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.ChangeRoleColorForm.create(
						roleId,
					),
				)
				.setTitle(ctx.userTranslations().FORM_ROLE_CONFIG)
				.setComponents([
					new Label()
						.setLabel(ctx.userTranslations().ROLE_COLOR)
						.setComponent(
							new TextInput()
								.setStyle(TextInputStyle.Short)
								.setRequired(false)
                                .setValue(role.containerColor ?? "")
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.ChangeRoleColorSelection.create(),
								),
						),
				]),
		);
	}
}
