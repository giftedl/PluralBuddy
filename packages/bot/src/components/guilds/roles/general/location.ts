import {
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	StringSelectMenu,
	StringSelectOption,
	TextInput,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

@Middlewares(["ensureGuildPermissions"])
export default class RoleGeneralLocationButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.ChangeRoleLocation.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const roleId =
			InteractionIdentifier.Guilds.RolesTab.ChangeRoleLocation.substring(
				ctx.customId,
			)[0];

		if (!roleId) throw new Error("no role");

		const guild = await ctx.retrievePGuild();
		const role = guild.rolePreferences.find((c) => c.roleId === roleId) ?? {
			containerLocation: "top",
		};

		return await ctx.modal(
			new Modal()
				.setCustomId(
					InteractionIdentifier.Guilds.FormSelection.ChangeRoleLocationForm.create(
						roleId,
					),
				)
				.setTitle(ctx.userTranslations().FORM_ROLE_CONFIG)
				.setComponents([
					new Label().setLabel(ctx.userTranslations().ROLE_COLOR).setComponent(
						new StringSelectMenu()
							.setValuesLength({ min: 1, max: 1 })
							.setRequired(true)
							.setOptions([
								new StringSelectOption()
									.setValue("top")
									.setDefault(role.containerLocation === "top")
									.setLabel("Top")
									.setEmoji("⬆️"),
								new StringSelectOption()
									.setValue("bottom")
									.setDefault(role.containerLocation === "bottom")
									.setLabel("Bottom")
									.setEmoji("⬇️"),
							])
							.setCustomId(
								InteractionIdentifier.Guilds.FormSelection.ChangeRoleLocationSelection.create(),
							),
					),
				]),
		);
	}
}
