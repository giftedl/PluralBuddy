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
import { TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";

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
				.setTitle((await ctx.userTranslations()).FORM_ROLE_CONFIG)
				.setComponents([
					new Label()
						.setLabel((await ctx.userTranslations()).ROLE_LOCATION)
						.setComponent(
							new RadioGroup()
								.setRequired(true)
								.setOptions([
									new RadioGroupOption({
										value: "top",
										default: role.containerLocation === "top",
										label: "Top",
										description: "Above the proxied message",
									}),
									new RadioGroupOption({
										value: "bottom",
										default: role.containerLocation === "bottom",
										label: "Bottom",
										description: "Below the proxied message",
									}),
								])
								.setCustomId(
									InteractionIdentifier.Guilds.FormSelection.ChangeRoleLocationSelection.create(),
								),
						),
				]),
		);
	}
}
