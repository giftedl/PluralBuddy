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
				new TextDisplay().setContent(
					this.translations.SRV_CFG_ID.replace("{{ guildId }}", guildId),
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel(this.translations.GENERAL_LABEL)
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
						.setLabel(this.translations.ROLES_LABEL)
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
						.setLabel(this.translations.FEATURES_LABEL)
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
						.setLabel(this.translations.ERROR_LOG_LABEL)
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
				new TextDisplay().setContent(this.translations.SRV_CFG_TITLE),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setComponents(
						new TextDisplay().setContent(
							this.translations.SRV_CFG_PREFIXES_DESC.replace(
								"{{ prefixList }}",
								guild.prefixes.map((c) => `\`${c}\``).join(", "),
							),
						),
					)
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.SetPrefixes.create(),
							)
							.setLabel(this.translations.SRV_CFG_PREFIXES_BTN)
							.setStyle(ButtonStyle.Primary),
					),
				new TextDisplay().setContent(this.translations.SRV_CFG_BLACKLISTS_DESC),
				new TextDisplay().setContent(
					this.translations.SRV_CFG_BLACKLISTS_ITEMS.replace(
						"{{ list }}",
						"\n" +
							(guild.blacklistedChannels.length +
								guild.blacklistedRoles.length +
								guild.blacklistedCategories.length ===
							0
								? this.translations.SRV_CFG_BLACKLISTS_ITEMS_EMPTY
								: [
										...guild.blacklistedChannels.map((c) => {
											return { id: c, type: "channel" };
										}),
										...guild.blacklistedRoles.map((c) => {
											return { id: c, type: "role" };
										}),

										...(
											await Promise.all(
												guild.blacklistedCategories.map(async (c) => {
													const category = await client.channels
														.fetch(c)
														.catch(() => null);

													if (!category || !category.isCategory()) {
														return null;
													}

													return { id: category.name, type: "category" };
												}),
											)
										).filter((v) => v !== null),
									]
										.slice(0, 5)
										.map(
											(c) =>
												`> - ${c.type === "channel" ? "<#" : c.type === "category" ? "" : "<@&"}${c.id}${c.type !== "category" ? ">" : ""}`,
										)
										.join("\n")) +
							(guild.blacklistedChannels.length +
								guild.blacklistedRoles.length +
								guild.blacklistedCategories.length >
							5
								? this.translations.SRV_CFG_BLACKLISTS_ITEMS_MORE.replace(
										"{{ count }}",
										String(
											guild.blacklistedChannels.length +
												guild.blacklistedRoles.length +
												guild.blacklistedCategories.length -
												5,
										),
									).replace(
										"{{ commandMention }}",
										mentionCommand(
											prefix,
											"server-config blacklist list",
											isApplication,
										),
									)
								: ""),
					),
				),

				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistChannel.create(),
						)
						.setLabel(this.translations.SRV_CFG_ADD_CHANNELS)
						.setStyle(ButtonStyle.Secondary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistCategory.create(),
						)
						.setLabel(this.translations.SRV_CFG_ADD_CATEGORIES)
						.setStyle(ButtonStyle.Secondary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.AddBlacklistRole.create(),
						)
						.setLabel(this.translations.SRV_CFG_ADD_ROLES)
						.setStyle(ButtonStyle.Secondary),
					new Button()
						.setCustomId(
							InteractionIdentifier.Guilds.GeneralTab.RemoveBlacklistCategory.create(),
						)
						.setLabel(this.translations.SRV_CFG_REMOVE_CATEGORY)
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
									? this.translations.SRV_CFG_SYS_TAGS_D
									: this.translations.SRV_CFG_SYS_TAGS_E,
							)
							.setStyle(
								guild.getFeatures().requiresGuildTag
									? ButtonStyle.Danger
									: ButtonStyle.Success,
							),
					)
					.setComponents(
						new TextDisplay().setContent(
							this.translations.SRV_CFG_SYS_REQ_TAGS,
						),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.AddManagers.create(),
							)
							.setLabel(this.translations.SRV_CFG_MANAGE_ROLES)
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(
							this.translations.SRV_CFG_MANAGERS_DESC,
						),
						new TextDisplay().setContent(
							this.translations.CURRENT_SRV_MANAGERS.replace(
								"{{ list }}",
								// biome-ignore lint/style/useTemplate: Simply not cleaner using templates
								"\n" +
									(guild.managerRoles.length === 0
										? this.translations.CURRENT_SRV_MANAGERS_EMPTY
										: guild.managerRoles
												.slice(0, 5)
												.map((c) => `> - <@&${c}>`)
												.join("\n") +
											(guild.managerRoles.length > 5
												? this.translations.CURRENT_SRV_MANAGERS_EXTRA.replace(
														"{{ count }}",
														String(guild.managerRoles.length - 5),
													).replace(
														"{{ mentionCommand }}",
														mentionCommand(
															prefix,
															"server-config manager-roles list",
															isApplication,
														),
													)
												: "")),
							),
						),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.SetLoggingChannel.create(),
							)
							.setLabel(this.translations.SRV_CFG_LOGS_BTN)
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(this.translations.SRV_CFG_LOGS_TITLE),
						new TextDisplay().setContent(
							this.translations.SRV_CFG_LOGS_DESC.replace(
								"{{ logChannel }}",
								guild.logChannel
									? `<#${guild.logChannel}>`
									: this.translations.SRV_CFG_LOGS_UNSET,
							),
						),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.GeneralTab.SetProxyDelay.create(),
							)
							.setLabel(this.translations.SRV_CFG_PROXY_DELAY)
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(
							this.translations.SRV_CFG_PROXY_DELAY_DESC,
						),
						new TextDisplay().setContent(
							this.translations.SRV_CFG_PROXY_DELAY_SEC.replace(
								"{{ delay }}",
								String((guild.proxyDelay ?? 0) / 1000),
							).replace("{{ delayMs }}", String(guild.proxyDelay ?? 0)),
						),
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
				new TextDisplay().setContent(
					this.translations.ERROR_LOG_TITLE.replace(
						"{{ serverName }}",
						nativeGuild.name,
					),
				),
				new Separator().setSpacing(Spacing.Large),
				...(renderedErrors.length === 0
					? [
							new TextDisplay().setContent(
								this.translations.NO_ERRORS.replace(
									"{{ catJamming }}",
									emojis.catjamming,
								),
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
> - ${error.description} · <t:${Math.floor(error.timestamp.getTime() / 1000)}:S>${error.responsibleChannelId || error.responsibleUserId ? `\n> - ${error.responsibleUserId ? this.translations.ERROR_TRIGGERED_BY.replace("{{ userId }}", error.responsibleUserId) : ""}${error.responsibleChannelId ? this.translations.ERROR_TRIGGERED_IN.replace("{{ channelId }}", error.responsibleChannelId) : ""}` : ""}`,
							),
						);
				}),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					this.translations.PAGINATION_BOTTOM_ERRORS.replace(
						"{{ page }}",
						String(currentPage),
					)
						.replace("{{ maxPage }}", String(maxPages))
						.replace("{{ errors }}", String(renderedErrors.length))
						.replace("{{ maxErrors }}", String(newData.length))
						.replace(
							"{{ possibleSearchQuery }}",
							filters?.channelId || filters?.userId || filters?.type
								? this.translations.ERROR_LOG_SEARCHING_FOR.replace(
										"{{ query }}",
										[
											filters.channelId ? `<#${filters.channelId}>` : undefined,
											filters.userId ? `<@${filters.userId}>` : undefined,
											filters.type,
										]
											.filter((c) => c !== undefined)
											.join(", "),
									)
								: "",
						),
				),
				new ActionRow().setComponents(
					new Button()
						.setDisabled(currentPage === 1)
						.setStyle(ButtonStyle.Primary)
						.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
						.setCustomId(
							InteractionIdentifier.Guilds.ErrorsTab.GoToPage.create(
								currentPage - 1,
							),
						),
					new Button()
						.setDisabled(currentPage === maxPages || maxPages === 0)
						.setLabel(this.translations.PAGINATION_NEXT_PAGE)
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
				new TextDisplay().setContent(
					this.translations.FEATURE_FLAGS_TITLE.replace(
						"{{ guildName }}",
						nativeGuild.name,
					),
				),
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
										? this.translations.FEATURE_D
										: this.translations.FEATURE_E,
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
					this.translations.ROLE_TOP.replaceAll("{{ roleId }}", roleData.roleId)
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel(this.translations.OPTION_BACK)
						.setStyle(ButtonStyle.Secondary)
						.setEmoji(emojis.undo)
						.setCustomId(InteractionIdentifier.Guilds.RolesTab.Index.create()),
				),
			),
			new Container().setComponents(
				new TextDisplay().setContent(this.translations.ROLE_CONFIG_TITLE.replace("{{ roleId }}", roleData.roleId)),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.RolesTab.ChangeRoleContents.create(
									roleData.roleId,
								),
							)
							.setLabel(this.translations.ROLE_CONTAINER_CONTENTS_BTN)
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(this.translations.ROLE_CONTAINER_CONTENTS_DESC),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.RolesTab.ChangeRoleColor.create(
									roleData.roleId,
								),
							)
							.setLabel(this.translations.ROLE_CONTAINER_COLOR_BTN)
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(this.translations.ROLE_CONTAINER_COLOR_DESC),
					),
				new Section()
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Guilds.RolesTab.ChangeRoleLocation.create(
									roleData.roleId,
								),
							)
							.setLabel(this.translations.ROLE_CONTAINER_LOCATION_BTN)
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(this.translations.ROLE_CONTAINER_LOCATION_DESC),
					),
			),
			new Separator().setSpacing(Spacing.Large),
			...(roleData.containerContents === undefined
				? [
						new TextDisplay().setContent(
							this.translations.CONTENTS_EMPTY
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
			new TextDisplay().setContent(this.translations.EXAMPLE_PROXY_TEXT),
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
