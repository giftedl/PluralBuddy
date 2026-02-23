/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { TranslationString } from ".";

export const translations = {
	INTRODUCTION_MESSAGE: `## Welcome to PluralBuddy
PluralBuddy is a bot designed to fill the gap for quality customizable plurality exchanges for Discord servers and users.

:track_next: To get started, click the Next Page button below to setup your system.`,
	IMPORT_MESSAGE: `## Setting up your system
You can create a new system which will allow you to create your alters and tags by yourself.
Additionally, you can also import data from another bot like PluralKit.
-# To import from Tupperbox, due to the lack of data Tupperbox export data provides, you must create the system and then run \`{{ prefix }}system import\`.`,
	PAGINATION_NEXT_PAGE: "Next Page",
	PAGINATION_FINISH: "Finish",
	BLACKLISTED: "You have been blacklisted from **{{ guild }}**. You cannot use PluralBuddy in this guild.",
	BLACKLISTED_PC: `You have been blacklisted from **Pridecord**. You cannot use PluralBuddy in this guild.

> **Reason:** {{ libbyReasoning }}
> **Expires:** {{ libbyExpirationDate }}
> -# {{ reply }} Please view the DM from <@1455014942888693792> regarding case \`{{ libbyCaseId }}\`.`,
	PAGINATION_PREVIOUS_PAGE: "Previous Page",
	CREATING_NEW_SYSTEM_HEADER: "## Creating a new system",
	ERROR_DISABLED_SYSTEM: "2f – Your system is disabled. You cannot proxy.",
	OPTION_DISABLED: "This option cannot be selected. This option is disabled.",

	TOO_MANY_BLACKLIST_ITEMS:
		"There are too many blacklist items. You can only have 25 blacklist roles, and 25 blacklist channels at one time due to Discord modal limitations.",
	TOO_MANY_MANAGER_ITEMS:
		"There are too many manager items. You can only have 25 manager roles at one time due to Discord modal limitations.",

	CREATING_NEW_SYSTEM_NAME_MESSAGE: `
Systems on PluralBuddy require a **system name**. They must be at least 3 characters long and shorter than 20 characters long. System names will be shown when somebody identifies a message from your system.`,
	CREATING_NEW_SYSTEM_NAME_BUTTON: "Set name*",
	CREATING_NEW_SYSTEM_NAME_SET: "Name is:",

	CREATING_NEW_SYSTEM_TAG_BUTTON: "Set system tag*",
	CREATING_NEW_SYSTEM_TAG_SET: "System tag is:",
	CREATING_NEW_SYSTEM_TAG_MESSAGE: `
This server requires a **system tag** for systems who are proxying here. In order to create a system here, you must have a system tag.`,

	CREATING_NEW_SYSTEM_PRIVACY_BUTTON: "Set privacy values",
	CREATING_NEW_SYSTEM_PRIVACY_MESSAGE: `
Systems can have **privacy values** which are values that describe who can see what part of your system. By default, your system is completely private besides server automatic moderation and the message that your system sends. However, changing them will change those values.`,
	CREATING_NEW_SYSTEM_PRIVACY_SET: "Public Privacy values are:",
	CREATING_NEW_SYSTEM_PRIVACY_FORM_DESC:
		"Select the privacy values you want open to the public.",

	CREATING_NEW_SYSTEM_SUCCESS: `Successfully created new system!
### Next Steps
> - To create a new alter, try using %command1%
> - To create a new tag, try using %command2%`,
	SETUP_ERROR_SYSTEM_ALREADY_EXISTS:
		"2b – You cannot setup a new system if a system under your account already exists.",
	SETUP_ERROR_SYSTEM_ALREADY_EXISTS_BTN: "Remove system & setup again",
	ERROR_PAGINATION_TOO_OLD:
		'2g – That alter pagination component is too old, you cannot proceed. Please hit the "Alters" tab at the top of the message to reset the pagination.',
	ERROR_TAG_PAGINATION_TOO_OLD:
		'2h – That tag pagination component is too old, you cannot proceed. Please hit the "Tags" tab at the top of the message to reset the pagination.',
	ERROR_ASSIGN_PAGINATION_TOO_OLD:
		"2i – That pagination component is too old, you cannot proceed. Please go back and hit the Assign button again to make the pagination component work again.",
	ERROR_NO_ALTERS: "2w – You have no alters! Create one below!",
	ERROR_NO_TAGS: "2x – You have no tags! Create one below!",
	PK_IMPORT_START: "## PluralKit Importing",

	PAGE_NEW_SYS_TEXT:
		"-# Page 3/3 · Some fields haven't been filled out. · * Required",
	PAGE_NEW_SYS_TEXT_FILLED: "-# Page 3/3 · * Required",
	IMPORT_PLURALKIT_DESCRIPTION: "Import from PluralKit",
	IMPORT_TUPPERBOX_DESCRIPTION: "Import from TupperBox",
	IMPORT_PLURALBUDDY_DESCRIPTION: "Import from PluralBuddy",
	IMPORT_SOURCE_DESCRIPTION: "Import Source",
	CREATE_NEW_SYS_DESCRIPTION: "Create New System",
	PLURALBUDDY_IMPORT_ERROR_TOO_LARGE:
		"2j – Importing files cannot be larger than 2mb. Please contact support if you are genuinely trying to import a system larger than 2mb.",
	ERROR_ATTACHMENT_TOO_LARGE:
		"2j – Attachments for banners or profile pictures cannot be larger than 2mb.",
	CREATE_NEW_ALTER_DESCRIPTION: "Create New Alter",
	CREATE_NEW_TAG_DESCRIPTION: "Create New Tag",
	PLURALBUDDY_IMPORT_ERROR_INVALID_JSON:
		"2k – The file you imported is not valid JSON.",

	ERROR_INTERACTION_TOO_OLD:
		"2l – This interaction has no longer been kept track of. (have you waited too long?)",
	ERROR_SYSTEM_DOESNT_EXIST:
		"2m – This operation cannot be concluded because there is no system to operate on.",
	ERROR_ALTER_DOESNT_EXIST:
		"2n – This operation cannot be concluded because either, there is no alter to operate on, or there is no system associated to the user who created the request.",
	ERROR_ALTER_DOESNT_EXIST_SUGGESTION:
		"2n – That alter could not be found. Did you mean \`%suggestion%\`?",
	ERROR_TAG_DOESNT_EXIST:
		"2o – This operation cannot be concluded because either, there is no tag to operate on, or there is no system associated to the user who created the request.",

	CREATING_NEW_SYSTEM_FORM_TITLE: "Set System Details",
	EDIT_SYSTEM_FORM_TITLE: "Editing System",
	SYSTEM_PRONOUNS_FORM_LABEL: "Pronouns",
	SYSTEM_DESCRIPTION_FORM_LABEL: "Description",
	SYSTEM_SYSTEM_TAG_FORM_LABEL: "System Tag",
	ALTER_SUCCESS_PRONOUNS: "Successfully set pronouns for @%alter% to %new%",
	ALTER_SUCCESS_PRIVACY:
		"Successfully set the public privacy values for @%alter% to %new% (%number% total values)",
	ALTER_SUCCESS_DESC: "Successfully set description for @%alter%.",
	PAGINATION_TITLE: "Page",
	WAITING: "Loading...",
	WAITING_LONG_TERM: "Loading... This will take a while. Please wait a moment.",
	SUCCESSFULLY_IMPORTED:
		"Successfully imported %alter_count% alter(s) for %system_name%.",

	CREATING_NEW_PT_FORM_TITLE: "New proxy tag",
	CREATING_NEW_PT_FORM_DESC:
		"Input the proxy tag where `text` is the text in the message. For example: `text -bob`",
	CREATING_NEW_PT_FORM_LABEL: "Proxy Tag",
	CREATING_NEW_PT_ERROR:
		"2p – This is not formatted correctly. Remember, you need to have a prefix and a suffix separated by `text`.",
	CREATING_NEW_PT_TOO_MANY_CHARS:
		"2y – There is too many characters on either the prefix or suffix side. Remember, you can only have 20 characters for the prefix & 20 characters for the suffix.",
	SUCCESSFULLY_NEW_PT: "Successfully created a new proxy tag!",

	PLURALBUDDY_IMPORT_SOURCE: "JSON Import Data",
	PLURALBUDDY_IMPORT_DESC: "Copy and paste the exported JSON data below",
	PLURALBUDDY_IMPORT_ERROR:
		"2q – There was some error(s) while parsing that:\n\n\`\`\`\n%zod_errors%\n\`\`\`",
	PLURALBUDDY_OPTIONS_ERROR:
		"2r – There was some error(s) while evaluating the arguments to that command:\n\n\`\`\`\n%options_errors%\n\`\`\`",

	CREATE_NEW_ALTER_DONE:
		"Successfully created a new alter in your system. Use `%prefix%alter %alter_id%` for more details.",
	CREATE_NEW_TAG_DONE:
		"Successfully created  %color_emoji% **%tag_name%**  in your system. Use %command% for more details.",
	TAG_SPACE_WARNING:
		"Since this tag has **spaces** in it, some commands may require you put the display name in quotes to be parsed correctly. Additionally, you can just use application commands instead.",
	TAG_ALREADY_EXISTS:
		"You already have a tag named **%display%** in your system.",

	CONFIRMATION_SYSTEM_DELETION:
		"# :warning: __YOU ARE ABOUT TO DELETE YOUR SYSTEM__ :warning:\n**This action __CANNOT__ be undone by PluralBuddy Support**, or by yourself in any capacity at ANY date in the future. __This will delete ALL system data, including tags, alters, and other assets from your system__.\n\n> **Pro tip:** If you need to simply disable proxying for all alters, it may be better to **disable** the system intead.",
	CONFIRMATION_SYSTEM_DELETION_PRIVACY:
		"-# As per [PluralBuddy's Privacy Policy](https://gftl.fyi/privacy), this action will delete all data related to your system, **except** for system banners and profile pictures. Those can be deleted by using %command%'s `media-included` flag.",
	CONFIRMATION_SYSTEM_DELETION_BTN:
		"I acknowledge this is a permanent action, continue",
	BACK_TO_SAFETY_BTN: "No, go back to safety",
	CONFIRMATION_ALTER_DELETION:
		"Are you sure you'd like to delete @%alter%? **This action cannot be undone.**",

	SYSTEM_DELETION_FINISHED:
		"Successfully deleted your system. \n-# If your DM's are open, you have also been direct messaged a copy of your system export.",
	SYSTEM_DELETION_MEDIA_FINISHED:
		"Successfully deleted your system **and your system's media**. \n-# If your DM's are open, you have also been direct messaged a copy of your system export.",
	SYSTEM_DELETION_DM: "Here is the export data due to the deletion on %time%:",
	ALTER_DELETION_FINISHED: "Successfully deleted that alter.",
	ALTER_SERVER_DN_FORM_LABEL: "Server Display Name",

	SYSTEM_EXPORT_FINISHED:
		"Successfully exported your system. \n-# **Pro tip:** Make sure PluralBuddy can direct message or else the export cannot be sent to you.",
	SYSTEM_EXPORT_DM: "Here is your export data on request:",

	PRIVACY_VISIBILITY: "Visibility",
	PRIVACY_NAME: "Display Name Privacy",
	PRIVACY_USERNAME: "Username Privacy",
	PRIVACY_DISPLAY_TAG: "Display Tag Privacy",
	PRIVACY_DESCRIPTION: "Description Privacy",
	PRIVACY_COLOR: "Color Privacy",
	PRIVACY_AVATAR: "Avatar Privacy",
	PRIVACY_BANNER: "Banner Privacy",
	PRIVACY_MESSAGE_COUNT: "Message Count Privacy",
	PRIVACY_PRONOUNS: "Pronouns Privacy",
	PRIVACY_ALTERS: "Alter Privacy",
	PRIVACY_TAGS: "Tags Privacy",

	INVISIBLE_ALTER: "You cannot view this alter due to their privacy settings.",
	INVISIBLE_TAG: "You cannot view this tag due to its privacy settings.",

	SYSTEM_NAME_FORM_LABEL: "System Name",
	SYSTEM_PRIVACY_FORM_LABEL: "System Privacy",
	SYSTEM_TAG_FORM_LABEL: "System Tag",
	SYSTEM_NICKNAME_FORM_LABEL: "System Nickname Format",
	SYSTEM_NICKNAME_FORM_DESC:
		'Where "%username%" is your alter username, "%display%" is your alter display name',

	ALTER_PROXY_TAGS:
		"## Proxy Tags - @%alter%\nProxy tags are the way your alter *fronts* depending on the contents of your message. You can create multiple of these, with 20 characters as the prefix/suffix of each descriptor for proxy tags.",
	ALTER_FORM_TITLE: "Editing Alter",
	ALTER_GENERAL:
		"## %general% General Settings - @%alter%\nAlter's are parts of your system. Certain values of your alter can be configured here.",
	ALTER_SET_USERNAME: "Set Alter Username",
	ALTER_SET_DISPLAY: "Set Display Name",
	ALTER_SET_SERVER_NAME: "Set Server Display Name",
	ALTER_SET_SERVER_NAME_DESC: `Setting this value will make this alter's display name a different value when fronting in %server%.
-# Your name in %server% is: %name%`,
	ALTER_SET_USERNAME_DESC:
		"Alter usernames cannot have any spaces and can only be less than 20 characters. They are used to identify your system in commands.",
	ALTER_SET_USERNAME_SPACES:
		"There cannot be spaces, `@`, `\\` or `/` in usernames.",
	ALTER_DISPLAY_NAME_FORM_LABEL: "Display Name",
	ALTER_SET_PRONOUNS: "Set Pronouns",
	ALTER_SET_DESCRIPTION: "Set Description",
	ALTER_SET_PFP: "Set Profile Picture",
	ALTER_SET_TAG: "Set System Tag",
	ALTER_SET_BANNER: "Set Banner",
	ALTER_SET_PRIVACY: "Set Privacy",
	ERROR_INVALID_ATTACHMENT_TYPE:
		"2s – The attachment you uploaded is not an image.",
	ERROR_INVALID_COLOR: "2t – The color you entered is not a valid hex color.",
	ERROR_INVALID_NUMBER: "2t – The number you entered is not a valid decimal.",

	TAG_GENERAL:
		"## %general% General Settings - %tag%\nTag's are specific groups your alter can be apart of. Certain values of your tag can be configured here.",
	TAG_SET_DISPLAY_NAME_DESC:
		"Tag display names are the only form of identification for tags. They can only be less than 100 characters.",
	TAG_SET_COLOR_DESC:
		"There are 17 different colors you can pick for your tag all with a unique colored icon to tell them apart.",
	TAG_SET_PRIVACY_DESC:
		"By default, all tag values are private. Use the button to set public values.",
	TAG_FORM_TITLE: "Editing Tag",
	TAG_SET_COLOR: "Set Tag Color",
	TAG_COLOR_FORM_LABEL: "Tag Color",
	TAG_SET_PRIVACY: "Set Tag Privacy",
	TAG_PRIVACY_FORM_LABEL: "Tag Privacy",
	TAG_PRIVACY_FORM_DESC: "Select all public privacy values.",

	TAG_COLOR_red: "red",
	TAG_COLOR_orange: "orange",
	TAG_COLOR_amber: "amber",
	TAG_COLOR_yellow: "yellow",
	TAG_COLOR_lime: "lime",
	TAG_COLOR_green: "green",
	TAG_COLOR_emerald: "emerald",
	TAG_COLOR_teal: "teal",
	TAG_COLOR_cyan: "cyan",
	TAG_COLOR_sky: "sky",
	TAG_COLOR_blue: "blue",
	TAG_COLOR_indigo: "indigo",
	TAG_COLOR_violet: "violet",
	TAG_COLOR_purple: "purple",
	TAG_COLOR_fuchsia: "fuchsia",
	TAG_COLOR_pink: "pink",
	TAG_COLOR_rose: "rose",

	SEARCH_FORM_TITLE: "Searching Resources",
	SEARCH_QUERY: "Search Query",
	SEARCH_QUERY_VALUE: "Search Query Value",
	SEARCH_QUERY_VALUE_DESC: "You can pick to query different values.",
	SEARCH_QUERY_DISPLAY_NAME: "Display Name",
	SEARCH_QUERY_USERNAME: "Username",
	SEARCH_REG_EXPRESSIONS: "You can use regular expressions here.",
	DISABLED_SYSTEM:
		"Successfully disabled your system. You will **not** be able to proxy anymore as your entire system has been **disabled**.",
	ENABLED_SYSTEM:
		"Successfully enabled your system. You will be able to proxy as your entire system has been **enabled**.",

	NOT_IN_LATCH: "You are not in latch mode.",

	ALTER_SET_COLOR: "Set Alter Color",
	DELETE_ALTER: "Delete Alter",
	ALTER_SET_MODE: "Set Proxy Mode",
	ALTER_SET_MODE_DESC: `Proxy modes describe how the alter proxies. There are three main methods for alter proxying:
> - *Nickname*: Your nickname is adjusted based on this alters display name & the system nickname convention. You are required to have the Change Nickname permission for this to work.
> - *Webhooks*: A webhook is created with your alter & system data that will replace your message. Similar to bots like PluralKit and Tupperbox. Default mode.
> - *Both*: Sets both a nickname and sends a webhook based on alter.`,
	ALTER_SET_PRIVACY_DESC: `By default, this alter is completely private besides for server automatic moderation and if you use command publicly. 
(with \`-public\` at the end) Configuring this values tells PluralBuddy what to show to people that isn't yourself.`,

	ALTER_DELETE: "Delete Alter",
	SYSTEM_ADVANCED_IMPORT:
		"Successfully performed an advanced import operation. **{{ alter-count }}** alter(s) and **{{ tag-count }}** tag(s) were affected in this import operation.",
	ALTER_DELETE_DESC:
		"Deleting an alter will completely remove the alter from the system without the option to undo.",

	PFP_SUCCESS: "Successfully updated the profile picture for @%alter%.",
	BANNER_SUCCESS: "Successfully updated the banner for @%alter%.",
	RENAME_SUCCESS: "Successfully updated the username for @%alter%.",
	TAG_RENAME_SUCCESS: "Successfully updated the display name for %tag%.",
	DN_SUCCESS:
		"Successfully updated the display name for @%alter% to %new-display%.",
	DN_SUCCESS_SS:
		"Successfully updated the display name for @%alter% to %new-display% **in %server%**.",
	COLOR_SUCCESS: "Successfully updated the color for @%alter%.",
	ERROR_MANUAL_PROXY:
		"2u – There was an error while manually proxying. Please try again later.",
	SUCCESS_PROXY: "[Your message](<%message-link%>) has been sent!",
	CONTENT_ERROR_PROXY:
		"2v – You must either have some text or an attachment to proxy.",

	ERROR_USER_BLACKLISTED:
		"2a – This user is blacklisted from using PluralBuddy.",

	OPERATION_HEADER: "Operation Transcript:",
	OPERATION_DISCORD: "%clock% Expires in 30 minutes • %discord% Discord",
	OPERATION_DISCORD_AP:
		"Switched in %server_name% (\`%server_id%\`) • %discord% Discord",
	CLEARED_LATCH: "Successfully cleared the **latch alter** in %server_name%.",
	NO_PERMISSIONS_PROXY:
		"I cannot proxy here since I do not have `Manage Webhooks` & `Manage Messages` permissions in this channel.",
	NICKNAME_MANUAL_PROXY:
		"You cannot proxy here since the alter you specified is using the Nickname proxy mode, and you cannot send a normal message when using the manual proxy command. Please use automatic proxying instead.",
	OPERATION_ID: "Operation ID: %id%",
	OPERATION_CHANGE_NAME: "Set system name to `%name%`.",
	OPERATION_CHANGE_NICKNAME_FORMAT: "Set nickname format to `%format%`.",
	OPERATION_CHANGE_DISABLED: "Disabled system",
	OPERATION_CHANGE_ENABLED: "Enabled system",
	OPERATION_CHANGE_PRIVACY: "Set system privacy values to %privacy%.",
	OPERATION_UNDO_SUCCESS:
		"Successfully updated %value-count% value(s) as result of an undo action.",
	NEW_ROLE_PREF: "Creating Role Preference...",
	ROLE_USAGE: "Role",

	ABOUT_PB: `### PluralBuddy Build #%version% · \`%branch%\`
%github% [GitHub](https://github.com) · %docs% [Docs](https://pb.giftedly.dev)

> PluralBuddy is an accessibility tool for those who are DID/OSDD systems, allowing system *alters* to make pseudo-accounts as webhooks to represent a certain alter.
> This bot was made as a faster, more controllable alternative to other plural bots.
> To get started with using PluralBuddy, use %command%.

> **Credits:**
> %linein% Programmed w/ :heart_hands: by @giftedly 
> %lineright% Art by %catjamming% @raincloudzy

-# [Terms of Service](<https://pb.giftedly.dev/docs/policies/terms>) · [Privacy Policy](<https://pb.giftedly.dev/docs/policies/privacy>)`,

	TAG_ASSIGN_ALTER: "Assign Tag",
	SET_AUTO_PROXY:
		"Successfully set proxy mode to **%mode%** for your system in **%server_name%**.",
	SET_AUTO_PROXY_DMS:
		"Successfully set proxy mode to **%mode%** for your system in that server.",
	TAG_ALREADY_ASSIGNED: "**%tag%** has already been assigned to **@%alter%.",
	ASSIGNED_TAG: "**%tag%** has been successfully assigned to **@%alter%**.",
	FORBIDDEN: "You do not have permission on this server to do this action.",
	ERROR_FAILED_TO_UPLOAD_TO_GCP:
		"2d – Failed to upload the image to Google Cloud Platform. Please try again later.",
	DN_ERROR_SE: "2e – You cannot use this command in DM's.",
	SYSTEM_SET_NAME: "Successfully changed the name of your system to %name%",
	SYSTEM_SET_LATCH_DELAY:
		"Successfully changed the latch delay to %delay%. Latch alters will be cleared after that time period.",
	SYSTEM_SET_PRONOUNS:
		"Successfully changed the pronouns of your system to %pronouns%",
	SYSTEM_SET_SYSTEM_TAG:
		"Successfully changed the system tag of your system to %tag%",
	OPERATION_SYSTEM_SET_SYSTEM_TAG:
		"Changed the system tag of your system to %tag%",
	OPERATION_AVATAR: "Set system avatar to a **[new image](<%link%>)**.",
	OPERATION_AVATAR_UNDEFINED: "Reset system avatar",
	OPERATION_BANNER: "Set system banner to a **[new image](<%link%>)**.",
	OPERATION_BANNER_UNDEFINED: "Reset system banner",
	OPERATION_DESCRIPTION: "Set system description to:\n > %description%",
	OPERATION_PRONOUNS: "Set system pronouns to %pronouns%.",
	OPERATION_LATCH_DELAY: "Set latch delay to %delay%.",
	OPERATION_FALLBACK: "Set \`%property%\` to \`%value%\`",

	EDIT_MESSAGE: "Editing message",
	MESSAGE_CONTENTS: "New Message Contents",
	BLOCKLIST_USER: "Blocklist User ID",
	NUDGE_BLOCKLIST: "Nudge Blocklist",

	SUCCESSFULLY_REMOVED_MESSAGE: "Successfully deleted that message.",
	SUCCESSFULLY_EDITED_MESSAGE:
		"Successfully edited [that message](<%message%>).",

	NUDGE_SNOOZE: "Permanently snooze nudges",
	BLOCK_SNOOZE: "Block this user from nudging you",

	ERROR_OWN_MESSAGE:
		"2c – You do not own this message or this wasn't sent by PluralBuddy.",
	NOT_RECENT_ENOUGH:
		"2z – You do not have a message in this channel recent enough in this channel.",
	DISABLE_NUDGING_DONE: "Successfully disabled nudging for yourself.",
	USER_CANNOT_BE_NUDGED: "2aa – This user cannot be nudged.",
	USER_ALREADY_BLOCKED: "2ab – This user has already been blocked.",
	USER_NOT_BLOCKED: "2ac – This user hasn't been blocked yet.",

	SUCCESSFULLY_BLOCKED: "Successfully blocked that user.",
	MESSAGE_NOT_MINE: "2af – This message isn't mine.",
	DATA_DOESNT_EXIST:
		"2ae – The alter or system associated with the message doesn't exist anymore. (?)",
	INSUFFICIENT_DATA_SIZE:
		"2ad – There is not a sufficient amount of resources under your user context to continue with this operation.",
	INSUFFICIENT_USER_PERMISSIONS:
		"2ag – You do not have permission to edit this information.",

	SUCCESS_CHANGED_SERVER_PREFIXES:
		"This server now has the following prefixes: \n%prefixes%",
	SUCCESS_ADD_ITEM_BLACKLIST:
		"%item% has been added to the blacklist successfully.",
	SUCCESS_REMOVE_ITEM_BLACKLIST:
		"%item% has been removed from the blacklist successfully.",
	SUCCESS_CHANGED_SERVER_BLACKLIST:
		"This server now has the following blacklist configuration: \n%blacklist_items%",
	PREFIX_ALREADY_EXISTS:
		"That prefix already exists or there is a duplicate in the array.",
	BLACKLIST_ALREADY_EXISTS: "That role or channel is already on the blacklist.",
	SUCCESS_ADD_MANAGER_ROLE:
		"%item% has been added to the manager role list successfully.",
	SUCCESS_CHANGED_MANAGER_BLACKLIST:
		"This server now has the following manager role configuration: \n%manager_roles%",
	LATCH_DELAY_INVALID:
		"Latch delays cannot be longer than 10 hours, or be an invalid input. ",
	MANAGER_ALREADY_EXISTS:
		"That manager role is already on the manager role list.",
	SUCCESS_REMOVE_MANAGER_ROLE:
		"%item% has been removed from the manager role list successfully.",

	REQUIRE_TAG_ENABLED:
		"All systems will now be required to enable system tags in order to proxy.",
	REQUIRE_TAG_DISABLED:
		"All systems will no longer be required to enable system tags to proxy.",
	ERROR_DOESNT_EXIST: "That error doesn't exist. Has it already been cleared?",
	FEATURE_DISABLED_GUILD: "That feature is disabled on this guild.",
	LOGGING_CHANNEL_SET:
		"Successfuly set that channel as a logging channel for this guild.",
	ROLE_PREFERENCE_ALREADY_EXISTS: "That role preference already exists.",
	ROLE_PREFERENCE_DOESNT_EXIST: "That role preference doesn't exist.",
	ROLE_PREFERENCE_SEARCH: "Searching Roles",
	ERRORS_SEARCH: "Searching Errors",
	ROLE_CONTENTS: "Role Container Contents",
	ROLE_COLOR: "Role Container Color",
	ROLE_LOCATION: "Role Container Location",
	FORM_ROLE_CONFIG: "Editing Role Configuration",
	DELAY_CHANGED:
		"The server proxy delay has been updated to %seconds% seconds (%ms%ms).",
	ROLE_NO_SPECIAL_CONFIG: "This role doesn't have a special configuration.",
	SET_CONTAINERS_CONTENT:
		"Successfully set/cleared the role container <@&%role%>'s content. Above is a preview of the new role container.",
	SET_CONTAINERS_COLOR:
		"Successfully set/cleared the role container <@&%role%>'s color. Above is a preview of the new role container.",
	SET_CONTAINERS_LOCATION:
		"Successfully set/cleared the role container <@&%role%>'s location. Above is a preview of the new role container.",
	DISABLED_FEATURE: `Successfully disabled that feature.

**%name%**
> %description%`,
	ENABLED_FEATURE: `Successfully enabled that feature.

**%name%**
> %description%`,

	AFFECTED_USER: "Affected User Query",
	AFFECTED_CHANNEL: "Affected Channel Query",
	AFFECTED_ERROR_TYPE: "Error Type Query",
};
