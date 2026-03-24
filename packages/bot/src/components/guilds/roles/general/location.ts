import {
	ComponentCommand,
	Label,
	Middlewares,
	Modal,
	StringSelectMenu,
	StringSelectOption,
	RadioGroup,
	TextInput,
	type ComponentContext,
	RadioGroupOption,
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
					new Label()
						.setLabel(ctx.userTranslations().ROLE_LOCATION)
						.setComponent(
							new RadioGroup()
								.setRequired(true)
								.setOptions([
									new RadioGroupOption()
										.setValue("top")
										.setDefault(role.containerLocation === "top")
										.setLabel("Top")
										.setDescription("Above the proxied message"),
									new RadioGroupOption()
										.setValue("bottom")
										.setDefault(role.containerLocation === "bottom")
										.setLabel("Bottom")
										.setDescription("Below the proxied message"),
								])
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.ChangeRoleLocationSelection.create(),
								),
						),
				]),
		);
	}
}
