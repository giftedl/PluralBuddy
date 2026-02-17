/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

// biome-ignore lint/suspicious/noExplicitAny: buh?
class InteractionObj<K extends (...args: any[]) => string> {
	matcher: string;
	func: K;
	create: K;

	constructor(matcher: string, func: K) {
		this.matcher = matcher;
		this.func = func;
		this.create = func.bind(this) as K;
	}

	startsWith(input: string) {
		return input.startsWith(this.matcher);
	}

	toString() {
		return this.matcher;
	}

	equals(input: string) {
		return input === this.matcher;
	}

	substring(input: string): string[] {
		return input.substring(this.matcher.length).split("-");
	}
}

function createStatic(root: string) {
	return new InteractionObj(root, () => root);
}

function createFromAdditionalArg(root: string) {
	return new InteractionObj(
		`${root}-`,
		(buh: string | number) => `${root}-${buh}`,
	);
}

export const InteractionIdentifier = {
	Selection: {
		PrivacyValues: {
			PRIVACY_NAME: createStatic("selection/privacy/name"),
			PRIVACY_DISPLAY_TAG: createStatic("selection/privacy/display_tag"),
			PRIVACY_DESCRIPTION: createStatic("selection/privacy/description"),
			PRIVACY_COLOR: createStatic("selection/privacy/color"),
			PRIVACY_AVATAR: createStatic("selection/privacy/avatar"),
			PRIVACY_BANNER: createStatic("selection/privacy/banner"),
			PRIVACY_MESSAGE_COUNT: createStatic("selection/privacy/message_count"),
			PRIVACY_USERNAME: createStatic("selection/privacy/username"),
			PRIVACY_PRONOUNS: createStatic("selection/privacy/pronouns"),
			PRIVACY_VISIBILITY: createStatic("selection/privacy/visibility"),
			PRIVACY_ALTERS: createStatic("selection/privacy/alters"),
			PRIVACY_TAGS: createStatic("selection/privacy/tags"),
		},
		TagColors: {
			red: createStatic("selection/tag-color/red"),
			orange: createStatic("selection/tag-color/orange"),
			amber: createStatic("selection/tag-color/amber"),
			yellow: createStatic("selection/tag-color/yellow"),
			lime: createStatic("selection/tag-color/lime"),
			green: createStatic("selection/tag-color/green"),
			emerald: createStatic("selection/tag-color/emerald"),
			teal: createStatic("selection/tag-color/teal"),
			cyan: createStatic("selection/tag-color/cyan"),
			sky: createStatic("selection/tag-color/sky"),
			blue: createStatic("selection/tag-color/blue"),
			indigo: createStatic("selection/tag-color/indigo"),
			violet: createStatic("selection/tag-color/violet"),
			purple: createStatic("selection/tag-color/purple"),
			fuchsia: createStatic("selection/tag-color/fuchsia"),
			pink: createStatic("selection/tag-color/pink"),
			rose: createStatic("selection/tag-color/rose"),
		},
		AutoProxyModes: {
			Latch: new InteractionObj(
				"selection/ap/latch-",
				(startingAlterId?: number) => `selection/ap/latch-${startingAlterId}`,
			),
			Alter: new InteractionObj(
				"selection/ap/alter-",
				(alterId: number) => `selection/ap/alter-${alterId}`,
			),
			Off: createStatic("selection/ap/off"),
		},
	},
	Help: {
		Page: createFromAdditionalArg("help/page"),
		Menu: createStatic("help/menu"),
	},
	AutoProxy: {
		AlterMenu: createStatic("selection/ap/alter-menu"),
	},
	EditMenu: {
		EditContextForm: createFromAdditionalArg("edit/set-form/context"),
		EditContextType: createStatic("edit/type-form/context"),
	},
	Nudge: {
		Snooze: createStatic("nudge/snooze"),
		ToggleNudge: createStatic("nudge/toggle"),
		BlockUser: createFromAdditionalArg("nudge/block"),
		ExportBlockList: createStatic("nudge/export-block-list"),
		RemoveBlock: createStatic("nudge/remove"),
		AddBlock: createStatic("nudge/add"),

		RemoveNudgeForm: createStatic("nudge/set-form/remove"),
		RemoveNudgeType: createStatic("nudge/type-form/remove"),
		AddNudgeForm: createStatic("nudge/set-form/add"),
		AddNudgeType: createStatic("nudge/type-form/add"),
	},
	Guilds: {
		GeneralTab: {
			Index: createStatic("guilds/general/index"),
			SetPrefixes: createStatic("guilds/general/set-prefixes"),
			SetLoggingChannel: createStatic("guilds/general/set-logging-channel"),
			SetProxyDelay: createStatic("guilds/general/set-proxy-delay"),

			AddBlacklistRole: createStatic("guilds/general/blacklist/add-role"),
			AddBlacklistChannel: createStatic("guilds/general/blacklist/add-channel"),
			AddManagers: createStatic("guilds/general/add-manager"),
			ToggleSystemTagRequirement: createStatic(
				"guilds/general/toggle-system-tag",
			),
		},
		RolesTab: {
			Index: createStatic("guilds/roles/index"),
			GoToPage: createFromAdditionalArg("guilds/roles/page"),
			Preference: createFromAdditionalArg("guilds/roles/preference"),
			PreferenceEphemeral: createFromAdditionalArg(
				"guilds/roles/-preference-ephemeral",
			),
			CreateNewRolePreference: createStatic("guilds/roles/new"),
			Search: createStatic("guilds/roles/search"),

			ChangeRoleContents: createFromAdditionalArg(
				"guilds/roles/change-role-contents",
			),
			ChangeRoleColor: createFromAdditionalArg(
				"guilds/roles/change-role-color",
			),
			ChangeRoleLocation: createFromAdditionalArg(
				"guilds/roles/changle-role-location",
			),
		},
		FeaturesTab: {
			Index: createStatic("guilds/features/index"),
			ToggleFeature: createFromAdditionalArg("guilds/features/toggle"),
		},
		ErrorsTab: {
			Index: createStatic("guilds/errors/index"),
			ClearError: createFromAdditionalArg("guilds/errors/clear"),
			Search: createStatic("guilds/errors/search"),
			GoToPage: createFromAdditionalArg("guilds/errors/page"),
		},
		FormSelection: {
			SetPrefixesForm: createStatic("guilds/form/prefixes-form"),
			SetPrefixesSelection: createStatic("guilds/form/prefixes-selection"),

			AddBlacklistRoleForm: createStatic("guilds/form/add-blacklist-role-form"),
			AddBlacklistRoleSelection: createStatic("guilds/form/add-blacklist-role"),

			AddBlacklistChannelForm: createStatic(
				"guilds/form/add-blacklist-channel-form",
			),
			AddBlacklistChannelSelection: createStatic(
				"guilds/form/add-blacklist-channel",
			),

			AddManagersForm: createStatic("guilds/form/add-managers-form"),
			AddManagersSelection: createStatic("guilds/form/add-managers-selection"),

			LoggingChannelForm: createStatic("guilds/form/logging-form"),
			LoggingChannelSelection: createStatic("guilds/form/logging-selection"),

			CreatingNewRoleForm: createStatic("guilds/form/new-role-form"),
			CreatingNewRoleSelection: createStatic("guilds/form/new-role-selection"),

			SearchingRolePreferencesForm: createStatic(
				"guilds/form/searching-roles-form",
			),
			SearchingRolePreferencesSelection: createStatic(
				"guilds/form/searching-roles-selection",
			),

			SearchingErrorsForm: createStatic("guilds/form/searching-errors-form"),
			SearchingErrorsUserSelection: createStatic(
				"guilds/form/searching-errors-user-selection",
			),
			SearchingErrorsChannelSelection: createStatic(
				"guilds/form/searching-errors-channel-selection",
			),
			SearchingErrorsTypeSelection: createStatic(
				"guilds/form/searching-errors-type-selection",
			),

			ChangeRoleContentsForm: createFromAdditionalArg(
				"guilds/form/change-role-contents-form",
			),
			ChangeRoleContentsSelection: createStatic(
				"guilds/form/chanel-role-contents-selection",
			),

			ChangeRoleColorForm: createFromAdditionalArg(
				"guilds/form/change-role-color-form",
			),
			ChangeRoleColorSelection: createStatic(
				"guilds/form/chanel-role-color-selection",
			),

			ChangeRoleLocationForm: createFromAdditionalArg(
				"guilds/form/change-role-location-form",
			),
			ChangeRoleLocationSelection: createStatic(
				"guilds/form/chanel-role-location-selection",
			),

			SetProxyDelayForm: createStatic("guilds/form/set-proxy-delay-form"),
			SetProxyDelaySelection: createStatic(
				"guilds/form/set-proxy-delay-selection",
			),
		},
	},
	Systems: {
		DeleteSystem: createStatic("systems/delete"),
		DeleteSystemMedia: createStatic("systems/delete-media"),
		ConfigurePublicProfile: createFromAdditionalArg(
			"systems/configure-public-profile",
		),
		Configuration: {
			ConfigureAlter: createFromAdditionalArg("systems/config/config-alter"),
			ConfigureTag: createFromAdditionalArg("systems/config/config-tag"),

			GeneralTab: {
				Index: createStatic("systems/config/general"),
				SetName: createStatic("systems/config/general/set-name"),
				SetNicknameFormat: createStatic(
					"systems/config/general/nickname-format",
				),
				SetPrivacy: createStatic("systems/config/general/set-privacy"),
				ExportSystem: createStatic("systems/config/general/export"),
				ImportSystem: createStatic("systems/config/general/import"),
			},
			AlterPagination: {
				PreviousPage: createFromAdditionalArg("systems/config/apg/previous"),
				NextPage: createFromAdditionalArg("systems/config/apg/next"),
				CreateNewAlter: createStatic("systems/config/apg/create"),
				HideTopView: createFromAdditionalArg(
					"systems/config/apg/hide-top-view",
				),
				Search: createFromAdditionalArg("systems/config/apg/search"),
			},
			TagPagination: {
				PreviousPage: createFromAdditionalArg("systems/config/tpg/previous"),
				NextPage: createFromAdditionalArg("systems/config/tpg/next"),
				CreateNewTag: createStatic("systems/config/tpg/create"),
				HideTopView: createFromAdditionalArg(
					"systems/config/tpg/hide-top-view",
				),
				Search: createFromAdditionalArg("systems/config/tpg/search"),
			},
			AlterAssignPagination: {
				PreviousPage: createFromAdditionalArg("systems/config/ag/previous"),
				NextPage: createFromAdditionalArg("systems/config/ag/next"),
				ToggleAssign: new InteractionObj(
					"systems/config/ag/toggle-assign-",
					(paginationToken: string, tagId: string) =>
						`systems/config/ag/toggle-assign-${paginationToken}-${tagId}`,
				),
				Search: createFromAdditionalArg("systems/config/ag/search"),
			},

			SetPFP: createStatic("systems/config/system/set-pfp"),
			SetBanner: createStatic("systems/config/system/set-banner"),
			SetSystemTag: createStatic("systems/config/system/set-system-tag"),
			SetPronouns: createStatic("systems/config/system/set-pronouns"),
			SetDescription: createStatic("systems/config/system/set-description"),

			Alters: {
				Index: createStatic("systems/config/alters"),
				GeneralSettings: createFromAdditionalArg(
					"systems/config/alters/general",
				),
				ConfigureAlterExternal: createFromAdditionalArg(
					"systems/config/alters/configure-external",
				),

				SetUsername: createFromAdditionalArg(
					"systems/config/alters/set-username",
				),
				SetPronouns: createFromAdditionalArg(
					"systems/config/alters/set-pronouns",
				),
				SetDescription: createFromAdditionalArg(
					"systems/config/alters/set-description",
				),
				SetServerDisplayName: createFromAdditionalArg(
					"systems/config/alters/server-display-name",
				),
				SetDisplayName: createFromAdditionalArg(
					"systems/config/alters/set-display-name",
				),
				SetProxyMode: createFromAdditionalArg(
					"systems/config/alters/set-proxy-mode",
				),
				SetPrivacy: createFromAdditionalArg(
					"systems/config/alters/set-privacy",
				),
				SetPFP: createFromAdditionalArg("systems/config/alters/set-pfp"),
				SetBanner: createFromAdditionalArg("systems/config/alters/set-banner"),
				SetAlterColor: createFromAdditionalArg(
					"systems/config/alters/set-alter-color",
				),
				DeleteAlter: createFromAdditionalArg("systems/config/alters/delete"),

				ProxyMode: {
					GoBack: createFromAdditionalArg(
						"systems/config/alters-proxy-mode/goback",
					),
					Nickname: createFromAdditionalArg(
						"systems/config/alters-proxy-mode/nickname",
					),
					Webhook: createFromAdditionalArg(
						"systems/config/alters-proxy-mode/webhook",
					),
					Both: createFromAdditionalArg(
						"systems/config/alters-proxy-mode/both",
					),
				},

				RemoveAlterConfirm: createFromAdditionalArg(
					"systems/config/alters/remove",
				),
				ProxyTagSettings: createFromAdditionalArg(
					"systems/config/alters/proxy",
				),
				DeleteProxyTag: new InteractionObj(
					"systems/config/alters/delete-proxy-tag-",
					(alterId: string, proxyTag: string) =>
						`systems/config/alters/delete-proxy-tag-${alterId}-${proxyTag}`,
				),
				PublicProfileSettings: createFromAdditionalArg(
					"systems/config/alters/public-profile",
				),
				CreateProxyTag: createFromAdditionalArg(
					"systems/config/alters/create-proxy-tag",
				),
			},
			Tags: {
				Index: createStatic("systems/config/tags/index"),
				GeneralSettings: createFromAdditionalArg("systems/config/tags/general"),
				ConfigureTagExternal: createFromAdditionalArg(
					"systems/config/tags/configure-external",
				),

				SetDisplayName: createFromAdditionalArg(
					"systems/config/tags/set-display",
				),
				SetColor: createFromAdditionalArg("systems/config/tags/set-colors"),
				SetPrivacy: createFromAdditionalArg("systems/config/tags/set-privacy"),
				SetDescription: createFromAdditionalArg(
					"systems/config/tags/set-description",
				),
				AssignAlter: createFromAdditionalArg(
					"systems/config/tags/assign-alter",
				),
			},
			PublicProfile: {
				Index: createStatic("systems/config/public-profile"),
			},
			FormSelection: {
				NameType: createStatic("systems/config/type-form/name"),
				NameForm: createStatic("systems/config/set-form/name"),
				PrivacyType: createStatic("systems/config/type-form/privacy"),
				PrivacyForm: createStatic("systems/config/set-form/privacy"),
				ProxyType: createStatic("systems/config/type-form/proxy"),
				ProxyForm: createFromAdditionalArg("systems/config/set-form/proxy"),
				NicknameType: createStatic("systems/config/type-form/nickname"),
				NicknameForm: createStatic("systems/config/set-form/nickname"),

				SystemPFPForm: createStatic("systems/config/set-form/system/set-pfp"),
				SystemPFPType: createStatic("systems/config/type-form/system/set-pfp"),
				SystemBannerForm: createStatic(
					"systems/config/set-form/system/set-banner",
				),
				SystemBannerType: createStatic(
					"systems/config/type-form/system/set-banner",
				),
				SystemPronounsForm: createStatic(
					"systems/config/set-form/system/set-pronouns",
				),
				SystemPronounsType: createStatic(
					"systems/config/type-form/system/set-pronouns",
				),
				SystemDescriptionForm: createStatic(
					"systems/config/set-form/system/set-description",
				),
				SystemDescriptionType: createStatic(
					"systems/config/type-form/system/set-description",
				),
				SystemTagForm: createStatic("systems/config/set-form/system/set-tag"),
				SystemTagType: createStatic("systems/config/type-form/system/set-tag"),

				AlterAssignPagination: {
					SearchQueryType: createStatic(
						"systems/config/type-form/ag/search-query",
					),
					SearchQueryForm: createFromAdditionalArg(
						"systems/config/set-form/ag/search-query",
					),
				},

				AlterPagination: {
					SearchQueryValueType: createStatic(
						"systems/config/type-form/apg/search-type",
					),
					SearchQueryType: createStatic(
						"systems/config/type-form/apg/search-query",
					),
					SearchQueryForm: createFromAdditionalArg(
						"systems/config/set-form/apg/search-query",
					),
				},

				TagPagination: {
					SearchQueryType: createStatic(
						"systems/config/type-form/tpg/search-query",
					),
					SearchQueryForm: createFromAdditionalArg(
						"systems/config/set-form/tpg/search-query",
					),
				},

				Tags: {
					CreateNewTagForm: createStatic("systems/config/form/tag"),

					TagDisplayNameType: createStatic(
						"systems/config/type-form/tag/set-display-name",
					),
					TagDisplayNameForm: createFromAdditionalArg(
						"systems/config/set-form/tag/set-display-name",
					),
					TagColorType: createFromAdditionalArg(
						"systems/config/type-form/tag/set-color",
					),
					TagColorForm: createFromAdditionalArg(
						"systems/config/set-form/tag/set-color",
					),
					TagPrivacyType: createStatic(
						"systems/config/type-form/tag/set-privacy",
					),
					TagPrivacyForm: createFromAdditionalArg(
						"systems/config/set-form/tag/set-privacy",
					),
					TagDescriptionType: createStatic(
						"systems/config/type-form/tag/set-description",
					),
					TagDescriptionForm: createFromAdditionalArg(
						"systems/config/set-form/tag/set-description",
					),
				},
				Alters: {
					CreateNewAlterForm: createStatic("systems/config/form/alter"),

					AlterUsernameType: createStatic(
						"systems/config/type-form/alters/set-username",
					),
					AlterUsernameForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-username",
					),
					AlterPronounsType: createStatic(
						"systems/config/type-form/alters/set-pronouns",
					),
					AlterPronounsForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-pronouns",
					),
					AlterDescriptionType: createStatic(
						"systems/config/type-form/alters/set-description",
					),
					AlterDescriptionForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-description",
					),
					AlterDisplayNameType: createStatic(
						"systems/config/type-form/alters/set-display-name",
					),
					AlterDisplayNameForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-display-name",
					),
					AlterServerDisplayNameType: createStatic(
						"systems/config/type-form/alters/set-server-display-name",
					),
					AlterServerDisplayNameForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-server-display-name",
					),
					AlterPFPForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-pfp",
					),
					AlterPFPType: createStatic("systems/config/type-form/alters/set-pfp"),
					AlterBannerForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-banner",
					),
					AlterBannerType: createStatic(
						"systems/config/type-form/alters/set-banner",
					),
					AlterColorType: createStatic(
						"systems/config/type-form/alters/set-alter-color",
					),
					AlterColorForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-alter-color",
					),
					AlterPrivacyType: createStatic(
						"systems/config/type-form/alters/set-privacy",
					),
					AlterPrivacyForm: createFromAdditionalArg(
						"systems/config/set-form/alters/set-privacy",
					),
				},
			},
		},
		UndoOperation: createFromAdditionalArg("systems/undo-operation"),
		AutoProxy: {
			Off: createFromAdditionalArg("systems/auto-proxy/off"),
		},
		ToggleDisableSystem: createStatic("setup/toggle-disable-system"),
		ImportMode: createStatic("systems/import-mode"),
	},
	Setup: {
		RemoveOldSystem: createStatic("setup/remove-old-system"),
		Pagination: {
			Page1: createStatic("previous-page/pluralbuddy-intro/1"),
			Page2: createStatic("next-page/pluralbuddy-intro/2"),
			Page3: createFromAdditionalArg("next-page/pluralbuddy-intro/3"),
		},
		CreateNewSystem: {
			Index: createStatic("setup/create-new-system"),
			Name: createFromAdditionalArg("setup/create-new-system/name"),
			Privacy: createFromAdditionalArg("setup/create-new-system/privacy"),
			SystemTag: createFromAdditionalArg("setup/create-new-system/system-tag"),
		},
		FormSelection: {
			NameType: createStatic("setup/create-new-system/type-form/name"),
			NameForm: createFromAdditionalArg(
				"setup/create-new-system/set-form/name",
			),
			TagType: createStatic("setup/create-new-system/type-form/tag"),
			TagForm: createFromAdditionalArg("setup/create-new-system/set-form/tag"),
			PrivacyType: createStatic("setup/create-new-system/type-form/privacy"),
			PrivacyForm: createFromAdditionalArg(
				"setup/create-new-system/set-form/privacy",
			),
			ImportForm: createStatic("setup/create-new-system/set-form/import"),
			ImportType: createStatic("setup/create-new-system/type-form/import"),
			PkForm: createStatic("setup/create-new-system/set-form/pk-import"),
			PkType: createStatic("setup/create-new-system/type-form/pk-import"),
			PkRawTextType: createStatic(
				"setup/create-new-system/type-form/pk-raw-text",
			),
		},
		PluralKitImport: {
			UploadAttachment: createStatic("setup/pk-import/upload"),
			RawText: createStatic("setup/pk-import/text"),
		},
		ImportSelection: {
			Index: createStatic("setup/import-select"),
			PluralKit: createStatic("setup/import-select/pluralkit"),
			Tupperbox: createStatic("setup/import-select/tupperbox"),
			PluralBuddy: createStatic("setup/import-select/pluralbuddy"),
		},
	},
};
