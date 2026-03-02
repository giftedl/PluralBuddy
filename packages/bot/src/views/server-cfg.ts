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
import {
	GuildErrorTypes,
	GuildFlags,
	PGuildObject,
	type PGuild,
} from "plurography";
import { mentionCommand } from "@/lib/mention-command";
import z from "zod";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { friendlyFeatureIndex } from "../../../plurography/src/pluralbuddy/guild";
import { client } from "..";

const roleDataObj = z.object({
	roleId: z.string(),
	containerContents: z.string().optional(),
	containerLocation: z.enum(["top", "bottom"]).optional(),
	containerColor: z.string().optional(),
});

export const errorPagination: {
	id: string;
	filters: {
		userId?: string;
		channelId?: string;
		type?: z.infer<typeof GuildErrorTypes>;
	};
}[] = [];

export class ServerConfigView extends TranslatedView {
	topView(
		currentTab: "general" | "roles" | "errors" | "features",
		guildId: string,
	) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(`-# Server ID: \`${guildId}\``),
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

	async generalSettings(guild: PGuild, prefix: string, isApplication: boolean) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent("## Server Preferences"),
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
> Currently, the guild's blacklist items are: \n${(guild.blacklistedChannels.length + guild.blacklistedRoles.length + guild.blacklistedCategories.length) === 0 ? "> - _There are no blacklist items._" : ""}${[
					...guild.blacklistedChannels.map((c) => {
						return { id: c, type: "channel" };
					}),
					...guild.blacklistedRoles.map((c) => {
						return { id: c, type: "role" };
					}),

					...(await Promise.all(guild.blacklistedCategories.map(async (c) => {
						const category = await client.channels.fetch(c).catch(() => null);

						if (!category || !category.isCategory()) {
							return null;
						}

						return { id: category.name, type: "category"}
					}))).filter(v => v !== null)
				]
					.slice(0, 5)
					.map((c) => `> - ${c.type === "channel" ? "<#" : (c.type === "category" ? "" : "<@&")}${c.id}${c.type !== "category" ? ">" : ""}`)
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
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistCategory.create(),
						)
						.setLabel("Add Category")
						.setStyle(ButtonStyle.Secondary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistRole.create(),
						)
						.setLabel("Add Roles")
						.setStyle(ButtonStyle.Secondary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.RemoveBlacklistCategory.create(),
						)
						.setLabel("Remove Category")
						.setStyle(ButtonStyle.Danger),
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
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.SetProxyDelay.create(),
							)
							.setLabel("Set Proxy Delay")
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(`**Proxy Delay**
> After PluralBuddy gains data of a new message being sent, in optimal conditions, PluralBuddy can usually proxy a message <600ms. However, if you use a moderation bot that may not be that fast, you can set this delay to a higher amount.`),
						new TextDisplay().setContent(`> It is not recommended to go over a 1 second proxy delay.
> This server's proxy delay currently is **${(guild.proxyDelay ?? 0) / 1000} seconds** (${guild.proxyDelay ?? 0}ms)`),
					),
			),
		];
	}

	errorSettings(
		guild: PGuild,
		nativeGuild: Guild<"api" | "cached">,
		currentPage?: number,
		newData?: typeof guild.errorLog,
		filters?: (typeof errorPagination)[0]["filters"],
		paginationId?: string | undefined,
	) {
		if (newData && !paginationId) {
			paginationId = DiscordSnowflake.generate().toString();

			errorPagination.push({
				id: paginationId,
				filters: filters ?? {},
			});
		}

		newData = newData ?? guild.errorLog;
		currentPage = currentPage ?? 1;

		const maxPages = Math.ceil((newData.length ?? 0) / 5);
		const renderedErrors = newData.slice(
			(currentPage - 1) * 5,
			(currentPage - 1) * 5 + 5,
		);

		return [
			new Container().setComponents(
				new TextDisplay().setContent(`## Error Log - ${nativeGuild.name}`),
				new Separator().setSpacing(Spacing.Large),
				...(renderedErrors.length === 0
					? [
							new TextDisplay().setContent(
								`${emojis.catjamming}   Nice! Your server hasn't ran into any errors!`,
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
					`-# Page ${currentPage}/${maxPages} · Found ${renderedErrors.length}/${newData.length} error(s) ${filters?.channelId || filters?.userId || filters?.type ? `· Searching for ${[filters.channelId ? `<#${filters.channelId}>` : undefined, filters.userId ? `<@${filters.userId}>` : undefined, filters.type].filter((c) => c !== undefined).join(", ")}` : ""}`,
				),
				new ActionRow().setComponents(
					new Button()
						.setDisabled(currentPage === 1)
						.setStyle(ButtonStyle.Primary)
						.setLabel("Previous Page")
						.setCustomId(
							InteractionIdentifier.Guilds.ErrorsTab.GoToPage.create(
								currentPage - 1,
							),
						),
					new Button()
						.setDisabled(currentPage === maxPages || maxPages === 0)
						.setLabel("Next Page")
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Guilds.ErrorsTab.GoToPage.create(
								currentPage + 1,
							),
						),

					new Button()
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.search)
						.setCustomId(
							InteractionIdentifier.Guilds.ErrorsTab.Search.create(),
						),
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

	rolesTab(
		guild: PGuild,
		nativeGuild: Guild<"api" | "cached">,
		currentPage?: number,
		queryData?: PGuild["rolePreferences"],
	) {
		currentPage = currentPage ?? 1;

		const maxPages = Math.ceil((guild.rolePreferences.length ?? 0) / 5);
		const currentRolePreferences = guild.rolePreferences.slice(
			(currentPage - 1) * 5,
			(currentPage - 1) * 5 + 5,
		);

		return [
			new Container().setComponents(
				new TextDisplay().setContent(`## Roles - ${nativeGuild.name}
> The role configuration allows you to add specific containers to proxied messages indicating they are from a user with a specific role.`),
				new Separator().setSpacing(Spacing.Large),
				...(guild.rolePreferences.length === 0
					? [
							new TextDisplay().setContent(
								`-# This server currently has no role preferences. Create one below!`,
							),
						]
					: []),
				...currentRolePreferences.map((c) =>
					new Section()
						.setAccessory(
							new Button()
								.setCustomId(
									InteractionIdentifier.Guilds.RolesTab.Preference.create(
										c.roleId,
									),
								)
								.setLabel("Configure Role")
								.setStyle(ButtonStyle.Primary)
								.setEmoji(emojis.wrenchWhite),
						)
						.setComponents(new TextDisplay().setContent(`<@&${c.roleId}>`)),
				),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					`-# Page ${currentPage}/${maxPages} · Found ${currentRolePreferences.length}/${guild.rolePreferences.length} role preference(s)`,
				),
				new ActionRow().setComponents(
					new Button()
						.setEmoji(emojis.plus)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Guilds.RolesTab.CreateNewRolePreference.create(),
						),
					new Button()
						.setDisabled(currentPage === 1)
						.setStyle(ButtonStyle.Primary)
						.setLabel("Previous Page")
						.setCustomId(
							InteractionIdentifier.Guilds.RolesTab.GoToPage.create(
								currentPage - 1,
							),
						),
					new Button()
						.setDisabled(currentPage === maxPages || maxPages === 0)
						.setLabel("Next Page")
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Guilds.RolesTab.GoToPage.create(
								currentPage + 1,
							),
						),

					new Button()
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.search)
						.setCustomId(InteractionIdentifier.Guilds.RolesTab.Search.create()),
				),
			),
		];
	}

	roleGeneralView(roleData: z.infer<typeof roleDataObj>) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					`-# <@&${roleData.roleId}> • ID: \`${roleData.roleId}\``,
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel("Back")
						.setStyle(ButtonStyle.Secondary)
						.setEmoji(emojis.undo)
						.setCustomId(InteractionIdentifier.Guilds.RolesTab.Index.create()),
				),
			),
			new Container().setComponents(
				new TextDisplay().setContent(`## Role Configuration - <@&${roleData.roleId}>
> The role configuration allows you to add specific containers to proxied messages indicating they are from a user with a specific role.`),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.RolesTab.ChangeRoleContents.create(
									roleData.roleId,
								),
							)
							.setLabel("Edit Container Contents")
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(`**Role Container Contents**
> This is the actual contents inside of the role-specific container. This is required for the container to appear. If this is blank, the container won't appear.`),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.RolesTab.ChangeRoleColor.create(
									roleData.roleId,
								),
							)
							.setLabel("Edit Container Color")
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(`**Role Container Color**
> Containers on Discord have a color they can be. Otherwise, the color marker shows up as blank (unlike in embeds).`),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.RolesTab.ChangeRoleLocation.create(
									roleData.roleId,
								),
							)
							.setLabel("Edit Container Location")
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(`**Role Container Location**
> PluralBuddy can place the container either below the message contents or above it.

There is an example below of what an example proxy with this role would look like:`),
					),
			),
			new Separator().setSpacing(Spacing.Large),
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
		];
	}
}

function capitalize(s: string) {
	return String(s[0]).toUpperCase() + String(s).slice(1);
}
