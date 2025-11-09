/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { TranslationString } from ".";

export const translations: TranslationString = {
    INTRODUCTION_MESSAGE: `## Welcome to PluralBuddy
PluralBuddy is a bot designed to fill the gap for quality customizable plurality exchanges for Discord servers and users.

:track_next:  To get started, click the Next Page button below to setup your system.`,
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

    CREATING_NEW_SYSTEM_SUCCESS: "Successfully created new system!",
    SETUP_ERROR_SYSTEM_ALREADY_EXISTS: "2b – You cannot setup a new system if a system under your account already exists.",
    SETUP_ERROR_SYSTEM_ALREADY_EXISTS_BTN: "Remove system & setup again",

    PAGE_NEW_SYS_TEXT: "-# Page 3/3 · Some fields haven't been filled out. · * Required",
    PAGE_NEW_SYS_TEXT_FILLED: "-# Page 3/3 · * Required",
    IMPORT_PLURALKIT_DESCRIPTION: "Import from PluralKit",
    IMPORT_TUPPERBOX_DESCRIPTION: "Import from TupperBox",
    IMPORT_PLURALBUDDY_DESCRIPTION: "Import from PluralBuddy",
    IMPORT_SOURCE_DESCRIPTION: "Import Source",
    CREATE_NEW_SYS_DESCRIPTION: "Create New System",

    ERROR_INTERACTION_TOO_OLD: "This interaction has no longer been kept track of. (have you waited too long?)",
    ERROR_SYSTEM_DOESNT_EXIST: "This operation cannot be concluded because there is no system to operate on.",
    ERROR_ALTER_DOESNT_EXIST: "This operation cannot be concluded because either:\na. There is no alter to operate on or\nb. There is no system associated to the user who created the request.",

    CREATING_NEW_SYSTEM_FORM_TITLE: "Set System Details",
    EDIT_SYSTEM_FORM_TITLE: "Editing System",
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

    CONFIRMATION_SYSTEM_DELETION: "Are you sure you'd like to delete your system? **This action cannot be undone.**",
    CONFIRMATION_SYSTEM_DELETION_BTN: "Yes, continue",

    SYSTEM_DELETION_FINISHED: "Sucessfully deleted your system. \n-# If your DM's are open, you have also been direct messaged a copy of your system export.",
    SYSTEM_DELETION_DM: "Here is the export data due to the deletion on %time%:",

    SYSTEM_EXPORT_FINISHED: "Successfully exported your system. \n-# **Pro tip:** Make sure PluralBuddy can direct message or else the export cannot be sent to you.",
    SYSTEM_EXPORT_DM: "Here is your export data on request:",

    PRIVACY_NAME:        "Name Privacy",
    PRIVACY_DISPLAY_TAG: "Display Tag Privacy",
    PRIVACY_DESCRIPTION: "Description Privacy",
    PRIVACY_AVATAR:      "Avatar Privacy",
    PRIVACY_BANNER:      "Banner Privacy",
    PRIVACY_PRONOUNS:    "Pronouns Privacy",
    PRIVACY_ALTERS:      "Alter Privacy",
    PRIVACY_TAGS:        "Tags Privacy",

    SYSTEM_NAME_FORM_LABEL: "System Name",
    SYSTEM_PRIVACY_FORM_LABEL: "System Privacy",
    SYSTEM_TAG_FORM_LABEL: "System Tag",

    ALTER_PROXY_TAGS: "## Proxy Tags - @%alter%\nProxy tags are the way your alter *fronts* depending on the contents of your message. You can multiple of these, with 20 characters as the prefix/suffix of each descriptor for proxy tags.",
    
    PFP_SUCCESS: "Successfully updated the profile picture for @%alter%.",
    RENAME_SUCCESS: "Successfully updated the username for @%alter%.",
    COLOR_SUCCESS: "Successfully updated the color for @%alter%.",

    ERROR_USER_BLACKLISTED: "2a – This user is blacklisted from using PluralBuddy.",

    OPERATION_HEADER: "Operation Transcript:",
    OPERATION_DISCORD: "%clock% Expires in 30 minutes • %discord% Discord",
    OPERATION_ID: "Operation ID: %id%",
    OPERATION_CHANGE_NAME: "Set system name to `%name%`.",
    OPERATION_CHANGE_PRIVACY: "Set system privacy values to %privacy%.",
    OPERATION_UNDO_SUCCESS: "Successfully updated %value-count% value(s) as result of an undo action.",

    ABOUT_PB: `**PluralBuddy Build #%version%** · \`%branch%\`

[GitHub](https://github.com) · [Docs](https://pb.giftedly.dev)

> **Credits:**
> Programmed w/ :heart_hands: by @giftedly 
> Art by @rainecloudzy`
}