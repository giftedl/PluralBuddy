/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { TranslationString } from ".";

export const translations = {
    INTRODUCTION_MESSAGE: `## Welcome to PluralBuddy
PluralBuddy is a bot designed to fill the gap for quality customizable plurality exchanges for Discord servers and users.

:track_next: To get started, click the Next Page button below to setup your system.`,
    IMPORT_MESSAGE: `## Setting up your system
You can create a new system which will allow you to create your alters and tags by yourself.
Additionally, you can also import data from another bot like PluralKit or Tupperbox.`,
    PAGINATION_NEXT_PAGE: "Next Page",
    PAGINATION_FINISH: "Finish",
    PAGINATION_PREVIOUS_PAGE: "Previous Page",
    CREATING_NEW_SYSTEM_HEADER: "## Creating a new system",

    CREATING_NEW_SYSTEM_NAME_MESSAGE: `
Systems on PluralBuddy require a **system name**. They must be at least 3 characters long and shorter than 20 characters long. System names will be shown when somebody identifies a message from your system.`,
    CREATING_NEW_SYSTEM_NAME_BUTTON: "Set name*",
    CREATING_NEW_SYSTEM_NAME_SET: "Name is:",

    CREATING_NEW_SYSTEM_TAG_BUTTON: "Set system tag*",
    CREATING_NEW_SYSTEM_TAG_SET: "System tag is:",
    CREATING_NEW_SYSTEM_TAG_MESSAGE: `
This guild requires a **system tag** for systems who are proxying here. In order to create a system here, you must have a system tag.`,

    CREATING_NEW_SYSTEM_PRIVACY_BUTTON: "Set privacy values",
    CREATING_NEW_SYSTEM_PRIVACY_MESSAGE: `
Systems can have **privacy values** which are values that describe who can see what part of your system. By default, your system is completely private besides server automatic moderation and the message that your system sends. However, changing them will change those values.`,
    CREATING_NEW_SYSTEM_PRIVACY_SET: "Public Privacy values are:",
    CREATING_NEW_SYSTEM_PRIVACY_FORM_DESC: "Select the privacy values you want open to the public.",

    CREATING_NEW_SYSTEM_SUCCESS: `Successfully created new system!
### Next Steps
> - To create a new alter, try using \`%prefix%system new-alter %username% %display name%\`.
> - To create a new tag, try using \`%prefix%system new-tag %name%\``,
    SETUP_ERROR_SYSTEM_ALREADY_EXISTS: "2b – You cannot setup a new system if a system under your account already exists.",
    SETUP_ERROR_SYSTEM_ALREADY_EXISTS_BTN: "Remove system & setup again",
    ERROR_PAGINATION_TOO_OLD: "That alter pagination component is too old, you cannot proceed. Please hit the \"Alters\" tab at the top of the message to reset the pagination.",
    ERROR_TAG_PAGINATION_TOO_OLD: "That tag pagination component is too old, you cannot proceed. Please hit the \"Tags\" tab at the top of the message to reset the pagination.",
    ERROR_NO_ALTERS: "You have no alters! Create one below!",
    ERROR_NO_TAGS: "You have no tags! Create one below!",
    PK_IMPORT_START: "## PluralKit Importing",

    PAGE_NEW_SYS_TEXT: "-# Page 3/3 · Some fields haven't been filled out. · * Required",
    PAGE_NEW_SYS_TEXT_FILLED: "-# Page 3/3 · * Required",
    IMPORT_PLURALKIT_DESCRIPTION: "Import from PluralKit",
    IMPORT_TUPPERBOX_DESCRIPTION: "Import from TupperBox",
    IMPORT_PLURALBUDDY_DESCRIPTION: "Import from PluralBuddy",
    IMPORT_SOURCE_DESCRIPTION: "Import Source",
    CREATE_NEW_SYS_DESCRIPTION: "Create New System",
    PLURALBUDDY_IMPORT_ERROR_TOO_LARGE: "Importing files cannot be larger than 2mb. Please contact support if you are genuinely trying to import a system larger than 2mb.",
    ERROR_ATTACHMENT_TOO_LARGE: "Attachments for banners or profile pictures cannot be larger than 2mb.",
    CREATE_NEW_ALTER_DESCRIPTION: "Create New Alter",
    CREATE_NEW_TAG_DESCRIPTION: "Create New Tag",
    PLURALBUDDY_IMPORT_ERROR_INVALID_JSON: "The file you imported is not valid JSON.",

    ERROR_INTERACTION_TOO_OLD: "This interaction has no longer been kept track of. (have you waited too long?)",
    ERROR_SYSTEM_DOESNT_EXIST: "This operation cannot be concluded because there is no system to operate on.",
    ERROR_ALTER_DOESNT_EXIST: "This operation cannot be concluded because either, there is no alter to operate on, or there is no system associated to the user who created the request.",
    ERROR_TAG_DOESNT_EXIST: "This operation cannot be concluded because either, there is no tag to operate on, or there is no system associated to the user who created the request.",

    CREATING_NEW_SYSTEM_FORM_TITLE: "Set System Details",
    EDIT_SYSTEM_FORM_TITLE: "Editing System",
    SYSTEM_PRONOUNS_FORM_LABEL: "Pronouns",
    SYSTEM_DESCRIPTION_FORM_LABEL: "Description",
    ALTER_SUCCESS_PRONOUNS: "Successfully set pronouns for @%alter% to %new%",
    ALTER_SUCCESS_DESC: "Successfully set description for @%alter%.",
    PAGINATION_TITLE: "Page",
    WAITING: "Loading...",
    SUCCESSFULLY_IMPORTED: "Successfully imported %alter_count% alter(s) for %system_name%.",

    CREATING_NEW_PT_FORM_TITLE: "New proxy tag",
    CREATING_NEW_PT_FORM_DESC: "Input the proxy tag where `text` is the text in the message. For example: `text -bob`",
    CREATING_NEW_PT_FORM_LABEL: "Proxy Tag",
    CREATING_NEW_PT_ERROR: "This is not formatted correctly. Remember, you need to have a prefix and a suffix separated by `text`.",
    CREATING_NEW_PT_TOO_MANY_CHARS: "There is too many characters on either the prefix or suffix side. Remember, you can only have 20 characters for the prefix & 20 characters for the suffix.", 
    SUCCESSFULLY_NEW_PT: "Successfully created a new proxy tag!",

    PLURALBUDDY_IMPORT_SOURCE: "JSON Import Data",
    PLURALBUDDY_IMPORT_DESC: "Copy and paste the exported JSON data below",
    PLURALBUDDY_IMPORT_ERROR: "There was some error(s) while parsing that:\n\n\`\`\`\n%zod_errors%\n\`\`\`",
    PLURALBUDDY_OPTIONS_ERROR: "There was some error(s) while evaluating the arguments to that command:\n\n\`\`\`\n%options_errors%\n\`\`\`",

    CREATE_NEW_ALTER_DONE: "Successfully created a new alter in your system. Use `%prefix%alter %alter_id%` for more details.",
    CREATE_NEW_TAG_DONE: "Successfully created  %color_emoji% **%tag_name%**  in your system. Use `%prefix%tag %tag_name%` for more details.",
    TAG_SPACE_WARNING: "Since this tag has **spaces** in it, some commands may require you put the display name in quotes to be parsed correctly. Additionally, you can just use application commands instead.",
    TAG_ALREADY_EXISTS: "You already have a tag named **%display%** in your system.",

    CONFIRMATION_SYSTEM_DELETION: "Are you sure you'd like to delete your system? **This action cannot be undone.**",
    CONFIRMATION_SYSTEM_DELETION_BTN: "Yes, continue",
    CONFIRMATION_ALTER_DELETION: "Are you sure you'd like to delete @%alter%? **This action cannot be undone.**",

    SYSTEM_DELETION_FINISHED: "Sucessfully deleted your system. \n-# If your DM's are open, you have also been direct messaged a copy of your system export.",
    SYSTEM_DELETION_DM: "Here is the export data due to the deletion on %time%:",
    ALTER_DELETION_FINISHED: "Successfully deleted that alter.",
    ALTER_SERVER_DN_FORM_LABEL: "Server Display Name",

    SYSTEM_EXPORT_FINISHED: "Successfully exported your system. \n-# **Pro tip:** Make sure PluralBuddy can direct message or else the export cannot be sent to you.",
    SYSTEM_EXPORT_DM: "Here is your export data on request:",

    PRIVACY_VISIBILITY:    "Visibility",
    PRIVACY_NAME:          "Display Name Privacy",
    PRIVACY_USERNAME:      "Username Privacy",
    PRIVACY_DISPLAY_TAG:   "Display Tag Privacy",
    PRIVACY_DESCRIPTION:   "Description Privacy",
    PRIVACY_COLOR:         "Color Privacy",
    PRIVACY_AVATAR:        "Avatar Privacy",
    PRIVACY_BANNER:        "Banner Privacy",
    PRIVACY_MESSAGE_COUNT: "Message Count Privacy",
    PRIVACY_PRONOUNS:      "Pronouns Privacy",
    PRIVACY_ALTERS:        "Alter Privacy",
    PRIVACY_TAGS:          "Tags Privacy",

    INVISIBLE_ALTER: "You cannot view this alter due to their privacy settings.",
    INVISIBLE_TAG: "You cannot view this tag due to its privacy settings.",

    SYSTEM_NAME_FORM_LABEL: "System Name",
    SYSTEM_PRIVACY_FORM_LABEL: "System Privacy",
    SYSTEM_TAG_FORM_LABEL: "System Tag",
    SYSTEM_NICKNAME_FORM_LABEL: "System Nickname Format",
    SYSTEM_NICKNAME_FORM_DESC: "Where \"%username%\" is your alter username, \"%display%\" is your alter display name",

    ALTER_PROXY_TAGS: "## Proxy Tags - @%alter%\nProxy tags are the way your alter *fronts* depending on the contents of your message. You can create multiple of these, with 20 characters as the prefix/suffix of each descriptor for proxy tags.",
    ALTER_FORM_TITLE: "Editing Alter",
    ALTER_GENERAL: "## %general% General Settings - @%alter%\nAlter's are parts of your system. Certain values of your alter can be configured here.",
    ALTER_SET_USERNAME: "Set Alter Username",
    ALTER_SET_DISPLAY: "Set Display Name",
    ALTER_SET_SERVER_NAME: "Set Server Display Name",
    ALTER_SET_SERVER_NAME_DESC: `Setting this value will make this alter's display name a different value when fronting in %server%.
-# Your name in %server% is: %name%`,
    ALTER_SET_USERNAME_DESC: "Alter usernames cannot have any spaces and can only be less than 20 characters. They are used to identify your system in commands.",
    ALTER_SET_USERNAME_SPACES: "There cannot be spaces, `@`, `\\` or `/` in usernames.",
    ALTER_DISPLAY_NAME_FORM_LABEL: "Display Name",
    ALTER_SET_PRONOUNS: "Set Pronouns",
    ALTER_SET_DESCRIPTION: "Set Description",
    ALTER_SET_PFP: "Set Profile Picture",
    ALTER_SET_BANNER: "Set Banner",
    ALTER_SET_PRIVACY: "Set Privacy",
    ERROR_INVALID_ATTACHMENT_TYPE: "The attachment you uploaded is not an image.",
    ERROR_INVALID_COLOR: "The color you entered is not a valid hex color.",

    TAG_GENERAL: "## %general% General Settings - %tag%\nTag's are specific groups your alter can be apart of. Certain values of your tag can be configured here.",
    TAG_SET_DISPLAY_NAME_DESC: "Tag display names are the only form of identification for tags. They can only be less than 100 characters.",
    TAG_SET_COLOR_DESC: "There are 17 different colors you can pick for your tag all with a unique colored icon to tell them apart.",
    TAG_SET_PRIVACY_DESC: "By default, all tag values are private. Use the button to set public values.",
    TAG_FORM_TITLE: "Editing Tag",
    TAG_SET_COLOR: "Set Tag Color",
    TAG_COLOR_FORM_LABEL: "Tag Color",
    TAG_SET_PRIVACY: "Set Tag Privacy",
    TAG_PRIVACY_FORM_LABEL: "Tag Privacy",
    TAG_PRIVACY_FORM_DESC: "Select all public privacy values.",

    TAG_COLOR_red:    "red",
    TAG_COLOR_orange: "orange",
    TAG_COLOR_amber:  "amber",
    TAG_COLOR_yellow: "yellow",
    TAG_COLOR_lime:   "lime",
    TAG_COLOR_green:  "green",
    TAG_COLOR_emerald: "emerald",
    TAG_COLOR_teal:   "teal",
    TAG_COLOR_cyan:   "cyan",
    TAG_COLOR_sky:    "sky",
    TAG_COLOR_blue:   "blue",
    TAG_COLOR_indigo: "indigo",
    TAG_COLOR_violet: "violet",
    TAG_COLOR_purple: "purple",
    TAG_COLOR_fuchsia: "fuchsia",
    TAG_COLOR_pink:   "pink",
    TAG_COLOR_rose:   "rose",

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
    ALTER_DELETE_DESC: "Deleting an alter will completely remove the alter from the system without the option to undo.",

    PFP_SUCCESS: "Successfully updated the profile picture for @%alter%.",
    BANNER_SUCCESS: "Successfully updated the banner for @%alter%.",
    RENAME_SUCCESS: "Successfully updated the username for @%alter%.",
    DN_SUCCESS: "Successfully updated the display name for @%alter% to %new-display%.",
    DN_SUCCESS_SS: "Successfully updated the display name for @%alter% to %new-display% **in %server%**.",
    COLOR_SUCCESS: "Successfully updated the color for @%alter%.",
    ERROR_MANUAL_PROXY: "There was an error while manually proxying. Please try again later.",
    SUCCESS_PROXY: "[Your message](<%message-link%>) has been sent!",
    CONTENT_ERROR_PROXY: "You must either have some text or an attachment to proxy.",

    ERROR_USER_BLACKLISTED: "2a – This user is blacklisted from using PluralBuddy.",

    OPERATION_HEADER: "Operation Transcript:",
    OPERATION_DISCORD: "%clock% Expires in 30 minutes • %discord% Discord",
    NO_PERMISSIONS_PROXY: "I cannot proxy here since I do not have `Manage Webhooks` & `Manage Messages` permissions in this channel.",
    NICKNAME_MANUAL_PROXY: "You cannot proxy here since the alter you specified is using the Nickname proxy mode, and you cannot send a normal message when using the manual proxy command. Please use automatic proxying instead.",
    OPERATION_ID: "Operation ID: %id%",
    OPERATION_CHANGE_NAME: "Set system name to `%name%`.",
    OPERATION_CHANGE_NICKNAME_FORMAT: "Set nickname format to `%format%`.",
    OPERATION_CHANGE_PRIVACY: "Set system privacy values to %privacy%.",
    OPERATION_UNDO_SUCCESS: "Successfully updated %value-count% value(s) as result of an undo action.",

    ABOUT_PB: `### PluralBuddy Build #%version% · \`%branch%\`
%github% [GitHub](https://github.com) · %docs% [Docs](https://pb.giftedly.dev)

> PluralBuddy is an accessibility tool for those who are DID/OSDD systems, allowing system *alters* to make pseudo-accounts as webhooks to represent a certain alter.
> This bot was made as a faster, more controllable alternative to other plural bots.
> To get started with using PluralBuddy, use \`%prefix%setup\`.

> **Credits:**
> %linein% Programmed w/ :heart_hands: by @giftedly 
> %lineright% Art by %catjamming% @raincloudzy`,
    FORBIDDEN: "You do not have permission on this server to do this action.",
    ERROR_FAILED_TO_UPLOAD_TO_GCP: "Failed to upload the image to Google Cloud Platform. Please try again later.",
    DN_ERROR_SE: "You cannot use this command in DM's."
}