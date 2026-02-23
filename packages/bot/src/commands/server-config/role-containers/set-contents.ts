import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	ActionRow,
	Button,
	CommandContext,
	Container,
	createRoleOption,
	createStringOption,
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
	contents: createStringOption({
		description: "Contents of the role container to put. Clear if blank.",
		required: false,
	}),
};

@Declare({
	name: "set-contents",
	aliases: ["sc"],
	description: "Change contents of role container",
})
@Options(options)
@Group("role-containers")
@Middlewares(["ensureGuildPermissions"])
export default class ViewRoleContainer extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guild = await ctx.retrievePGuild();
		const { role, contents } = ctx.options;
		const roleData = guild.rolePreferences.find(
			(c) => c.roleId === role.id,
		) ?? { roleId: role.id };
		const preferenceAlreadyExists = guild.rolePreferences.some(
			(c) => c.roleId === role.id,
		);

		if (preferenceAlreadyExists)
			await guildCollection.updateOne(
				{ guildId: guild.guildId, "rolePreferences.roleId": role.id },
				{ $set: { "rolePreferences.$.containerContents": contents } },
			);
		else
			await guildCollection.updateOne(
				{ guildId: guild.guildId },
				{
					$push: {
						rolePreferences: { roleId: role.id, containerContents: contents },
					},
				},
			);

		ctx.client.cache.pguild.remove(guild.guildId)

		guild.rolePreferences = [
			...guild.rolePreferences.filter((c) => c.roleId !== role.id),
			{ ...roleData, containerContents: contents },
		];
		roleData.containerContents = contents;

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
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						.SET_CONTAINERS_CONTENT.replace("%role%", role.id),
				),
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
