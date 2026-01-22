import {
	ActionRow,
	Button,
	Container,
	Guild,
	Section,
	Separator,
	TextDisplay,
} from "seyfert";
import { TranslatedView } from "./translated-view";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { GuildFlags, type PGuild } from "plurography";
import { mentionCommand } from "@/lib/mention-command";

export const friendlyFeatureIndex: Record<
	string,
	{ title: string; description: string }
> = {
	DISABLE_APP_EXPLAIN: {
		title: "Disable \`[APP]\`/\`[BOT]\` explanation command",
		description:
			"This command allows users to explain how users proxying with PluralBuddy are not applications/bots.",
	},
	DISABLE_ABOUT: {
		title: "Disable about command",
		description: "This command shows information about PluralBuddy.",
	},
	DISABLE_HELP: {
		title: "Disable help command",
		description:
			"This command shows information about the features & commands of PluralBuddy.",
	},
	DISABLE_NUDGING: {
		title: "Disable Nudging",
		description:
			'This allows users to ping ("nudge") other proxied users main account. Users can block other users not allowing them to be nudged.',
	},
	DISABLE_MESSAGE_INFO: {
		title: "Disable Message Info",
		description:
			"This allows users to gain public information about another user based on a message they sent.",
	},
	FORCED_WEBHOOK_MODE: {
		title: "Forced Webhook Mode",
		description:
			"This forces all users to proxy with webhook mode only. **This will not work if you have Forced Nickname Mode also enabled.**",
	},
	FORCED_NICKNAME_MODE: {
		title: "Forced Nickname Mode",
		description:
			"This forces all users to proxy with nickname mode only. **This will not work if you have Forced Webhook Mode also enabled.**",
	},
	DISABLE_PERMISSION_CHECK: {
		title: "Disable Permission Check Command",
		description: "This command shows server administrators and members whether they have permissions to do certain things."
	}
};

export class ServerConfigView extends TranslatedView {
	topView(
		currentTab: "general" | "roles" | "errors" | "features",
		guildId: string,
	) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(`-# Guild ID: \`${guildId}\``),
				new ActionRow().setComponents(
					new Button()
						.setLabel("General")
						.setStyle(
							currentTab === "general"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "general"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.Index.create(),
						),
					new Button()
						.setLabel("Roles")
						.setStyle(
							currentTab === "roles"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "roles" ? emojis.squareCheck : emojis.squareDashed,
						)
						.setCustomId(InteractionIdentifier.Guilds.RolesTab.Index.create()),
					new Button()
						.setLabel("Features")
						.setStyle(
							currentTab === "features"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "features"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Guilds.FeaturesTab.Index.create(),
						),
					new Button()
						.setLabel("Error Log")
						.setStyle(
							currentTab === "errors"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "errors"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(InteractionIdentifier.Guilds.ErrorsTab.Index.create()),
				),
			),
		];
	}

	generalSettings(guild: PGuild, prefix: string, isApplication: boolean) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent("## Guild Preferences"),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setComponents(
						new TextDisplay().setContent(`**Configure Prefixes**
> Prefixes can be configured and set. You can have unlimited possible prefixes, comma separated.
> Your current prefixes are ${guild.prefixes.map((c) => `\`${c}\``).join(", ")}`),
					)
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.SetPrefixes.create(),
							)
							.setLabel("Set Prefixes")
							.setStyle(ButtonStyle.Primary),
					),
				new TextDisplay().setContent(`**Configure Blacklist**
> Roles and channels can be blacklisted from proxying or using commands from PluralBuddy.`),
				new TextDisplay().setContent(`
> Currently, the guild's blacklist items are: \n${(guild.blacklistedChannels.length + guild.blacklistedRoles.length) === 0 ? "> - _There are no blacklist items._" : ""}${[
					...guild.blacklistedChannels.map((c) => {
						return { id: c, type: "channel" };
					}),
					...guild.blacklistedRoles.map((c) => {
						return { id: c, type: "role" };
					}),
				]
					.slice(0, 5)
					.map((c) => `> - ${c.type === "channel" ? "<#" : "<@&"}${c.id}>`)
					.join(
						"\n",
					)}${(guild.blacklistedChannels.length + guild.blacklistedRoles.length) > 5 ? `\n> - ... and ${guild.blacklistedChannels.length + guild.blacklistedRoles.length - 5} extra item(s). Use ${mentionCommand(prefix, "server-config blacklist list", isApplication)} to see the rest of the blacklist items.` : ""}`),

				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistChannel.create(),
						)
						.setLabel("Add Channels")
						.setStyle(ButtonStyle.Secondary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistRole.create(),
						)
						.setLabel("Add Roles")
						.setStyle(ButtonStyle.Secondary),
				),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.ToggleSystemTagRequirement.create(),
							)
							.setLabel(
								guild.getFeatures().requiresGuildTag
									? "Disable Mandatory System Tags"
									: "Enable Mandatory System Tags",
							)
							.setStyle(
								guild.getFeatures().requiresGuildTag
									? ButtonStyle.Danger
									: ButtonStyle.Success,
							),
					)
					.setComponents(
						new TextDisplay().setContent(`**Require System Tags**
> Guilds can require system tags. Clicking the button to the right will toggle that requirement.`),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.AddManagers.create(),
							)
							.setLabel("Add Manager Roles")
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(`**Server Managers**
> Server managers can access all settings on PluralBuddy. You can have at maximum 25 server manager roles.
> In order to configure server managers, you must have a role with Administrator or Manage Roles. Server managers cannot add/remove other server manager roles.`),
						new TextDisplay().setContent(
							`> Currently, the server manager roles are:\n${guild.managerRoles.length === 0 ? "> - _There are no manager roles._" : ""}${guild.managerRoles
								.slice(0, 5)
								.map((c) => `> - <@&${c}>`)
								.join(
									"\n",
								)}${guild.managerRoles.length > 5 ? `\n> - ... and ${guild.managerRoles.length - 5} extra role(s). Use ${mentionCommand(prefix, "server-config manager-roles list", isApplication)} to see the rest of the manager roles.` : ""}`,
						),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.SetLoggingChannel.create(),
							)
							.setLabel("Set Logging Channel")
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(`**Log Channels**
> You can log messages proxied by PluralBuddy to provide insight on users sending messages. You can have one channel that you are using for proxy logging.`),
						new TextDisplay().setContent(
							`> This guild's current logging channel is: ${guild.logChannel ? `<#${guild.logChannel}>` : "_Unset_"}`,
						),
					),
			),
		];
	}

	errorSettings(guild: PGuild, nativeGuild: Guild<"api" | "cached">) {
		const renderedErrors = guild.errorLog.slice(0, 200);

		return [
			new Container().setComponents(
				new TextDisplay().setContent(`## Error Log - ${nativeGuild.name}`),
				new Separator().setSpacing(Spacing.Large),
				...(renderedErrors.length === 0
					? [
							new TextDisplay().setContent(
								`${emojis.catjamming}   Nice! Your guild hasn't ran into any errors!`,
							),
						]
					: []),
				...renderedErrors.map((error) => {
					return new Section()
						.setAccessory(
							new Button()
								.setCustomId(
									InteractionIdentifier.Guilds.ErrorsTab.ClearError.create(
										error.id,
									),
								)
								.setStyle(ButtonStyle.Danger)
								.setEmoji(emojis.xWhite),
						)
						.setComponents(
							new TextDisplay().setContent(
								`**${error.title}** · \`${error.type}\`
> - ${error.description} · <t:${Math.floor(error.timestamp.getTime() / 1000)}:S>${error.responsibleChannelId || error.responsibleUserId ? `\n> - ${error.responsibleUserId ? `Triggered by <@${error.responsibleUserId}>. ` : ""}${error.responsibleUserId ? `Triggered in <#${error.responsibleChannelId}>.` : ""}` : ""}`,
							),
						);
				}),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					`-# Found ${renderedErrors.length}/${guild.errorLog.length} error(s)`,
				),
			),
		];
	}
	featuresTab(guild: PGuild, nativeGuild: Guild<"api" | "cached">) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(`## Feature Flags - ${nativeGuild.name}
> Feature flags allow you to control certain smaller features used on PluralBuddy.`),
				new Separator().setSpacing(Spacing.Large),
				...Object.entries(friendlyFeatureIndex).map((c) =>
					new Section()
						.setComponents(
							new TextDisplay().setContent(
								`**${c[1].title}**\n> ${c[1].description}`,
							),
						)
						.setAccessory(
							new Button()
								.setCustomId(
									InteractionIdentifier.Guilds.FeaturesTab.ToggleFeature.create(
										c[0],
									),
								)
								.setStyle(
									// @ts-ignore
									guild.getFeatures().has(GuildFlags[c[0]])
										? ButtonStyle.Danger
										: ButtonStyle.Success,
								)
								.setLabel(
									// @ts-ignore
									guild.getFeatures().has(GuildFlags[c[0]])
										? "Disable"
										: "Enable",
								),
						),
				),
			),
		];
	}
}
