import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import {
	ActionRow,
	Button,
	CommandContext,
	Container,
	createRoleOption,
	Declare,
	Group,
	Middlewares,
	Options,
	Separator,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { ButtonStyle, MessageFlags, Spacing } from "seyfert/lib/types";

const options = {
	role: createRoleOption({
		description: "Role to view container of.",
		required: true,
	}),
};

@Declare({
	name: "view",
	aliases: ["v"],
	description: "View role container for role",
})
@Options(options)
@Group("role-containers")
@Middlewares(["ensureGuildPermissions"])
export default class ViewRoleContainer extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guild = await ctx.retrievePGuild();
		const { role } = ctx.options;

		if (!guild.rolePreferences.some((c) => c.roleId === role.id)) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ROLE_NO_SPECIAL_CONFIG",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const roleData = guild.rolePreferences.find((c) => c.roleId === role.id);

		if (!roleData) throw new Error("no roleData?.");

		return await ctx.write({
			components: [
				...(roleData.containerContents === undefined
					? [
							new TextDisplay().setContent(
								"-# There is no role container for this role as the contents are empty.",
							),
						]
					: []),
				...(roleData.containerContents !== undefined &&
				(roleData.containerLocation === "top" ||
					roleData.containerLocation === undefined)
					? [
							roleData.containerColor !== undefined
								? new Container()
										.setComponents(
											new TextDisplay().setContent(roleData.containerContents),
										)
										.setColor(roleData.containerColor as `#${string}`)
								: new Container().setComponents(
										new TextDisplay().setContent(roleData.containerContents),
									),
						]
					: []),
				new TextDisplay().setContent("Example proxy text. Hi!"),
				...(roleData.containerContents !== undefined &&
				roleData.containerLocation === "bottom"
					? [
							roleData.containerColor !== undefined
								? new Container()
										.setComponents(
											new TextDisplay().setContent(roleData.containerContents),
										)
										.setColor(roleData.containerColor as `#${string}`)
								: new Container().setComponents(
										new TextDisplay().setContent(roleData.containerContents),
									),
						]
					: []),
                new Separator().setSpacing(Spacing.Small),
				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.RolesTab.PreferenceEphemeral.create(
								roleData.roleId,
							),
						)
						.setStyle(ButtonStyle.Primary)
						.setLabel("Configure Role Preference")
                        .setEmoji(emojis.wrenchWhite),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
