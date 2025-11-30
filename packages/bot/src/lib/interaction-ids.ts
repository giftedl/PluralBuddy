/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

// biome-ignore lint/suspicious/noExplicitAny: buh?
class InteractionObj<K extends (...args: any[]) => string> {
    matcher: string;
    func: K;

    constructor(matcher: string, func: K) {
        this.matcher = matcher;
        this.func = func;
    }
    
    startsWith(input: string) {
        return input.startsWith(this.matcher);
    }

    toString() {
        return this.matcher;
    }

    create(...args: unknown[]) {
        return this.func(...args)
    }

    equals(input: string) {
        return input === this.matcher
    }

    substring(input: string) {
        return input.substring(this.matcher.length).split("-")
    }
}

function createStatic(root: string) {
    return new InteractionObj(root, () => root)
}

function createFromAdditionalArg(root: string) {
    return new InteractionObj(`${root}-`, (buh: string) => `${root}-${buh}`)
}

export const InteractionIdentifier = {
    Selection: {
        PrivacyValues: {
            PRIVACY_NAME:        createStatic("selection/privacy/name"),
            PRIVACY_DISPLAY_TAG: createStatic("selection/privacy/display_tag"),
            PRIVACY_DESCRIPTION: createStatic("selection/privacy/description"),
            PRIVACY_AVATAR:      createStatic("selection/privacy/avatar"),
            PRIVACY_BANNER:      createStatic("selection/privacy/banner"),
            PRIVACY_PRONOUNS:    createStatic("selection/privacy/pronouns"),
            PRIVACY_ALTERS:      createStatic("selection/privacy/alters"),
            PRIVACY_TAGS:        createStatic("selection/privacy/tags"),
        },
        TagColors: {
            'red':       createStatic("selection/tag-color/red"),
            'orange':    createStatic("selection/tag-color/orange"),
            'amber':     createStatic("selection/tag-color/amber"),
            'yellow':    createStatic("selection/tag-color/yellow"),
            'lime':      createStatic("selection/tag-color/lime"),
            'green':     createStatic("selection/tag-color/green"),
            'emerald':   createStatic("selection/tag-color/emerald"),
            'teal':      createStatic("selection/tag-color/teal"),
            'cyan':      createStatic("selection/tag-color/cyan"),
            'sky':       createStatic("selection/tag-color/sky"),
            'blue':      createStatic("selection/tag-color/blue"),
            'indigo':    createStatic("selection/tag-color/indigo"),
            'violet':    createStatic("selection/tag-color/violet"),
            'purple':    createStatic("selection/tag-color/purple"),
            'fuchsia':   createStatic("selection/tag-color/fuchsia"),
            'pink':      createStatic("selection/tag-color/pink"),
            'rose':      createStatic("selection/tag-color/rose")
          }
    },
    Systems: {
        DeleteSystem: createStatic("systems/delete"),
        DeleteSystemMedia: createStatic("systems/delete-media"),
        ConfigurePublicProfile: createFromAdditionalArg("systems/configure-public-profile"),
        Configuration: {
            ConfigureAlter: createFromAdditionalArg("systems/config/config-alter"),
            GeneralTab: {
                Index: createStatic("systems/config/general"),
                SetName: createStatic("systems/config/general/set-name"),
                SetNicknameFormat: createStatic("systems/config/general/nickname-format"),
                SetPrivacy: createStatic("systems/config/general/set-privacy"),
                ExportSystem: createStatic("systems/config/general/export")
            },
            AlterPagination: {
                PreviousPage: createFromAdditionalArg("systems/config/apg/previous"),
                NextPage: createFromAdditionalArg("systems/config/apg/next"),
                CreateNewAlter: createStatic("systems/config/apg/create"),
                HideTopView: createFromAdditionalArg("systems/config/apg/hide-top-view")
            },
            Alters: {
                Index: createStatic("systems/config/alters"),
                GeneralSettings: createFromAdditionalArg("systems/config/alters/general"),
                ConfigureAlterExternal: createFromAdditionalArg("systems/config/alters/configure-external"),

                SetUsername: createFromAdditionalArg("systems/config/alters/set-username"),
                SetPronouns: createFromAdditionalArg("systems/config/alters/set-pronouns"),
                SetDescription: createFromAdditionalArg("systems/config/alters/set-description"),
                SetServerDisplayName: createFromAdditionalArg("systems/config/alters/server-display-name"),
                SetDisplayName: createFromAdditionalArg("systems/config/alters/set-display-name"),
                SetProxyMode: createFromAdditionalArg("systems/config/alters/set-proxy-mode"),
                SetPrivacy: createFromAdditionalArg("systems/config/alters/set-privacy"),
                SetPFP: createFromAdditionalArg("systems/config/alters/set-pfp"),
                SetBanner: createFromAdditionalArg("systems/config/alters/set-banner"),
                SetAlterColor: createFromAdditionalArg("systems/config/alters/set-alter-color"),
                ProxyMode: {
                    GoBack: createFromAdditionalArg("systems/config/alters-proxy-mode/goback"),
                    Nickname: createFromAdditionalArg("systems/config/alters-proxy-mode/nickname"),
                    Webhook: createFromAdditionalArg("systems/config/alters-proxy-mode/webhook"),
                    Both: createFromAdditionalArg("systems/config/alters-proxy-mode/both")
                },

                RemoveAlterConfirm: createFromAdditionalArg("systems/config/alters/remove"),
                ProxyTagSettings: createFromAdditionalArg("systems/config/alters/proxy"),
                DeleteProxyTag: new InteractionObj("systems/config/alters/delete-proxy-tag-", (alterId: string, proxyTag: string) => `systems/config/alters/delete-proxy-tag-${alterId}-${proxyTag}`),
                PublicProfileSettings: createFromAdditionalArg("systems/config/alters/public-profile"),
                CreateProxyTag: createFromAdditionalArg("systems/config/alters/create-proxy-tag")
            },
            Tags: {
                Index: createStatic("systems/config/tags"),
                GeneralSettings: createFromAdditionalArg("systems/config/tags/general"),
                ConfigureTagExternal: createFromAdditionalArg("systems/config/tags/configure-external"),

                SetDisplayName: createFromAdditionalArg("systems/config/tags/set-display")
            },
            PublicProfile: {
                Index: createStatic("systems/config/public-profile")
            },
            FormSelection: {
                NameType: createStatic("systems/config/type-form/name"),
                NameForm: createFromAdditionalArg("systems/config/set-form/name"),
                PrivacyType: createStatic("systems/config/type-form/privacy"),
                PrivacyForm: createFromAdditionalArg("systems/config/set-form/privacy"),
                ProxyType: createStatic("systems/config/type-form/proxy"),
                ProxyForm: createFromAdditionalArg("systems/config/set-form/proxy"),
                NicknameType: createStatic("systems/config/type-form/nickname"),
                NicknameForm: createFromAdditionalArg("systems/config/set-form/nickname"),
                Tags: {
                    TagDisplayNameType:       createStatic           ("systems/config/type-form/tag/set-display-name"),
                    TagDisplayNameForm:       createFromAdditionalArg("systems/config/set-form/tag/set-display-name"),
                },
                Alters: {
                    CreateNewAlterForm: createStatic("systems/config/form/alter"),

                    AlterUsernameType:          createStatic           ("systems/config/type-form/alters/set-username"),
                    AlterUsernameForm:          createFromAdditionalArg("systems/config/set-form/alters/set-username"),
                    AlterPronounsType:          createStatic           ("systems/config/type-form/alters/set-pronouns"),
                    AlterPronounsForm:          createFromAdditionalArg("systems/config/set-form/alters/set-pronouns"),
                    AlterDescriptionType:       createStatic           ("systems/config/type-form/alters/set-description"),
                    AlterDescriptionForm:       createFromAdditionalArg("systems/config/set-form/alters/set-description"),
                    AlterDisplayNameType:       createStatic           ("systems/config/type-form/alters/set-display-name"),
                    AlterDisplayNameForm:       createFromAdditionalArg("systems/config/set-form/alters/set-display-name"),
                    AlterServerDisplayNameType: createStatic           ("systems/config/type-form/alters/set-server-display-name"),
                    AlterServerDisplayNameForm: createFromAdditionalArg("systems/config/set-form/alters/set-server-display-name"),
                    AlterPFPForm:               createFromAdditionalArg("systems/config/set-form/alters/set-pfp"),
                    AlterPFPType:               createStatic           ("systems/config/type-form/alters/set-pfp"),
                    AlterBannerForm:            createFromAdditionalArg("systems/config/set-form/alters/set-pfp"),
                    AlterBannerType:            createStatic           ("systems/config/type-form/alters/set-pfp"),
                    AlterColorType:             createStatic           ("systems/config/type-form/alters/set-alter-color"),
                    AlterColorForm:             createFromAdditionalArg("systems/config/set-form/alters/set-alter-color"),
                }
            }
        },
        UndoOperation: createFromAdditionalArg("systems/undo-operation")
    },
    Setup: {
        RemoveOldSystem: createStatic("setup/remove-old-system"),
        Pagination: {
            Page1: createStatic("previous-page/pluralbuddy-intro/1"),
            Page2: createStatic("next-page/pluralbuddy-intro/2"),
            Page3: createFromAdditionalArg("next-page/pluralbuddy-intro/3")
        },
        CreateNewSystem: {
            Index: createStatic("setup/create-new-system"),
            Name: createFromAdditionalArg("setup/create-new-system/name"),
            Privacy: createFromAdditionalArg("setup/create-new-system/privacy"),
            SystemTag: createFromAdditionalArg("setup/create-new-system/system-tag")
        },
        FormSelection: {
            NameType: createStatic("setup/create-new-system/type-form/name"),
            NameForm: createFromAdditionalArg("setup/create-new-system/set-form/name"),
            TagType: createStatic("setup/create-new-system/type-form/tag"),
            TagForm: createFromAdditionalArg("setup/create-new-system/set-form/tag"),
            PrivacyType: createStatic("setup/create-new-system/type-form/privacy"),
            PrivacyForm: createFromAdditionalArg("setup/create-new-system/set-form/privacy"),
            ImportForm: createStatic("setup/create-new-system/set-form/import"),
            ImportType: createStatic("setup/create-new-system/type-form/import"),
            PkForm: createStatic("setup/create-new-system/set-form/pk-import"),
            PkType: createStatic("setup/create-new-system/type-form/pk-import"),
        },
        PluralKitImport: {
            UploadAttachment: createStatic("setup/pk-import/upload")
        },
        ImportSelection: {
            Index: createStatic("setup/import-select"),
            PluralKit: createStatic("setup/import-select/pluralkit"),
            Tupperbox: createStatic("setup/import-select/tupperbox"),
            PluralBuddy: createStatic("setup/import-select/pluralbuddy")
        }
    }
}