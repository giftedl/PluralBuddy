
  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
   ,-[src/lib/clean-up-emojis.ts:7:68]
 6 | 
 7 |   for (const emoji of deletableEmojis) await emoji.delete().catch((_) => null);
   :                                                                    |
   :                                                                    `-- '_' is declared here
 8 | }
   `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/tags/config/set-display-name-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-display-name-form.ts:7:10]
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 8 | import { AlterView } from "@/views/alters";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
   ,-[src/components/systems/tags/config/set-display-name-form.ts:8:10]
 7 | import { alterCollection, tagCollection } from "@/mongodb";
 8 | import { AlterView } from "@/views/alters";
   :          ^^^^|^^^^
   :              `-- 'AlterView' is imported here
 9 | import { TagView } from "@/views/tags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'client' is imported but never used.
   ,-[src/lib/command-list.ts:2:10]
 1 | import { ApplicationCommandType } from "seyfert/lib/types";
 2 | import { client } from "..";
   :          ^^^|^^
   :             `-- 'client' is imported here
 3 | import { loadedApplicationCommands } from "./mention-command";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
   ,-[src/components/systems/config/toggle-disable-system.ts:7:10]
 6 | import { createSystemOperation } from "@/lib/system-operation";
 7 | import { userCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'userCollection' is imported here
 8 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'User' is imported but never used.
    ,-[src/views/message-info.ts:10:3]
  9 |   TextDisplay,
 10 |   User,
    :   ^^|^
    :     `-- 'User' is imported here
 11 |   type GuildMemberStructure,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'UserStructure' is imported but never used.
    ,-[src/views/message-info.ts:12:8]
 11 |   type GuildMemberStructure,
 12 |   type UserStructure,
    :        ^^^^^^|^^^^^^
    :              `-- 'UserStructure' is imported here
 13 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
    ,-[src/views/message-info.ts:15:10]
 14 | import { ComponentType, Spacing } from "seyfert/lib/types";
 15 | import { AlertView } from "./alert";
    :          ^^^^|^^^^
    :              `-- 'AlertView' is imported here
 16 | import { AlterView } from "./alters";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'contents' is assigned a value but never used. Unused variables should start with a '_'.
    ,-[src/views/message-info.ts:30:9]
 29 |   ) {
 30 |     let contents = "";
    :         ^^^^|^^^
    :             `-- 'contents' is declared here
 31 | 
 32 |     if (messageNative.components !== undefined) {
 33 |       if (
 34 |         messageNative.components[0] !== undefined &&
 35 |         messageNative.components[0].type === ComponentType.TextDisplay &&
 36 |         messageNative.components[0] instanceof TextDisplayComponent
 37 |       ) {
 38 |         if (!messageNative.components[0].content.startsWith(`-# ${emojis.reply}`))
 39 |           contents = messageNative.components[0].content;
 40 |         else if (
 41 |           messageNative.components[1] !== undefined &&
 42 |           messageNative.components[1].type === ComponentType.TextDisplay &&
 43 |           messageNative.components[1] instanceof TextDisplayComponent
 44 |         )
 45 |           contents = messageNative.components[1].content;
    :           ^^^^|^^^
    :               `-- it was last assigned here
 46 |       }
    `----
  help: Did you mean to use this variable?

  ! eslint(no-unused-vars): Identifier 'StringSelectMenu' is imported but never used.
   ,-[src/components/guilds/roles/general/location.ts:6:3]
 5 |   Modal,
 6 |   StringSelectMenu,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'StringSelectMenu' is imported here
 7 |   StringSelectOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'StringSelectOption' is imported but never used.
   ,-[src/components/guilds/roles/general/location.ts:7:3]
 6 |   StringSelectMenu,
 7 |   StringSelectOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'StringSelectOption' is imported here
 8 |   RadioGroup,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
    ,-[src/components/guilds/roles/general/location.ts:9:3]
  8 |   RadioGroup,
  9 |   TextInput,
    :   ^^^^|^^^^
    :       `-- 'TextInput' is imported here
 10 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/guilds/roles/general/location.ts:13:10]
 12 | } from "seyfert";
 13 | import { TextInputStyle } from "seyfert/lib/types";
    :          ^^^^^^^|^^^^^^
    :                 `-- 'TextInputStyle' is imported here
 14 | import { InteractionIdentifier } from "@/lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'DiscordSnowflake' is imported but never used.
   ,-[src/lib/importing/tupperbox.ts:1:10]
 1 | import { DiscordSnowflake } from "@sapphire/snowflake";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'DiscordSnowflake' is imported here
 2 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterProtectionFlags' is imported but never used.
   ,-[src/lib/importing/tupperbox.ts:3:3]
 2 | import {
 3 |   AlterProtectionFlags,
   :   ^^^^^^^^^^|^^^^^^^^^
   :             `-- 'AlterProtectionFlags' is imported here
 4 |   type PAlter,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TagProtectionFlags' is imported but never used.
   ,-[src/lib/importing/tupperbox.ts:8:3]
 7 |   PTagObject,
 8 |   TagProtectionFlags,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'TagProtectionFlags' is imported here
 9 |   TupperBoxSystem,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'combine' is imported but never used.
    ,-[src/lib/importing/tupperbox.ts:13:10]
 12 | import { alterCollection, tagCollection, userCollection } from "@/mongodb";
 13 | import { combine } from "../privacy-bitmask";
    :          ^^^|^^^
    :             `-- 'combine' is imported here
 14 | import { createRandomId } from "../random-id";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/lib/cleanup-indexing.ts:33:45]
 32 |             ) {
 33 |               await message.delete().catch((_) => null);
    :                                             |
    :                                             `-- '_' is declared here
 34 |               delete indexingMessageMap[user];
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/systems/alter-list.command.ts:8:3]
 7 |   type CommandContext,
 8 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 9 |   createBooleanOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/ap.ts:4:3]
 3 |   type CommandContext,
 4 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 5 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/commands/ap.ts:9:3]
  8 |   Options,
  9 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 10 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/components/systems/pagination/page-3.ts:3:51]
 2 | 
 3 | import { ComponentCommand, type ComponentContext, Container, TextDisplay } from "seyfert";
   :                                                   ^^^^|^^^^
   :                                                       `-- 'Container' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/pagination/page-3.ts:3:62]
 2 | 
 3 | import { ComponentCommand, type ComponentContext, Container, TextDisplay } from "seyfert";
   :                                                              ^^^^^|^^^^^
   :                                                                   `-- 'TextDisplay' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-username-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'DiscordSnowflake' is imported but never used.
   ,-[src/lib/importing/pluralkit.ts:1:10]
 1 | import { DiscordSnowflake } from "@sapphire/snowflake";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'DiscordSnowflake' is imported here
 2 | import {
   `----
  help: Consider removing this import.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
    ,-[src/lib/importing/pluralkit.ts:82:15]
 81 |             public: combine(
 82 |               ...[
    :               ^^^
 83 |                 ...(member.privacy.visibility === "public"
    `----
  help: Pass arguments directly instead of spreading an array.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
     ,-[src/lib/importing/pluralkit.ts:140:13]
 139 |           public: combine(
 140 |             ...[
     :             ^^^
 141 |               ...(group.privacy.description_privacy === "public"
     `----
  help: Pass arguments directly instead of spreading an array.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
     ,-[src/lib/importing/pluralkit.ts:220:15]
 219 |             public: combine(
 220 |               ...[
     :               ^^^
 221 |                 ...(member.privacy.visibility === "public"
     `----
  help: Pass arguments directly instead of spreading an array.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
     ,-[src/lib/importing/pluralkit.ts:276:11]
 275 |         public: combine(
 276 |           ...[
     :           ^^^
 277 |             ...(group.privacy.description_privacy === "public"
     `----
  help: Pass arguments directly instead of spreading an array.

  ! eslint(no-unused-vars): Type 'Client' is imported but never used.
   ,-[src/plugins/yunaforseyfert.ts:1:15]
 1 | import type { Client } from "seyfert";
   :               ^^^|^^
   :                  `-- 'Client' is imported here
 2 | import { Yuna } from "yunaforseyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/commands/uno-reverse.ts:2:3]
 1 | import {
 2 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/components/systems/pagination/page-2.ts:3:51]
 2 | 
 3 | import { ComponentCommand, type ComponentContext, Container, TextDisplay } from "seyfert";
   :                                                   ^^^^|^^^^
   :                                                       `-- 'Container' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/pagination/page-2.ts:3:62]
 2 | 
 3 | import { ComponentCommand, type ComponentContext, Container, TextDisplay } from "seyfert";
   :                                                              ^^^^^|^^^^^
   :                                                                   `-- 'TextDisplay' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PGuildObject' is imported but never used.
    ,-[src/views/server-cfg.ts:16:44]
 15 | import { emojis } from "@/lib/emojis";
 16 | import { type GuildErrorTypes, GuildFlags, PGuildObject, type PGuild } from "plurography";
    :                                            ^^^^^^|^^^^^
    :                                                  `-- 'PGuildObject' is imported here
 17 | import { mentionCommand } from "@/lib/mention-command";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'queryData' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/views/server-cfg.ts:409:5]
 408 |     currentPage?: number,
 409 |     queryData?: PGuild["rolePreferences"],
     :     ^^^^|^^^^
     :         `-- 'queryData' is declared here
 410 |   ) {
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Function 'capitalize' is declared but never used.
     ,-[src/views/server-cfg.ts:557:10]
 556 | 
 557 | function capitalize(s: string) {
     :          ^^^^^|^^^^
     :               `-- 'capitalize' is declared here
 558 |   return String(s[0]).toUpperCase() + String(s).slice(1);
     `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/lib/alter-operation.ts:3:10]
 2 | 
 3 | import { ActionRow, Button, Container, Section, TextDisplay, type DefaultLocale } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'ActionRow' is imported here
 4 | import { client } from "..";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'operationCollection' is imported but never used.
   ,-[src/lib/alter-operation.ts:5:53]
 4 | import { client } from "..";
 5 | import { alterCollection, alterOperationCollection, operationCollection } from "../mongodb";
   :                                                     ^^^^^^^^^|^^^^^^^^^
   :                                                              `-- 'operationCollection' is imported here
 6 | import { operationStringGeneration, type POperation } from "../types/operation";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'POperation' is imported but never used.
   ,-[src/lib/alter-operation.ts:6:42]
 5 | import { alterCollection, alterOperationCollection, operationCollection } from "../mongodb";
 6 | import { operationStringGeneration, type POperation } from "../types/operation";
   :                                          ^^^^^|^^^^
   :                                               `-- 'POperation' is imported here
 7 | import type { PAlter } from "../types/alter";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'TranslationString' is imported but never used.
   ,-[src/lib/alter-operation.ts:8:15]
 7 | import type { PAlter } from "../types/alter";
 8 | import type { TranslationString } from "../lang";
   :               ^^^^^^^^|^^^^^^^^
   :                       `-- 'TranslationString' is imported here
 9 | import { InteractionIdentifier } from "./interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'writeUserById' is imported but never used.
    ,-[src/lib/alter-operation.ts:11:23]
 10 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 11 | import { getUserById, writeUserById } from "../types/user";
    :                       ^^^^^^|^^^^^^
    :                             `-- 'writeUserById' is imported here
 12 | import { emojis } from "./emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'convert' is imported but never used.
    ,-[src/lib/alter-operation.ts:14:8]
 13 | import { friendlyProtectionAlters, listFromMaskAlters } from "./privacy-bitmask";
 14 | import convert from "./delay-converter";
    :        ^^^|^^^
    :           `-- 'convert' is imported here
 15 | import type { PAlterOperation } from "plurography";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/lib/alter-operation.ts:142:14]
 141 |           .catch(() => null);
 142 |     } catch (_) {}
     :              |
     :              `-- '_' is declared here
 143 | 
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/lib/autoproxy-operation.ts:4:10]
 3 | import type { Guild } from "seyfert";
 4 | import { ActionRow, Button, Container, Section, TextDisplay } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'ActionRow' is imported here
 5 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/lib/autoproxy-operation.ts:76:14]
 75 |         .catch(() => null);
 76 |     } catch (_) {}
    :              |
    :              `-- '_' is declared here
 77 | }
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'getNodeAutoInstrumentations' is imported but never used.
   ,-[src/plugins/opentelemetry.ts:1:10]
 1 | import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
   :          ^^^^^^^^^^^^^|^^^^^^^^^^^^^
   :                       `-- 'getNodeAutoInstrumentations' is imported here
 2 | import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ConsoleMetricExporter' is imported but never used.
   ,-[src/plugins/opentelemetry.ts:3:10]
 2 | import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
 3 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
   :          ^^^^^^^^^^|^^^^^^^^^^
   :                    `-- 'ConsoleMetricExporter' is imported here
 4 | import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PeriodicExportingMetricReader' is imported but never used.
   ,-[src/plugins/opentelemetry.ts:3:33]
 2 | import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
 3 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
   :                                 ^^^^^^^^^^^^^^|^^^^^^^^^^^^^^
   :                                               `-- 'PeriodicExportingMetricReader' is imported here
 4 | import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ConsoleSpanExporter' is imported but never used.
   ,-[src/plugins/opentelemetry.ts:4:30]
 3 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
 4 | import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
   :                              ^^^^^^^^^|^^^^^^^^^
   :                                       `-- 'ConsoleSpanExporter' is imported here
 5 | import { opentelemetry } from "@slipher/opentelemetry";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ServerConfigView' is imported but never used.
   ,-[src/commands/server-config/require-tag.ts:3:10]
 2 | import { AlertView } from "@/views/alert";
 3 | import { ServerConfigView } from "@/views/server-cfg";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ServerConfigView' is imported here
 4 | import { GuildFlags } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'GuildFeature' is imported but never used.
    ,-[src/commands/server-config/require-tag.ts:13:10]
 12 | } from "seyfert";
 13 | import { GuildFeature, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^^|^^^^^
    :                `-- 'GuildFeature' is imported here
 14 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/lib/sanitize-emojis.ts:79:37]
 78 |       for (const emoji of uploadedEmojis) {
 79 |         await emoji.delete().catch((_) => null);
    :                                     |
    :                                     `-- '_' is declared here
 80 |       }
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/components/systems/pagination/page-1.ts:3:51]
 2 | 
 3 | import { ComponentCommand, type ComponentContext, Container, TextDisplay } from "seyfert";
   :                                                   ^^^^|^^^^
   :                                                       `-- 'Container' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/pagination/page-1.ts:3:62]
 2 | 
 3 | import { ComponentCommand, type ComponentContext, Container, TextDisplay } from "seyfert";
   :                                                              ^^^^^|^^^^^
   :                                                                   `-- 'TextDisplay' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PSystem' is imported but never used.
   ,-[src/components/systems/config/set-nickname-form.ts:8:15]
 7 | import { createSystemOperation } from "@/lib/system-operation";
 8 | import type { PSystem } from "@/types/system";
   :               ^^^|^^^
   :                  `-- 'PSystem' is imported here
 9 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MediaGallery' is imported but never used.
   ,-[src/views/pluralbuddy-intro.ts:7:3]
 6 |   Container,
 7 |   MediaGallery,
   :   ^^^^^^|^^^^^
   :         `-- 'MediaGallery' is imported here
 8 |   MediaGalleryItem,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MediaGalleryItem' is imported but never used.
   ,-[src/views/pluralbuddy-intro.ts:8:3]
 7 |   MediaGallery,
 8 |   MediaGalleryItem,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'MediaGalleryItem' is imported here
 9 |   Section,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SelectMenu' is imported but never used.
    ,-[src/views/pluralbuddy-intro.ts:10:3]
  9 |   Section,
 10 |   SelectMenu,
    :   ^^^^^|^^^^
    :        `-- 'SelectMenu' is imported here
 11 |   Separator,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'TranslationString' is imported but never used.
    ,-[src/views/pluralbuddy-intro.ts:20:15]
 19 | import { createdSystems } from "../components/pluralbuddy-intro/create-new-system";
 20 | import type { TranslationString } from "../lang";
    :               ^^^^^^^^|^^^^^^^^
    :                       `-- 'TranslationString' is imported here
 21 | import { InteractionIdentifier } from "../lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'rootInteractionId' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/views/pluralbuddy-intro.ts:254:23]
 253 | 
 254 |   pluralKitImportPage(rootInteractionId: string) {
     :                       ^^^^^^^^|^^^^^^^^
     :                               `-- 'rootInteractionId' is declared here
 255 |     const textContainer = new Container();
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/lib/proxying/dm-replying.ts:70:12]
 69 |       .catch(() => null);
 70 |   } catch (_) {}
    :            |
    :            `-- '_' is declared here
 71 | }
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Type 'Guild' is imported but never used.
   ,-[src/lib/create-error.ts:4:70]
 3 | import type { GuildErrorTypes } from "plurography";
 4 | import { Container, Section, Separator, TextDisplay, Thumbnail, type Guild } from "seyfert";
   :                                                                      ^^|^^
   :                                                                        `-- 'Guild' is imported here
 5 | import type z from "zod";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/commands/who-asked.ts:2:3]
 1 | import {
 2 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'z' is imported but never used.
   ,-[src/lib/export.ts:3:8]
 2 | 
 3 | import z from "zod";
   :        |
   :        `-- 'z' is imported here
 4 | import { PSystemObject, type PSystem } from "../types/system";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/lib/export.ts:4:10]
 3 | import z from "zod";
 4 | import { PSystemObject, type PSystem } from "../types/system";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 5 | import { PAlterObject } from "../types/alter";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PAlterObject' is imported but never used.
   ,-[src/lib/export.ts:5:10]
 4 | import { PSystemObject, type PSystem } from "../types/system";
 5 | import { PAlterObject } from "../types/alter";
   :          ^^^^^^|^^^^^
   :                `-- 'PAlterObject' is imported here
 6 | import { alterCollection, tagCollection } from "../mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PTagObject' is imported but never used.
   ,-[src/lib/export.ts:7:10]
 6 | import { alterCollection, tagCollection } from "../mongodb";
 7 | import { PTagObject } from "@/types/tag";
   :          ^^^^^|^^^^
   :               `-- 'PTagObject' is imported here
 8 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'UUID' is imported but never used.
    ,-[src/lib/export.ts:15:10]
 14 | } from "plurography";
 15 | import { UUID } from "mongodb";
    :          ^^|^
    :            `-- 'UUID' is imported here
 16 | import { listFromMaskAlters, listFromMaskSystems, listFromMaskTags } from "./privacy-bitmask";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'i' is declared but never used. Unused parameters should start with a '_'.
    ,-[src/lib/export.ts:47:46]
 46 | 
 47 |   const convertedAlters = alters.map((alter, i) => ({
    :                                              |
    :                                              `-- 'i' is declared here
 48 |     originalId: alter.alterId,
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter 'i' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/lib/export.ts:104:40]
 103 | 
 104 |   const convertedTags = tags.map((tag, i) =>
     :                                        |
     :                                        `-- 'i' is declared here
 105 |     PluralKitGroup.safeParse({
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-display-name-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/lib/system-operation.ts:3:10]
 2 | 
 3 | import { ActionRow, Button, Container, type DefaultLocale, Section, TextDisplay } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'ActionRow' is imported here
 4 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'TranslationString' is imported but never used.
   ,-[src/lib/system-operation.ts:7:15]
 6 | import { client } from "..";
 7 | import type { TranslationString } from "../lang";
   :               ^^^^^^^^|^^^^^^^^
   :                       `-- 'TranslationString' is imported here
 8 | import { operationCollection } from "../mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'captureEvent' is imported but never used.
   ,-[src/lib/proxying/index.ts:3:25]
 2 | 
 3 | import { addBreadcrumb, captureEvent } from "@sentry/bun";
   :                         ^^^^^^|^^^^^
   :                               `-- 'captureEvent' is imported here
 4 | import { getColor } from "colorthief";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Attachment' is imported but never used.
   ,-[src/lib/proxying/index.ts:7:3]
 6 |   type ApplicationEmoji,
 7 |   Attachment,
   :   ^^^^^|^^^^
   :        `-- 'Attachment' is imported here
 8 |   AttachmentBuilder,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'Webhook' is imported but never used.
    ,-[src/lib/proxying/index.ts:20:8]
 19 |   type UsingClient,
 20 |   type Webhook,
    :        ^^^|^^^
    :           `-- 'Webhook' is imported here
 21 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'TextDisplayComponent' is imported but never used.
    ,-[src/lib/proxying/index.ts:23:15]
 22 | import type { MediaGalleryComponent } from "seyfert/lib/components/MediaGallery";
 23 | import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
    :               ^^^^^^^^^^|^^^^^^^^^
    :                         `-- 'TextDisplayComponent' is imported here
 24 | import type { Message } from "seyfert/lib/structures";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'APIMediaGalleryComponent' is imported but never used.
    ,-[src/lib/proxying/index.ts:26:8]
 25 | import {
 26 |   type APIMediaGalleryComponent,
    :        ^^^^^^^^^^^^|^^^^^^^^^^^
    :                    `-- 'APIMediaGalleryComponent' is imported here
 27 |   AttachmentFlags,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentFlags' is imported but never used.
    ,-[src/lib/proxying/index.ts:27:3]
 26 |   type APIMediaGalleryComponent,
 27 |   AttachmentFlags,
    :   ^^^^^^^|^^^^^^^
    :          `-- 'AttachmentFlags' is imported here
 28 |   ComponentType,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'i' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/lib/proxying/index.ts:178:42]
 177 |             files: [
 178 |               ...fileAttachments.map((c, i) =>
     :                                          |
     :                                          `-- 'i' is declared here
 179 |                 new AttachmentBuilder()
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/lib/proxying/index.ts:270:24]
 269 |                 color = (await getColor(image))?.hex() ?? "Green";
 270 |               } catch (_) {}
     :                        |
     :                        `-- '_' is declared here
 271 | 
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/lib/proxying/index.ts:333:20]
 332 |             })();
 333 |           } catch (_: unknown) {
     :                    |
     :                    `-- '_' is declared here
 334 |             createError(guild.guildId, {
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
     ,-[src/lib/proxying/index.ts:373:15]
 372 |       .delete()
 373 |       .catch((_) => null)
     :               |
     :               `-- '_' is declared here
 374 |       .then(async () => {
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter 'i' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/lib/proxying/index.ts:438:26]
 437 |                 })
 438 |                 .map((v, i) =>
     :                          |
     :                          `-- 'i' is declared here
 439 |                   new AttachmentBuilder()
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter 'i' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/lib/proxying/index.ts:457:28]
 456 |                   })
 457 |                   .map((v, i) =>
     :                            |
     :                            `-- 'i' is declared here
 458 |                     new AttachmentBuilder()
     `----
  help: Consider removing this parameter.

  ! eslint(no-unsafe-optional-chaining): Unsafe usage of optional chaining
     ,-[src/lib/proxying/index.ts:407:23]
 406 |     .map((v, i) => {
 407 |       if (v) return ((components[i]?.toJSON() as MediaGalleryComponent).items ?? [])[0]?.media.url;
     :                       ^^^^^^^^^^^^^^^^^^^^^^^
 408 |       return "";
     `----
  help: If this short-circuits with 'undefined' the evaluation will throw TypeError

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
    ,-[src/commands/set-language.ts:14:10]
 13 | import { langMemoryCache } from "@/lib/lang";
 14 | import { userCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^
    :                 `-- 'userCollection' is imported here
 15 | import { writeUserById } from "@/types/user";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'sourceFilesApi' is declared but never used. Unused variables should start with a '_'.
    ,-[src/commands/set-language.ts:30:37]
 29 |     autocomplete: async (ctx) => {
 30 |       const { translationStatusApi, sourceFilesApi } = new CrowdinApi({
    :                                     ^^^^^^^|^^^^^^
    :                                            `-- 'sourceFilesApi' is declared here
 31 |         token: process.env.CROWDIN_API_KEY ?? "",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'sourceFilesApi' is declared but never used. Unused variables should start with a '_'.
    ,-[src/commands/set-language.ts:65:35]
 64 | 
 65 |     const { translationStatusApi, sourceFilesApi } = new CrowdinApi({
    :                                   ^^^^^^^|^^^^^^
    :                                          `-- 'sourceFilesApi' is declared here
 66 |       token: process.env.CROWDIN_API_KEY ?? "",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Parameter 'v' is declared but never used. Unused parameters should start with a '_'.
    ,-[src/commands/set-language.ts:74:15]
 73 |       )
 74 |       .catch((v) => null);
    :               |
    :               `-- 'v' is declared here
 75 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/commands/help.ts:50:50]
 49 |       if (ctx.isChat() && ctx.message) {
 50 |         (ctx.message as Message).delete().catch((_) => null);
    :                                                  |
    :                                                  `-- '_' is declared here
 51 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/commands/help.ts:59:18]
 58 |           });
 59 |         } catch (_) {}
    :                  |
    :                  `-- '_' is declared here
 60 |         return;
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Type 'TranslationString' is imported but never used.
   ,-[src/views/alert.ts:4:15]
 3 | import { Container, TextDisplay, type DefaultLocale } from "seyfert";
 4 | import type { TranslationString } from "../lang";
   :               ^^^^^^^^|^^^^^^^^
   :                       `-- 'TranslationString' is imported here
 5 | import { TranslatedView } from "./translated-view";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/lib/middleware-issue.ts:4:3]
 3 | import {
 4 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 5 |   TextDisplay,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/lib/middleware-issue.ts:5:3]
 4 |   Container,
 5 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 6 |   type AnyContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'TranslationString' is imported but never used.
    ,-[src/lib/middleware-issue.ts:11:15]
 10 | import { MessageFlags } from "seyfert/lib/types";
 11 | import type { TranslationString } from "../lang";
    :               ^^^^^^^^|^^^^^^^^
    :                       `-- 'TranslationString' is imported here
 12 | import { AlertView } from "../views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Interaction' is imported but never used.
   ,-[src/commands/server-config/view.ts:1:40]
 1 | import { type CommandContext, Declare, Interaction, Middlewares, SubCommand } from "seyfert";
   :                                        ^^^^^|^^^^^
   :                                             `-- 'Interaction' is imported here
 2 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/server-config/view.ts:5:10]
 4 | import { policyModal } from "@/policyModal";
 5 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 6 | import { ServerConfigView } from "@/views/server-cfg";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
    ,-[src/components/systems/config/set-privacy.ts:9:3]
  8 |   TextDisplay,
  9 |   TextInput,
    :   ^^^^|^^^^
    :       `-- 'TextInput' is imported here
 10 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/systems/config/set-privacy.ts:13:24]
 12 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 13 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                        ^^^^^^^|^^^^^^
    :                               `-- 'TextInputStyle' is imported here
 14 | import { privacySelection } from "@/lib/selection-options";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'has' is imported but never used.
    ,-[src/components/systems/config/set-privacy.ts:16:10]
 15 | import { AlertView } from "@/views/alert";
 16 | import { has } from "@/lib/privacy-bitmask";
    :          ^|^
    :           `-- 'has' is imported here
 17 | import { SystemProtectionFlags } from "@/types/system";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SystemProtectionFlags' is imported but never used.
    ,-[src/components/systems/config/set-privacy.ts:17:10]
 16 | import { has } from "@/lib/privacy-bitmask";
 17 | import { SystemProtectionFlags } from "@/types/system";
    :          ^^^^^^^^^^|^^^^^^^^^^
    :                    `-- 'SystemProtectionFlags' is imported here
 18 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'BaseComponentBuilder' is imported but never used.
   ,-[src/lib/views/paginate.ts:6:8]
 5 |   TextDisplay,
 6 |   type BaseComponentBuilder,
   :        ^^^^^^^^^^|^^^^^^^^^
   :                  `-- 'BaseComponentBuilder' is imported here
 7 |   type DefaultLocale,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'tagColors' is imported but never used.
   ,-[src/lib/emojis.ts:3:15]
 2 | 
 3 | import type { tagColors } from "@/types/tag";
   :               ^^^^|^^^^
   :                   `-- 'tagColors' is imported here
 4 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'TextDisplayComponent' is imported but never used.
    ,-[src/lib/proxying/process-edit.ts:18:15]
 17 | } from "seyfert";
 18 | import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
    :               ^^^^^^^^^^|^^^^^^^^^
    :                         `-- 'TextDisplayComponent' is imported here
 19 | import {
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/lib/proxying/process-edit.ts:191:22]
 190 |               color = (await getColor(image))?.hex() ?? "Green";
 191 |             } catch (_) {}
     :                      |
     :                      `-- '_' is declared here
 192 | 
     `----
  help: Consider handling this error.

  ! eslint(no-unsafe-optional-chaining): Unsafe usage of optional chaining
     ,-[src/lib/proxying/process-edit.ts:127:13]
 126 |               (
 127 | ,->             message.components.find(
 128 | |                 (v) =>
 129 | |                   v.data.type === ComponentType.TextDisplay &&
 130 | |                   v.data.content.startsWith(`-# ${emojis.reply}`),
 131 | `->             )?.data as APITextDisplayComponent
 132 |               ).content,
     `----
  help: If this short-circuits with 'undefined' the evaluation will throw TypeError

  ! unicorn(no-useless-spread): Using a spread operator here creates a new object unnecessarily.
     ,-[src/lib/proxying/process-edit.ts:170:11]
 169 |         query: {
 170 |           ...(parent ? { thread_id: channel.id } : {}),
     :           ^^^
 171 |         },
     `----
  help: `parent ? { thread_id: channel.id } : {}` returns a new object. Spreading it into an object expression to create a new object is redundant.

  ! eslint(no-unused-vars): Identifier 'InteractionIdentifier' is imported but never used.
   ,-[src/commands/server-config/set-feature.ts:1:10]
 1 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   :          ^^^^^^^^^^|^^^^^^^^^^
   :                    `-- 'InteractionIdentifier' is imported here
 2 | import { guildCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ServerConfigView' is imported but never used.
   ,-[src/commands/server-config/set-feature.ts:4:10]
 3 | import { AlertView } from "@/views/alert";
 4 | import { ServerConfigView } from "@/views/server-cfg";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ServerConfigView' is imported here
 5 | import { friendlyFeatureIndex } from "../../../../plurography/src/pluralbuddy/guild";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
   ,-[src/commands/auto-proxy/clear-latch.ts:4:10]
 3 | import { runClearLatch } from "@/lib/ap-cmds/clear-latch";
 4 | import { userCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'userCollection' is imported here
 5 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/auto-proxy/clear-latch.ts:5:10]
 4 | import { userCollection } from "@/mongodb";
 5 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 6 | import { type CommandContext, Declare, IgnoreCommand, SubCommand } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
   ,-[src/commands/auto-proxy/clear-latch.ts:7:10]
 6 | import { type CommandContext, Declare, IgnoreCommand, SubCommand } from "seyfert";
 7 | import { MessageFlags } from "seyfert/lib/types";
   :          ^^^^^^|^^^^^
   :                `-- 'MessageFlags' is imported here
 8 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/guilds/set-logging-channel.ts:7:3]
 6 |   Modal,
 7 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 8 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/guilds/set-logging-channel.ts:11:23]
 10 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 11 | import { ChannelType, TextInputStyle } from "seyfert/lib/types";
    :                       ^^^^^^^|^^^^^^
    :                              `-- 'TextInputStyle' is imported here
 12 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/config/sync/write-back-prefs.ts:7:3]
 6 |   Modal,
 7 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 8 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/systems/config/sync/write-back-prefs.ts:8:3]
 7 |   TextDisplay,
 8 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 9 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/systems/config/sync/write-back-prefs.ts:10:24]
  9 | } from "seyfert";
 10 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                        ^^^^^^^|^^^^^^
    :                               `-- 'TextInputStyle' is imported here
 11 | import { InteractionIdentifier } from "@/lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'decryptToken' is imported but never used.
    ,-[src/components/systems/config/sync/write-back-prefs.ts:12:10]
 11 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 12 | import { decryptToken } from "@/lib/pk-token-encryption";
    :          ^^^^^^|^^^^^
    :                `-- 'decryptToken' is imported here
 13 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
     ,-[src/lib/selection-options.ts:106:3]
 105 | export const tagColorSelection = (translations: TranslationString, existing?: string) => [
 106 |   ...tagColors.map((color) =>
     :   ^^^
 107 |     new StringSelectOption()
     `----
  help: `tagColors.map` returns a new array. Spreading it into an array expression to create a new array is redundant.

  ! eslint(no-unused-vars): Identifier 'ObjectId' is imported but never used.
   ,-[src/lib/pk-sync-engine.ts:1:18]
 1 | import { Double, ObjectId } from "bson";
   :                  ^^^^|^^^
   :                      `-- 'ObjectId' is imported here
 2 | import pkceChallenge from "pkce-challenge";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'pkceChallenge' is imported but never used.
   ,-[src/lib/pk-sync-engine.ts:2:8]
 1 | import { Double, ObjectId } from "bson";
 2 | import pkceChallenge from "pkce-challenge";
   :        ^^^^^^|^^^^^^
   :              `-- 'pkceChallenge' is imported here
 3 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Cache' is imported but never used.
    ,-[src/lib/pk-sync-engine.ts:15:10]
 14 | } from "plurography";
 15 | import { Cache, CacheFrom } from "seyfert";
    :          ^^|^^
    :            `-- 'Cache' is imported here
 16 | import type z from "zod";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'importTranscriptCollection' is imported but never used.
    ,-[src/lib/pk-sync-engine.ts:19:3]
 18 |   alterCollection,
 19 |   importTranscriptCollection,
    :   ^^^^^^^^^^^^^|^^^^^^^^^^^^
    :                `-- 'importTranscriptCollection' is imported here
 20 |   tagCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'hexToBuffer' is imported but never used.
    ,-[src/lib/pk-sync-engine.ts:24:10]
 23 | import { client, logger } from "..";
 24 | import { hexToBuffer } from "./hex-buffer-operation";
    :          ^^^^^|^^^^^
    :               `-- 'hexToBuffer' is imported here
 25 | import { pk } from "./pk-api";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'i' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/lib/pk-sync-engine.ts:129:18]
 128 |     .filter((c) => !(pkUsernames.includes(c.displayName) || pkUsernames.includes(c.username)))
 129 |     .forEach((v, i) => {
     :                  |
     :                  `-- 'i' is declared here
 130 |       deletionAlters.push(v);
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'sendAutoproxyOperationDM' is imported but never used.
   ,-[src/commands/auto-proxy/alter.ts:5:10]
 4 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
 5 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
   :          ^^^^^^^^^^^^|^^^^^^^^^^^
   :                      `-- 'sendAutoproxyOperationDM' is imported here
 6 | import { alterCollection, userCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/commands/auto-proxy/alter.ts:6:10]
 5 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
 6 | import { alterCollection, userCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
   ,-[src/commands/auto-proxy/alter.ts:6:27]
 5 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
 6 | import { alterCollection, userCollection } from "@/mongodb";
   :                           ^^^^^^^|^^^^^^
   :                                  `-- 'userCollection' is imported here
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PAutoProxy' is imported but never used.
   ,-[src/commands/auto-proxy/alter.ts:7:15]
 6 | import { alterCollection, userCollection } from "@/mongodb";
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   :               ^^^^^|^^^^
   :                    `-- 'PAutoProxy' is imported here
 8 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/auto-proxy/alter.ts:8:10]
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
 8 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 9 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'User' is imported but never used.
    ,-[src/commands/auto-proxy/alter.ts:15:3]
 14 |   Options,
 15 |   User,
    :   ^^|^
    :     `-- 'User' is imported here
 16 |   IgnoreCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
    ,-[src/commands/auto-proxy/alter.ts:18:10]
 17 | } from "seyfert";
 18 | import { MessageFlags } from "seyfert/lib/types";
    :          ^^^^^^|^^^^^
    :                `-- 'MessageFlags' is imported here
 19 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
   ,-[src/commands/server-config/errors.ts:2:53]
 1 | import { ServerConfigView } from "@/views/server-cfg";
 2 | import { type CommandContext, Declare, Middlewares, Options, SubCommand } from "seyfert";
   :                                                     ^^^|^^^
   :                                                        `-- 'Options' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/guilds/manage-managers-form.ts:2:3]
 1 | import {
 2 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 3 |   type GuildRole,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/guilds/manage-managers-form.ts:7:8]
 6 |   type ModalContext,
 7 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 8 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-pronouns-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PImportTranscript' is imported but never used.
   ,-[src/components/systems/config/sync/quick-sync.ts:2:3]
 1 | import {
 2 |   PImportTranscript,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'PImportTranscript' is imported here
 3 |   PluralKitAPISystem,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitAPISystem' is imported but never used.
   ,-[src/components/systems/config/sync/quick-sync.ts:3:3]
 2 |   PImportTranscript,
 3 |   PluralKitAPISystem,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'PluralKitAPISystem' is imported here
 4 |   PluralKitGroup,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitGroup' is imported but never used.
   ,-[src/components/systems/config/sync/quick-sync.ts:4:3]
 3 |   PluralKitAPISystem,
 4 |   PluralKitGroup,
   :   ^^^^^^^|^^^^^^
   :          `-- 'PluralKitGroup' is imported here
 5 |   PluralKitMember,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitMember' is imported but never used.
   ,-[src/components/systems/config/sync/quick-sync.ts:5:3]
 4 |   PluralKitGroup,
 5 |   PluralKitMember,
   :   ^^^^^^^|^^^^^^^
   :          `-- 'PluralKitMember' is imported here
 6 | } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'z' is imported but never used.
    ,-[src/components/systems/config/sync/quick-sync.ts:9:15]
  8 | import { MessageFlags } from "seyfert/lib/types";
  9 | import type { z } from "zod";
    :               |
    :               `-- 'z' is imported here
 10 | import { build, client, logger } from "@/index";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'build' is imported but never used.
    ,-[src/components/systems/config/sync/quick-sync.ts:10:10]
  9 | import type { z } from "zod";
 10 | import { build, client, logger } from "@/index";
    :          ^^|^^
    :            `-- 'build' is imported here
 11 | import { getSystemFeatures } from "@/lib/get-system-flags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'client' is imported but never used.
    ,-[src/components/systems/config/sync/quick-sync.ts:10:17]
  9 | import type { z } from "zod";
 10 | import { build, client, logger } from "@/index";
    :                 ^^^|^^
    :                    `-- 'client' is imported here
 11 | import { getSystemFeatures } from "@/lib/get-system-flags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LoadingView' is imported but never used.
    ,-[src/components/systems/config/sync/quick-sync.ts:18:10]
 17 | import { AlertView } from "@/views/alert";
 18 | import { LoadingView } from "@/views/loading";
    :          ^^^^^|^^^^^
    :               `-- 'LoadingView' is imported here
 19 | import { QuickSyncStatus, SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/lib/autocomplete-tags.ts:5:10]
 4 | import type { AutocompleteInteraction } from "seyfert";
 5 | import { alterCollection, tagCollection } from "../mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 6 | import { getUserById } from "../types/user";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/commands/auto-proxy/status.ts:2:10]
 1 | import { runStatusCommand } from "@/lib/ap-cmds/status";
 2 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 3 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/auto-proxy/status.ts:3:10]
 2 | import { alterCollection } from "@/mongodb";
 3 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 4 | import { AlterView } from "@/views/alters";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
   ,-[src/commands/auto-proxy/status.ts:4:10]
 3 | import { AlertView } from "@/views/alert";
 4 | import { AlterView } from "@/views/alters";
   :          ^^^^|^^^^
   :              `-- 'AlterView' is imported here
 5 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/auto-proxy/status.ts:7:3]
 6 |   type CommandContext,
 7 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 8 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Separator' is imported but never used.
    ,-[src/commands/auto-proxy/status.ts:12:3]
 11 |   Options,
 12 |   Separator,
    :   ^^^^|^^^^
    :       `-- 'Separator' is imported here
 13 |   SubCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/commands/auto-proxy/status.ts:14:3]
 13 |   SubCommand,
 14 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 15 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ColorResolvable' is imported but never used.
    ,-[src/commands/auto-proxy/status.ts:16:15]
 15 | } from "seyfert";
 16 | import type { ColorResolvable } from "seyfert/lib/common";
    :               ^^^^^^^|^^^^^^^
    :                      `-- 'ColorResolvable' is imported here
 17 | import { MessageFlags } from "seyfert/lib/types";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
    ,-[src/commands/auto-proxy/status.ts:17:10]
 16 | import type { ColorResolvable } from "seyfert/lib/common";
 17 | import { MessageFlags } from "seyfert/lib/types";
    :          ^^^^^^|^^^^^
    :                `-- 'MessageFlags' is imported here
 18 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'Webhook' is imported but never used.
   ,-[src/lib/proxying/process-url-attachments.ts:2:8]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ import {
 2 |   type Webhook,
   :        ^^^|^^^
   :           `-- 'Webhook' is imported here
 3 |   type UsingClient,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Section' is imported but never used.
    ,-[src/lib/proxying/process-url-attachments.ts:11:3]
 10 |   AttachmentBuilder,
 11 |   Section,
    :   ^^^|^^^
    :      `-- 'Section' is imported here
 12 |   Thumbnail,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Thumbnail' is imported but never used.
    ,-[src/lib/proxying/process-url-attachments.ts:12:3]
 11 |   Section,
 12 |   Thumbnail,
    :   ^^^^|^^^^
    :       `-- 'Thumbnail' is imported here
 13 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
     ,-[src/lib/proxying/process-url-attachments.ts:179:27]
 178 |   for (const emoji of uploadedEmojis) {
 179 |     emoji.delete().catch((_) => null);
     :                           |
     :                           `-- '_' is declared here
 180 |   }
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
   ,-[src/commands/server-config/prefixes/list-prefixes.ts:4:3]
 3 |   Container,
 4 |   createStringOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'createStringOption' is imported here
 5 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
   ,-[src/commands/server-config/prefixes/list-prefixes.ts:8:3]
 7 |   Middlewares,
 8 |   Options,
   :   ^^^|^^^
   :      `-- 'Options' is imported here
 9 |   SubCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Shortcut' is imported but never used.
    ,-[src/commands/server-config/prefixes/list-prefixes.ts:13:10]
 12 | import { MessageFlags } from "seyfert/lib/types";
 13 | import { Shortcut } from "yunaforseyfert";
    :          ^^^^|^^^
    :              `-- 'Shortcut' is imported here
 14 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PAlterObject' is imported but never used.
   ,-[src/mongodb.ts:5:3]
 4 | import {
 5 |   PAlterObject,
   :   ^^^^^^|^^^^^
   :         `-- 'PAlterObject' is imported here
 6 |   PSystemObject,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/mongodb.ts:6:3]
 5 |   PAlterObject,
 6 |   PSystemObject,
   :   ^^^^^^|^^^^^^
   :         `-- 'PSystemObject' is imported here
 7 |   PTagObject,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PTagObject' is imported but never used.
   ,-[src/mongodb.ts:7:3]
 6 |   PSystemObject,
 7 |   PTagObject,
   :   ^^^^^|^^^^
   :        `-- 'PTagObject' is imported here
 8 |   PUserObject,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PUserObject' is imported but never used.
   ,-[src/mongodb.ts:8:3]
 7 |   PTagObject,
 8 |   PUserObject,
   :   ^^^^^|^^^^^
   :        `-- 'PUserObject' is imported here
 9 |   type PAlterOperation,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalCommand' is imported but never used.
   ,-[src/components/systems/config/sync/apply-nd.ts:2:51]
 1 | import { ObjectId } from "bson";
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
   :                                                   ^^^^^^|^^^^^
   :                                                         `-- 'ModalCommand' is imported here
 3 | import { ComponentHandler } from "seyfert/lib/components/handler";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalContext' is imported but never used.
   ,-[src/components/systems/config/sync/apply-nd.ts:2:65]
 1 | import { ObjectId } from "bson";
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
   :                                                                 ^^^^^^|^^^^^
   :                                                                       `-- 'ModalContext' is imported here
 3 | import { ComponentHandler } from "seyfert/lib/components/handler";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentHandler' is imported but never used.
   ,-[src/components/systems/config/sync/apply-nd.ts:3:10]
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
 3 | import { ComponentHandler } from "seyfert/lib/components/handler";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ComponentHandler' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'client' is imported but never used.
   ,-[src/components/systems/config/sync/apply-nd.ts:5:10]
 4 | import { MessageFlags } from "seyfert/lib/types";
 5 | import { client } from "@/index";
   :          ^^^|^^
   :             `-- 'client' is imported here
 6 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterOperationCollection' is imported but never used.
    ,-[src/components/systems/config/sync/apply-nd.ts:10:3]
  9 |   alterCollection,
 10 |   alterOperationCollection,
    :   ^^^^^^^^^^^^|^^^^^^^^^^^
    :               `-- 'alterOperationCollection' is imported here
 11 |   importTranscriptCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PSystem' is imported but never used.
   ,-[src/lib/pk-api/systems.ts:1:35]
 1 | import { PluralKitAPISystem, type PSystem } from "plurography";
   :                                   ^^^|^^^
   :                                      `-- 'PSystem' is imported here
 2 | import type { z } from "zod";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'build' is imported but never used.
   ,-[src/lib/pk-api/systems.ts:3:10]
 2 | import type { z } from "zod";
 3 | import { build } from "@/index";
   :          ^^|^^
   :            `-- 'build' is imported here
 4 | import { API_PREFIX, PK_UA } from ".";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/commands/ydi.ts:2:3]
 1 | import {
 2 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/guilds/set-logging-channel-form.ts:2:3]
 1 | import {
 2 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 3 |   Middlewares,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/guilds/set-logging-channel-form.ts:7:8]
 6 |   type AllChannels,
 7 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 8 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/commands/express.ts:2:3]
 1 | import {
 2 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/express.ts:5:3]
 4 |   type CommandContext,
 5 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 6 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
   ,-[src/commands/express.ts:6:3]
 5 |   Container,
 6 |   createStringOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'createStringOption' is imported here
 7 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Section' is imported but never used.
    ,-[src/commands/express.ts:9:3]
  8 |   Options,
  9 |   Section,
    :   ^^^|^^^
    :      `-- 'Section' is imported here
 10 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/commands/express.ts:10:3]
  9 |   Section,
 10 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 11 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/commands/express.ts:12:10]
 11 | } from "seyfert";
 12 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 13 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'autocompleteAlters' is imported but never used.
    ,-[src/commands/express.ts:13:10]
 12 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 13 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'autocompleteAlters' is imported here
 14 | import { alterCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/commands/express.ts:14:10]
 13 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
 14 | import { alterCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 15 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalCommand' is imported but never used.
   ,-[src/components/systems/config/sync/apply-d.ts:2:51]
 1 | import { ObjectId } from "bson";
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
   :                                                   ^^^^^^|^^^^^
   :                                                         `-- 'ModalCommand' is imported here
 3 | import { ComponentHandler } from "seyfert/lib/components/handler";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalContext' is imported but never used.
   ,-[src/components/systems/config/sync/apply-d.ts:2:65]
 1 | import { ObjectId } from "bson";
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
   :                                                                 ^^^^^^|^^^^^
   :                                                                       `-- 'ModalContext' is imported here
 3 | import { ComponentHandler } from "seyfert/lib/components/handler";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentHandler' is imported but never used.
   ,-[src/components/systems/config/sync/apply-d.ts:3:10]
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
 3 | import { ComponentHandler } from "seyfert/lib/components/handler";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ComponentHandler' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'client' is imported but never used.
   ,-[src/components/systems/config/sync/apply-d.ts:5:10]
 4 | import { MessageFlags } from "seyfert/lib/types";
 5 | import { client } from "@/index";
   :          ^^^|^^
   :             `-- 'client' is imported here
 6 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterOperationCollection' is imported but never used.
    ,-[src/components/systems/config/sync/apply-d.ts:10:3]
  9 |   alterCollection,
 10 |   alterOperationCollection,
    :   ^^^^^^^^^^^^|^^^^^^^^^^^
    :               `-- 'alterOperationCollection' is imported here
 11 |   importTranscriptCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/lib/ap-cmds/custom.ts:8:3]
 7 |   type CommandContext,
 8 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 9 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
    ,-[src/lib/ap-cmds/custom.ts:10:3]
  9 |   createStringOption,
 10 |   Declare,
    :   ^^^|^^^
    :      `-- 'Declare' is imported here
 11 |   IgnoreCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/lib/ap-cmds/custom.ts:11:3]
 10 |   Declare,
 11 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 12 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
    ,-[src/lib/ap-cmds/custom.ts:12:3]
 11 |   IgnoreCommand,
 12 |   Options,
    :   ^^^|^^^
    :      `-- 'Options' is imported here
 13 |   SubCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
    ,-[src/lib/ap-cmds/custom.ts:13:3]
 12 |   Options,
 13 |   SubCommand,
    :   ^^^^^|^^^^
    :        `-- 'SubCommand' is imported here
 14 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unsafe-optional-chaining): Unsafe usage of optional chaining
    ,-[src/lib/proxying/tenor.ts:15:11]
 14 | 
 15 |   return (json?.["og:image"] as string).replace(
    :           ^^^^^^^^^^^^^^^^^^
 16 |     "https://media1.tenor.com/m/",
    `----
  help: If this short-circuits with 'undefined' the evaluation will throw TypeError

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-server-display-name-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'writeBack' is imported but never used.
    ,-[src/components/systems/alters/config/set-server-display-name-form.ts:10:10]
  9 | import { w } from "@/webhooks";
 10 | import { writeBack } from "@/lib/pk-sync-engine.ts";
    :          ^^^^|^^^^
    :              `-- 'writeBack' is imported here
 11 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/guilds/set-guild-prefixes-form.ts:2:3]
 1 | import {
 2 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 3 |   Middlewares,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/guilds/set-guild-prefixes-form.ts:6:8]
 5 |   type ModalContext,
 6 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 7 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'exporter' is imported but never used.
    ,-[src/api.ts:22:10]
 21 | import { LoadingView } from "./views/loading";
 22 | import { exporter, getExporterAsPlainText } from "./plugins/opentelemetry";
    :          ^^^^|^^^
    :              `-- 'exporter' is imported here
 23 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'req' is declared but never used. Unused parameters should start with a '_'.
    ,-[src/api.ts:53:31]
 52 | export const clientRoutes = app
 53 |   .get("/api/stats", async ({ req, json }) => {
    :                               ^|^
    :                                `-- 'req' is declared here
 54 |     return json(
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter 'err' is caught but never used.
     ,-[src/api.ts:209:14]
 208 |       return c.text(`${await register.metrics()}\n${additionalMetrics}`);
 209 |     } catch (err) {
     :              ^|^
     :               `-- 'err' is declared here
 210 |       c.status(500);
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
    ,-[src/lib/ap-cmds/off.ts:10:3]
  9 |   createStringOption,
 10 |   Declare,
    :   ^^^|^^^
    :      `-- 'Declare' is imported here
 11 |   IgnoreCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/lib/ap-cmds/off.ts:11:3]
 10 |   Declare,
 11 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 12 |   SubCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
    ,-[src/lib/ap-cmds/off.ts:12:3]
 11 |   IgnoreCommand,
 12 |   SubCommand,
    :   ^^^^^|^^^^
    :        `-- 'SubCommand' is imported here
 13 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ServerConfigView' is imported but never used.
   ,-[src/commands/server-config/log-channel.ts:3:10]
 2 | import { AlertView } from "@/views/alert";
 3 | import { ServerConfigView } from "@/views/server-cfg";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ServerConfigView' is imported here
 4 | import { GuildFlags } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'GuildFlags' is imported but never used.
   ,-[src/commands/server-config/log-channel.ts:4:10]
 3 | import { ServerConfigView } from "@/views/server-cfg";
 4 | import { GuildFlags } from "plurography";
   :          ^^^^^|^^^^
   :               `-- 'GuildFlags' is imported here
 5 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
   ,-[src/commands/server-config/log-channel.ts:8:3]
 7 |   createChannelOption,
 8 |   createStringOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'createStringOption' is imported here
 9 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'GuildFeature' is imported but never used.
    ,-[src/commands/server-config/log-channel.ts:14:23]
 13 | } from "seyfert";
 14 | import { ChannelType, GuildFeature, MessageFlags } from "seyfert/lib/types";
    :                       ^^^^^^|^^^^^
    :                             `-- 'GuildFeature' is imported here
 15 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'Webhook' is imported but never used.
    ,-[src/lib/proxying/types/alter-ap.ts:11:8]
 10 |   type TopLevelBuilders,
 11 |   type Webhook,
    :        ^^^|^^^
    :           `-- 'Webhook' is imported here
 12 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ApplicableWebhookWritePayload' is imported but never used.
    ,-[src/lib/proxying/types/alter-ap.ts:13:15]
 12 | } from "seyfert";
 13 | import type { ApplicableWebhookWritePayload, PWebhook } from "@/events/on-message-create";
    :               ^^^^^^^^^^^^^^|^^^^^^^^^^^^^^
    :                             `-- 'ApplicableWebhookWritePayload' is imported here
 14 | import { client } from "@/index";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'setLastLatchAlter' is imported but never used.
    ,-[src/lib/proxying/types/alter-ap.ts:25:33]
 24 | import { getReferencedMessageString } from "../referenced-message";
 25 | import { getDisplayNameWebhook, setLastLatchAlter } from "../util";
    :                                 ^^^^^^^^|^^^^^^^^
    :                                         `-- 'setLastLatchAlter' is imported here
 26 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/components/guilds/general-tab.ts:3:10]
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 3 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitAPISystem' is imported but never used.
   ,-[src/lib/pk-api/groups.ts:1:10]
 1 | import { PluralKitAPISystem, PluralKitGroup, PluralKitMember } from "plurography";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'PluralKitAPISystem' is imported here
 2 | import type { z } from "zod";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitMember' is imported but never used.
   ,-[src/lib/pk-api/groups.ts:1:46]
 1 | import { PluralKitAPISystem, PluralKitGroup, PluralKitMember } from "plurography";
   :                                              ^^^^^^^|^^^^^^^
   :                                                     `-- 'PluralKitMember' is imported here
 2 | import type { z } from "zod";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
   ,-[src/commands/server-config/manager-roles/list.ts:4:3]
 3 |   Container,
 4 |   createStringOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'createStringOption' is imported here
 5 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
   ,-[src/commands/server-config/manager-roles/list.ts:8:3]
 7 |   Middlewares,
 8 |   Options,
   :   ^^^|^^^
   :      `-- 'Options' is imported here
 9 |   SubCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Shortcut' is imported but never used.
    ,-[src/commands/server-config/manager-roles/list.ts:13:10]
 12 | import { MessageFlags } from "seyfert/lib/types";
 13 | import { Shortcut } from "yunaforseyfert";
    :          ^^^^|^^^
    :              `-- 'Shortcut' is imported here
 14 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs.ts:7:3]
 6 |   Modal,
 7 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 8 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs.ts:8:3]
 7 |   TextDisplay,
 8 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 9 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs.ts:10:24]
  9 | } from "seyfert";
 10 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                        ^^^^^^^|^^^^^^
    :                               `-- 'TextInputStyle' is imported here
 11 | import { InteractionIdentifier } from "@/lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'decryptToken' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs.ts:12:10]
 11 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 12 | import { decryptToken } from "@/lib/pk-token-encryption";
    :          ^^^^^^|^^^^^
    :                `-- 'decryptToken' is imported here
 13 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
    ,-[src/lib/ap-cmds/latch.ts:11:3]
 10 |   createStringOption,
 11 |   Declare,
    :   ^^^|^^^
    :      `-- 'Declare' is imported here
 12 |   SubCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
    ,-[src/lib/ap-cmds/latch.ts:12:3]
 11 |   Declare,
 12 |   SubCommand,
    :   ^^^^^|^^^^
    :        `-- 'SubCommand' is imported here
 13 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
    ,-[src/lib/ap-cmds/latch.ts:13:3]
 12 |   SubCommand,
 13 |   Options,
    :   ^^^|^^^
    :      `-- 'Options' is imported here
 14 |   User,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'User' is imported but never used.
    ,-[src/lib/ap-cmds/latch.ts:14:3]
 13 |   Options,
 14 |   User,
    :   ^^|^
    :     `-- 'User' is imported here
 15 |   IgnoreCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/lib/ap-cmds/latch.ts:15:3]
 14 |   User,
 15 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 16 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'User' is imported but never used.
   ,-[src/lib/proxying/types/tag-proxying.ts:4:55]
 3 | import type { PGuild } from "plurography";
 4 | import type { GuildMember, Message, TopLevelBuilders, User, Webhook } from "seyfert";
   :                                                       ^^|^
   :                                                         `-- 'User' is imported here
 5 | import { CacheFrom, Container, TextDisplay } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'Webhook' is imported but never used.
   ,-[src/lib/proxying/types/tag-proxying.ts:4:61]
 3 | import type { PGuild } from "plurography";
 4 | import type { GuildMember, Message, TopLevelBuilders, User, Webhook } from "seyfert";
   :                                                             ^^^|^^^
   :                                                                `-- 'Webhook' is imported here
 5 | import { CacheFrom, Container, TextDisplay } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createBooleanOption' is imported but never used.
   ,-[src/commands/tags/tag-description.ts:6:3]
 5 |   Container,
 6 |   createBooleanOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'createBooleanOption' is imported here
 7 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'autocompleteAlters' is imported but never used.
    ,-[src/commands/tags/tag-description.ts:14:10]
 13 | import { MessageFlags } from "seyfert/lib/types";
 14 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'autocompleteAlters' is imported here
 15 | import { autocompleteTags } from "@/lib/autocomplete-tags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/commands/tags/tag-description.ts:17:10]
 16 | import { writeBack } from "@/lib/pk-sync-engine";
 17 | import { alterCollection, tagCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 18 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createUserOption' is imported but never used.
   ,-[src/commands/server-config/manager-roles/add.ts:6:3]
 5 |   createRoleOption,
 6 |   createUserOption,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'createUserOption' is imported here
 7 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PImportTranscript' is imported but never used.
   ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:2:3]
 1 | import {
 2 |   PImportTranscript,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'PImportTranscript' is imported here
 3 |   PluralKitAPISystem,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitAPISystem' is imported but never used.
   ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:3:3]
 2 |   PImportTranscript,
 3 |   PluralKitAPISystem,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'PluralKitAPISystem' is imported here
 4 |   PluralKitGroup,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitGroup' is imported but never used.
   ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:4:3]
 3 |   PluralKitAPISystem,
 4 |   PluralKitGroup,
   :   ^^^^^^^|^^^^^^
   :          `-- 'PluralKitGroup' is imported here
 5 |   PluralKitMember,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitMember' is imported but never used.
   ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:5:3]
 4 |   PluralKitGroup,
 5 |   PluralKitMember,
   :   ^^^^^^^|^^^^^^^
   :          `-- 'PluralKitMember' is imported here
 6 | } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:8:3]
 7 | import {
 8 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 9 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:9:3]
  8 |   ActionRow,
  9 |   Button,
    :   ^^^|^^
    :      `-- 'Button' is imported here
 10 |   Container,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:10:3]
  9 |   Button,
 10 |   Container,
    :   ^^^^|^^^^
    :       `-- 'Container' is imported here
 11 |   ModalCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Separator' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:13:3]
 12 |   type ModalContext,
 13 |   Separator,
    :   ^^^^|^^^^
    :       `-- 'Separator' is imported here
 14 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:14:3]
 13 |   Separator,
 14 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 15 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:16:10]
 15 | } from "seyfert";
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 17 | import type { z } from "zod";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'z' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:17:15]
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 17 | import type { z } from "zod";
    :               |
    :               `-- 'z' is imported here
 18 | import { build } from "@/index";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'build' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:18:10]
 17 | import type { z } from "zod";
 18 | import { build } from "@/index";
    :          ^^|^^
    :            `-- 'build' is imported here
 19 | import { emojis } from "@/lib/emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emojis' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:19:10]
 18 | import { build } from "@/index";
 19 | import { emojis } from "@/lib/emojis";
    :          ^^^|^^
    :             `-- 'emojis' is imported here
 20 | import { getSystemFeatures } from "@/lib/get-system-flags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'hexToBuffer' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:21:10]
 20 | import { getSystemFeatures } from "@/lib/get-system-flags";
 21 | import { hexToBuffer } from "@/lib/hex-buffer-operation";
    :          ^^^^^|^^^^^
    :               `-- 'hexToBuffer' is imported here
 22 | import { InteractionIdentifier } from "@/lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'runSandboxActions' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:23:10]
 22 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 23 | import { runSandboxActions } from "@/lib/pk-sync-engine";
    :          ^^^^^^^^|^^^^^^^^
    :                  `-- 'runSandboxActions' is imported here
 24 | import {
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:25:3]
 24 | import {
 25 |   alterCollection,
    :   ^^^^^^^|^^^^^^^
    :          `-- 'alterCollection' is imported here
 26 |   importTranscriptCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'importTranscriptCollection' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:26:3]
 25 |   alterCollection,
 26 |   importTranscriptCollection,
    :   ^^^^^^^^^^^^^|^^^^^^^^^^^^
    :                `-- 'importTranscriptCollection' is imported here
 27 |   tagCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'tagCollection' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:27:3]
 26 |   importTranscriptCollection,
 27 |   tagCollection,
    :   ^^^^^^|^^^^^^
    :         `-- 'tagCollection' is imported here
 28 |   userCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LoadingView' is imported but never used.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:31:10]
 30 | import { AlertView } from "@/views/alert";
 31 | import { LoadingView } from "@/views/loading";
    :          ^^^^^|^^^^^
    :               `-- 'LoadingView' is imported here
 32 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'API_PREFIX' is declared but never used. Unused variables should start with a '_'.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:34:7]
 33 | 
 34 | const API_PREFIX = "https://api.pluralkit.me/v2";
    :       ^^^^^|^^^^
    :            `-- 'API_PREFIX' is declared here
 35 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
   ,-[src/lib/ap-cmds/clear-latch.ts:5:31]
 4 | import { AlertView } from "@/views/alert";
 5 | import { type CommandContext, Declare, IgnoreCommand, SubCommand } from "seyfert";
   :                               ^^^|^^^
   :                                  `-- 'Declare' is imported here
 6 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
   ,-[src/lib/ap-cmds/clear-latch.ts:5:40]
 4 | import { AlertView } from "@/views/alert";
 5 | import { type CommandContext, Declare, IgnoreCommand, SubCommand } from "seyfert";
   :                                        ^^^^^^|^^^^^^
   :                                              `-- 'IgnoreCommand' is imported here
 6 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
   ,-[src/lib/ap-cmds/clear-latch.ts:5:55]
 4 | import { AlertView } from "@/views/alert";
 5 | import { type CommandContext, Declare, IgnoreCommand, SubCommand } from "seyfert";
   :                                                       ^^^^^|^^^^
   :                                                            `-- 'SubCommand' is imported here
 6 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterPagination' is imported but never used.
   ,-[src/components/systems/tag-pagination/previous-page.ts:7:10]
 6 | import { AlertView } from "@/views/alert";
 7 | import { alterPagination, SystemSettingsView, tagsPagination } from "@/views/system-settings";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterPagination' is imported here
 8 | export default class PreviousPage extends ComponentCommand {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getGuildFromId' is imported but never used.
   ,-[src/commands/server-config/blocks/remove-blocked-role.ts:2:10]
 1 | import { guildCollection } from "@/mongodb";
 2 | import { getGuildFromId } from "@/types/guild";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'getGuildFromId' is imported here
 3 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
    ,-[src/commands/server-config/blocks/remove-blocked-role.ts:10:3]
  9 |   type CommandContext,
 10 |   createStringOption,
    :   ^^^^^^^^^|^^^^^^^^
    :            `-- 'createStringOption' is imported here
 11 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createChannelOption' is imported but never used.
    ,-[src/commands/server-config/blocks/remove-blocked-role.ts:12:3]
 11 |   Options,
 12 |   createChannelOption,
    :   ^^^^^^^^^|^^^^^^^^^
    :            `-- 'createChannelOption' is imported here
 13 |   createRoleOption,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
   ,-[src/commands/tag.ts:5:10]
 4 | import { AlertView } from "@/views/alert";
 5 | import { AlterView } from "@/views/alters";
   :          ^^^^|^^^^
   :              `-- 'AlterView' is imported here
 6 | import { TagView } from "@/views/tags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'applicationsCollection' is imported but never used.
    ,-[src/events/on-message-react.ts:12:3]
 11 |   alterCollection,
 12 |   applicationsCollection,
    :   ^^^^^^^^^^^|^^^^^^^^^^
    :              `-- 'applicationsCollection' is imported here
 13 |   messagesCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
    ,-[src/lib/ap-cmds/alter.ts:11:3]
 10 |   createStringOption,
 11 |   Declare,
    :   ^^^|^^^
    :      `-- 'Declare' is imported here
 12 |   SubCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
    ,-[src/lib/ap-cmds/alter.ts:12:3]
 11 |   Declare,
 12 |   SubCommand,
    :   ^^^^^|^^^^
    :        `-- 'SubCommand' is imported here
 13 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
    ,-[src/lib/ap-cmds/alter.ts:13:3]
 12 |   SubCommand,
 13 |   Options,
    :   ^^^|^^^
    :      `-- 'Options' is imported here
 14 |   User,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'User' is imported but never used.
    ,-[src/lib/ap-cmds/alter.ts:14:3]
 13 |   Options,
 14 |   User,
    :   ^^|^
    :     `-- 'User' is imported here
 15 |   IgnoreCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/lib/ap-cmds/alter.ts:15:3]
 14 |   User,
 15 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 16 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createUserOption' is imported but never used.
   ,-[src/commands/server-config/manager-roles/remove.ts:6:3]
 5 |   createRoleOption,
 6 |   createUserOption,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'createUserOption' is imported here
 7 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitAPISystem' is imported but never used.
   ,-[src/components/systems/config/sync/manual-sync-form.ts:3:3]
 2 |   PImportTranscript,
 3 |   PluralKitAPISystem,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'PluralKitAPISystem' is imported here
 4 |   PluralKitGroup,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitGroup' is imported but never used.
   ,-[src/components/systems/config/sync/manual-sync-form.ts:4:3]
 3 |   PluralKitAPISystem,
 4 |   PluralKitGroup,
   :   ^^^^^^^|^^^^^^
   :          `-- 'PluralKitGroup' is imported here
 5 |   PluralKitMember,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitMember' is imported but never used.
   ,-[src/components/systems/config/sync/manual-sync-form.ts:5:3]
 4 |   PluralKitGroup,
 5 |   PluralKitMember,
   :   ^^^^^^^|^^^^^^^
   :          `-- 'PluralKitMember' is imported here
 6 | } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/config/sync/manual-sync-form.ts:8:3]
 7 | import {
 8 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 9 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:9:3]
  8 |   ActionRow,
  9 |   Button,
    :   ^^^|^^
    :      `-- 'Button' is imported here
 10 |   Container,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:10:3]
  9 |   Button,
 10 |   Container,
    :   ^^^^|^^^^
    :       `-- 'Container' is imported here
 11 |   ModalCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Separator' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:13:3]
 12 |   type ModalContext,
 13 |   Separator,
    :   ^^^^|^^^^
    :       `-- 'Separator' is imported here
 14 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:14:3]
 13 |   Separator,
 14 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 15 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:16:10]
 15 | } from "seyfert";
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 17 | import type { ZodError, z } from "zod";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'z' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:17:25]
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 17 | import type { ZodError, z } from "zod";
    :                         |
    :                         `-- 'z' is imported here
 18 | import { build } from "@/index";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'build' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:18:10]
 17 | import type { ZodError, z } from "zod";
 18 | import { build } from "@/index";
    :          ^^|^^
    :            `-- 'build' is imported here
 19 | import { emojis } from "@/lib/emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emojis' is imported but never used.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:19:10]
 18 | import { build } from "@/index";
 19 | import { emojis } from "@/lib/emojis";
    :          ^^^|^^
    :             `-- 'emojis' is imported here
 20 | import { getSystemFeatures } from "@/lib/get-system-flags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'API_PREFIX' is declared but never used. Unused variables should start with a '_'.
    ,-[src/components/systems/config/sync/manual-sync-form.ts:35:7]
 34 | 
 35 | const API_PREFIX = "https://api.pluralkit.me/v2";
    :       ^^^^^|^^^^
    :            `-- 'API_PREFIX' is declared here
 36 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'createChannelOption' is imported but never used.
   ,-[src/commands/server-config/blocks/add-blocked-category.ts:5:3]
 4 |   type CommandContext,
 5 |   createChannelOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'createChannelOption' is imported here
 6 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ChannelType' is imported but never used.
    ,-[src/commands/server-config/blocks/add-blocked-category.ts:13:10]
 12 | } from "seyfert";
 13 | import { ChannelType, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ChannelType' is imported here
 14 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createBooleanOption' is imported but never used.
   ,-[src/commands/tags/rename-tag.ts:6:3]
 5 |   Container,
 6 |   createBooleanOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'createBooleanOption' is imported here
 7 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'autocompleteAlters' is imported but never used.
    ,-[src/commands/tags/rename-tag.ts:14:10]
 13 | import { MessageFlags } from "seyfert/lib/types";
 14 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'autocompleteAlters' is imported here
 15 | import { autocompleteTags } from "@/lib/autocomplete-tags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/commands/tags/rename-tag.ts:17:10]
 16 | import { writeBack } from "@/lib/pk-sync-engine";
 17 | import { alterCollection, tagCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 18 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'user' is declared but never used. Unused parameters should start with a '_'.
   ,-[src/events/ready.ts:8:15]
 7 |   data: { name: "ready", once: true },
 8 |   run: async (user, client) => {
   :               ^^|^
   :                 `-- 'user' is declared here
 9 |     await initializeApplicationCommands();
   `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter 'client' is declared but never used. Unused parameters should start with a '_'.
   ,-[src/events/ready.ts:8:21]
 7 |   data: { name: "ready", once: true },
 8 |   run: async (user, client) => {
   :                     ^^^|^^
   :                        `-- 'client' is declared here
 9 |     await initializeApplicationCommands();
   `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'InteractionIdentifier' is imported but never used.
   ,-[src/components/loading.ts:2:10]
 1 | import { ComponentCommand, type ComponentContext } from "seyfert";
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   :          ^^^^^^^^^^|^^^^^^^^^^
   :                    `-- 'InteractionIdentifier' is imported here
 3 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/components/loading.ts:3:10]
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 3 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 4 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
   ,-[src/components/loading.ts:4:10]
 3 | import { AlertView } from "@/views/alert";
 4 | import { MessageFlags } from "seyfert/lib/types";
   :          ^^^^^^|^^^^^
   :                `-- 'MessageFlags' is imported here
 5 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
   ,-[src/lib/ap-cmds/status.ts:8:3]
 7 |   createStringOption,
 8 |   Declare,
   :   ^^^|^^^
   :      `-- 'Declare' is imported here
 9 |   IgnoreCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/lib/ap-cmds/status.ts:9:3]
  8 |   Declare,
  9 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 10 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
    ,-[src/lib/ap-cmds/status.ts:10:3]
  9 |   IgnoreCommand,
 10 |   Options,
    :   ^^^|^^^
    :      `-- 'Options' is imported here
 11 |   Separator,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
    ,-[src/lib/ap-cmds/status.ts:12:3]
 11 |   Separator,
 12 |   SubCommand,
    :   ^^^^^|^^^^
    :        `-- 'SubCommand' is imported here
 13 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PImportTranscript' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:2:3]
 1 | import {
 2 |   PImportTranscript,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'PImportTranscript' is imported here
 3 |   PluralKitAPISystem,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitAPISystem' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:3:3]
 2 |   PImportTranscript,
 3 |   PluralKitAPISystem,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'PluralKitAPISystem' is imported here
 4 |   PluralKitGroup,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitGroup' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:4:3]
 3 |   PluralKitAPISystem,
 4 |   PluralKitGroup,
   :   ^^^^^^^|^^^^^^
   :          `-- 'PluralKitGroup' is imported here
 5 |   PluralKitMember,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralKitMember' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:5:3]
 4 |   PluralKitGroup,
 5 |   PluralKitMember,
   :   ^^^^^^^|^^^^^^^
   :          `-- 'PluralKitMember' is imported here
 6 | } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:8:3]
 7 | import {
 8 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 9 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:9:3]
  8 |   ActionRow,
  9 |   Button,
    :   ^^^|^^
    :      `-- 'Button' is imported here
 10 |   Container,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:10:3]
  9 |   Button,
 10 |   Container,
    :   ^^^^|^^^^
    :       `-- 'Container' is imported here
 11 |   ModalCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Separator' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:13:3]
 12 |   type ModalContext,
 13 |   Separator,
    :   ^^^^|^^^^
    :       `-- 'Separator' is imported here
 14 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:14:3]
 13 |   Separator,
 14 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 15 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:16:10]
 15 | } from "seyfert";
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 17 | import type { z } from "zod";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'z' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:17:15]
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 17 | import type { z } from "zod";
    :               |
    :               `-- 'z' is imported here
 18 | import { build } from "@/index";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'build' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:18:10]
 17 | import type { z } from "zod";
 18 | import { build } from "@/index";
    :          ^^|^^
    :            `-- 'build' is imported here
 19 | import { emojis } from "@/lib/emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emojis' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:19:10]
 18 | import { build } from "@/index";
 19 | import { emojis } from "@/lib/emojis";
    :          ^^^|^^
    :             `-- 'emojis' is imported here
 20 | import { getSystemFeatures } from "@/lib/get-system-flags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'hexToBuffer' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:21:10]
 20 | import { getSystemFeatures } from "@/lib/get-system-flags";
 21 | import { hexToBuffer } from "@/lib/hex-buffer-operation";
    :          ^^^^^|^^^^^
    :               `-- 'hexToBuffer' is imported here
 22 | import { InteractionIdentifier } from "@/lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'runSandboxActions' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:23:10]
 22 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 23 | import { runSandboxActions } from "@/lib/pk-sync-engine";
    :          ^^^^^^^^|^^^^^^^^
    :                  `-- 'runSandboxActions' is imported here
 24 | import {
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:25:3]
 24 | import {
 25 |   alterCollection,
    :   ^^^^^^^|^^^^^^^
    :          `-- 'alterCollection' is imported here
 26 |   importTranscriptCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'importTranscriptCollection' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:26:3]
 25 |   alterCollection,
 26 |   importTranscriptCollection,
    :   ^^^^^^^^^^^^^|^^^^^^^^^^^^
    :                `-- 'importTranscriptCollection' is imported here
 27 |   tagCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'tagCollection' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:27:3]
 26 |   importTranscriptCollection,
 27 |   tagCollection,
    :   ^^^^^^|^^^^^^
    :         `-- 'tagCollection' is imported here
 28 |   userCollection,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LoadingView' is imported but never used.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:31:10]
 30 | import { AlertView } from "@/views/alert";
 31 | import { LoadingView } from "@/views/loading";
    :          ^^^^^|^^^^^
    :               `-- 'LoadingView' is imported here
 32 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'API_PREFIX' is declared but never used. Unused variables should start with a '_'.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:34:7]
 33 | 
 34 | const API_PREFIX = "https://api.pluralkit.me/v2";
    :       ^^^^^|^^^^
    :            `-- 'API_PREFIX' is declared here
 35 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/systems/tags/config/set-color.ts:8:3]
 7 |   StringSelectMenu,
 8 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 9 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/systems/tags/config/set-color.ts:13:24]
 12 | import { AlertView } from "@/views/alert";
 13 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                        ^^^^^^^|^^^^^^
    :                               `-- 'TextInputStyle' is imported here
 14 | import { alterCollection, tagCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/tags/config/set-color.ts:14:10]
 13 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 14 | import { alterCollection, tagCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 15 | import { tagColorSelection } from "@/lib/selection-options";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
   ,-[src/commands/server-config/blocks/list.ts:4:3]
 3 |   Container,
 4 |   createStringOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'createStringOption' is imported here
 5 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
   ,-[src/commands/server-config/blocks/list.ts:8:3]
 7 |   Middlewares,
 8 |   Options,
   :   ^^^|^^^
   :      `-- 'Options' is imported here
 9 |   SubCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Shortcut' is imported but never used.
    ,-[src/commands/server-config/blocks/list.ts:13:10]
 12 | import { MessageFlags } from "seyfert/lib/types";
 13 | import { Shortcut } from "yunaforseyfert";
    :          ^^^^|^^^
    :              `-- 'Shortcut' is imported here
 14 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'w' is imported but never used.
    ,-[src/commands/tags/tag-color.ts:20:10]
 19 | import { AlertView } from "@/views/alert";
 20 | import { w } from "@/webhooks";
    :          |
    :          `-- 'w' is imported here
 21 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/delete-system.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   Attachment,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Attachment' is imported but never used.
   ,-[src/components/systems/delete-system.ts:5:3]
 4 |   ActionRow,
 5 |   Attachment,
   :   ^^^^^|^^^^
   :        `-- 'Attachment' is imported here
 6 |   AttachmentBuilder,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/components/systems/delete-system.ts:7:3]
 6 |   AttachmentBuilder,
 7 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 8 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'File' is imported but never used.
    ,-[src/components/systems/delete-system.ts:9:3]
  8 |   ComponentCommand,
  9 |   File,
    :   ^^|^
    :     `-- 'File' is imported here
 10 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/systems/delete-system.ts:12:10]
 11 | } from "seyfert";
 12 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 13 | import { buildExportPayload } from "@/lib/export";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralBuddyIntro' is imported but never used.
    ,-[src/components/systems/delete-system.ts:19:10]
 18 | import { LoadingView } from "@/views/loading";
 19 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'PluralBuddyIntro' is imported here
 20 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/components/systems/config/prefer-accessiblity.ts:1:10]
 1 | import { PSystemObject, SystemFlags } from "plurography";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 2 | import { ComponentCommand, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
    ,-[src/components/systems/alters/config/delete-proxy-tag.ts:57:21]
 56 |         ...alter,
 57 |         proxyTags: [...alter.proxyTags.filter((v) => v.id !== proxyTag)],
    :                     ^^^
 58 |       },
    `----
  help: `alter.proxyTags.filter` returns a new array. Spreading it into an array expression to create a new array is redundant.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
    ,-[src/components/systems/alters/config/delete-proxy-tag.ts:66:23]
 65 |         change: {
 66 |           proxyTags: [...alter.proxyTags.filter((v) => v.id !== proxyTag)],
    :                       ^^^
 67 |         },
    `----
  help: `alter.proxyTags.filter` returns a new array. Spreading it into an array expression to create a new array is redundant.

  ! eslint(no-unused-vars): Identifier 'getGuildFromId' is imported but never used.
   ,-[src/commands/server-config/blocks/remove-blocked-category.ts:2:10]
 1 | import { guildCollection } from "@/mongodb";
 2 | import { getGuildFromId } from "@/types/guild";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'getGuildFromId' is imported here
 3 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createChannelOption' is imported but never used.
    ,-[src/commands/server-config/blocks/remove-blocked-category.ts:12:3]
 11 |   Options,
 12 |   createChannelOption,
    :   ^^^^^^^^^|^^^^^^^^^
    :            `-- 'createChannelOption' is imported here
 13 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Message' is imported but never used.
   ,-[src/events/on-message-delete.ts:2:23]
 1 | import { messagesCollection } from "@/mongodb";
 2 | import { createEvent, Message } from "seyfert";
   :                       ^^^|^^^
   :                          `-- 'Message' is imported here
 3 | import { client } from "..";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/events/on-message-delete.ts:43:16]
 42 |         });
 43 |       } catch (_) {}
    :                |
    :                `-- '_' is declared here
 44 |     }
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/alter-plain-pagination/custom-page.ts:2:3]
 1 | import {
 2 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 3 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/components/systems/alter-plain-pagination/custom-page.ts:3:3]
 2 |   ActionRow,
 3 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 4 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/alter-plain-pagination/custom-page.ts:8:3]
 7 |   Modal,
 8 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 9 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/systems/alter-plain-pagination/custom-page.ts:11:10]
 10 | } from "seyfert";
 11 | import { ButtonStyle, MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 12 | import { InteractionIdentifier } from "@/lib/interaction-ids";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/alter-plain-pagination/custom-page.ts:13:10]
 12 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 13 | import { alterCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 14 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'cachedCommands' is imported but never used.
   ,-[src/lib/mention-command.ts:8:8]
 7 | } from "seyfert/lib/types";
 8 | import cachedCommands from "@/../commands.json";
   :        ^^^^^^^|^^^^^^
   :               `-- 'cachedCommands' is imported here
 9 | import { client } from "..";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/continue.ts:8:3]
 7 |   type ComponentContext,
 8 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 9 |   Label,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Label' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:9:3]
  8 |   Container,
  9 |   Label,
    :   ^^|^^
    :     `-- 'Label' is imported here
 10 |   Modal,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Modal' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:10:3]
  9 |   Label,
 10 |   Modal,
    :   ^^|^^
    :     `-- 'Modal' is imported here
 11 |   ModalSubmitInteraction,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalSubmitInteraction' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:11:3]
 10 |   Modal,
 11 |   ModalSubmitInteraction,
    :   ^^^^^^^^^^^|^^^^^^^^^^
    :              `-- 'ModalSubmitInteraction' is imported here
 12 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:12:3]
 11 |   ModalSubmitInteraction,
 12 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 13 |   TextInput,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:13:3]
 12 |   TextDisplay,
 13 |   TextInput,
    :   ^^^^|^^^^
    :       `-- 'TextInput' is imported here
 14 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:15:37]
 14 | } from "seyfert";
 15 | import { ButtonStyle, MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                                     ^^^^^^^|^^^^^^
    :                                            `-- 'TextInputStyle' is imported here
 16 | import { emojis } from "@/lib/emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralBuddyIntro' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/continue.ts:22:10]
 21 | import { LoadingView } from "@/views/loading";
 22 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'PluralBuddyIntro' is imported here
 23 | import { createdSystems } from "../create-new-system";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/tags/config/set-description-form.ts:4:24]
 3 | import { ModalCommand, type ModalContext } from "seyfert";
 4 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-description-form.ts:7:10]
 6 | import { writeBack } from "@/lib/pk-sync-engine.ts";
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 8 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/tags/config/set-description-form.ts:9:10]
  8 | import { AlertView } from "@/views/alert";
  9 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 10 | import { TagView } from "@/views/tags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-privacy-modal.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'tagCollection' is imported but never used.
   ,-[src/components/systems/alters/config/set-privacy-modal.ts:7:27]
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   :                           ^^^^^^|^^^^^^
   :                                 `-- 'tagCollection' is imported here
 8 | import { AlterView } from "@/views/alters";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TagView' is imported but never used.
    ,-[src/components/systems/alters/config/set-privacy-modal.ts:9:10]
  8 | import { AlterView } from "@/views/alters";
  9 | import { TagView } from "@/views/tags";
    :          ^^^|^^^
    :             `-- 'TagView' is imported here
 10 | import { TagProtectionFlags } from "@/types/tag";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TagProtectionFlags' is imported but never used.
    ,-[src/components/systems/alters/config/set-privacy-modal.ts:10:10]
  9 | import { TagView } from "@/views/tags";
 10 | import { TagProtectionFlags } from "@/types/tag";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'TagProtectionFlags' is imported here
 11 | import { combine } from "@/lib/privacy-bitmask";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getAlterFeatures' is imported but never used.
    ,-[src/components/systems/alters/config/set-privacy-modal.ts:15:10]
 14 | import { writeBack } from "@/lib/pk-sync-engine.ts";
 15 | import { getAlterFeatures } from "@/lib/get-alter-flags.ts";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'getAlterFeatures' is imported here
 16 | import { AlterFlags } from "plurography";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterFlags' is imported but never used.
    ,-[src/components/systems/alters/config/set-privacy-modal.ts:16:10]
 15 | import { getAlterFeatures } from "@/lib/get-alter-flags.ts";
 16 | import { AlterFlags } from "plurography";
    :          ^^^^^|^^^^
    :               `-- 'AlterFlags' is imported here
 17 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emoji' is imported but never used.
    ,-[src/commands/tags/delete-tag.ts:11:10]
 10 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 11 | import { emoji } from "zod";
    :          ^^|^^
    :            `-- 'emoji' is imported here
 12 | import { autocompleteTags } from "@/lib/autocomplete-tags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/server-config/blocks/add-blocked-role.ts:5:3]
 4 |   type CommandContext,
 5 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 6 |   createChannelOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createChannelOption' is imported but never used.
   ,-[src/commands/server-config/blocks/add-blocked-role.ts:6:3]
 5 |   Container,
 6 |   createChannelOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'createChannelOption' is imported here
 7 |   createRoleOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'DiscordSnowflake' is imported but never used.
   ,-[src/lib/importing/pluralbuddy.ts:1:10]
 1 | import { DiscordSnowflake } from "@sapphire/snowflake";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'DiscordSnowflake' is imported here
 2 | import { ImportNotation, type PAlter, PAlterObject, type PTag } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/config/set-system-tag-form.ts:4:24]
 3 | import { ModalCommand, type ModalContext } from "seyfert";
 4 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 5 | import { getSystemFeatures } from "@/lib/get-system-flags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-system-tag-form.ts:8:10]
 7 | import { createSystemOperation } from "@/lib/system-operation";
 8 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 9 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/config/set-system-tag-form.ts:10:10]
  9 | import { AlertView } from "@/views/alert";
 10 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 11 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createError' is imported but never used.
    ,-[src/events/on-message-create.ts:32:10]
 31 | import { blockedChannel, blockedRole } from "@/lib/blocked";
 32 | import { createError } from "@/lib/create-error";
    :          ^^^^^|^^^^^
    :               `-- 'createError' is imported here
 33 | import { emojis } from "@/lib/emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'errorCollection' is imported but never used.
    ,-[src/events/on-message-create.ts:53:27]
 52 | import { build, client } from "..";
 53 | import { alterCollection, errorCollection, frontsCollection } from "../mongodb";
    :                           ^^^^^^^|^^^^^^^
    :                                  `-- 'errorCollection' is imported here
 54 | import { getUserById } from "../types/user";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
     ,-[src/events/on-message-create.ts:103:33]
 102 |       if (guild.getFeatures().disabledHelp) {
 103 |         message.delete().catch((_) => null);
     :                                 |
     :                                 `-- '_' is declared here
 104 | 
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/events/on-message-create.ts:110:18]
 109 |           });
 110 |         } catch (_) {}
     :                  |
     :                  `-- '_' is declared here
 111 |         return;
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/events/on-message-create.ts:317:20]
 316 |             indexingMessageMap[message.author.id] = indexingMessage;
 317 |           } catch (_) {}
     :                    |
     :                    `-- '_' is declared here
 318 |       }, 2000);
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
     ,-[src/events/on-message-create.ts:326:71]
 325 |         clearTimeout(indexingTimeout);
 326 |         if (indexingMessage !== null) indexingMessage.delete().catch((_) => null);
     :                                                                       |
     :                                                                       `-- '_' is declared here
 327 |       };
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Variable 'HOUR' is declared but never used. Unused variables should start with a '_'.
     ,-[src/events/on-message-create.ts:485:13]
 484 | 
 485 |       const HOUR = 3_600_000;
     :             ^^|^
     :               `-- 'HOUR' is declared here
 486 | 
     `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-color-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/commands/who-knows.ts:2:3]
 1 | import {
 2 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/server-config/blocks/add-blocked-channel.ts:5:3]
 4 |   type CommandContext,
 5 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 6 |   createChannelOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/systems/alter-plain-pagination/page-untrusted.ts:4:3]
 3 |   Button,
 4 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 5 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/systems/alter-plain-pagination/page-untrusted.ts:5:8]
 4 |   ComponentCommand,
 5 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 6 |   ModalCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/name.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalSubmitInteraction' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/name.ts:8:3]
 7 |   Modal,
 8 |   ModalSubmitInteraction,
   :   ^^^^^^^^^^^|^^^^^^^^^^
   :              `-- 'ModalSubmitInteraction' is imported here
 9 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralBuddyIntro' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/name.ts:14:10]
 13 | import { TextInputStyle } from "seyfert/lib/types";
 14 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'PluralBuddyIntro' is imported here
 15 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-display-name.ts:7:10]
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 8 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/alters/config/set-description-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-pronouns.ts:7:10]
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 7 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 8 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getGuildFromId' is imported but never used.
   ,-[src/commands/server-config/blocks/remove-blocked-channel.ts:2:10]
 1 | import { guildCollection } from "@/mongodb";
 2 | import { getGuildFromId } from "@/types/guild";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'getGuildFromId' is imported here
 3 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
    ,-[src/commands/server-config/blocks/remove-blocked-channel.ts:10:3]
  9 |   type CommandContext,
 10 |   createStringOption,
    :   ^^^^^^^^^|^^^^^^^^
    :            `-- 'createStringOption' is imported here
 11 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LocalesT' is imported but never used.
   ,-[src/commands/about.ts:8:3]
 7 |   Declare,
 8 |   LocalesT,
   :   ^^^^|^^^
   :       `-- 'LocalesT' is imported here
 9 |   type Message,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/commands/about.ts:30:50]
 29 |       if (ctx.isChat() && ctx.message) {
 30 |         (ctx.message as Message).delete().catch((_) => null);
    :                                                  |
    :                                                  `-- '_' is declared here
 31 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/commands/about.ts:39:18]
 38 |           });
 39 |         } catch (_) {}
    :                  |
    :                  `-- '_' is declared here
 40 |         return;
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/terminology.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Label' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/terminology.ts:7:3]
 6 |   type ComponentContext,
 7 |   Label,
   :   ^^|^^
   :     `-- 'Label' is imported here
 8 |   Modal,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Modal' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/terminology.ts:8:3]
 7 |   Label,
 8 |   Modal,
   :   ^^|^^
   :     `-- 'Modal' is imported here
 9 |   ModalSubmitInteraction,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalSubmitInteraction' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/terminology.ts:9:3]
  8 |   Modal,
  9 |   ModalSubmitInteraction,
    :   ^^^^^^^^^^^|^^^^^^^^^^
    :              `-- 'ModalSubmitInteraction' is imported here
 10 |   TextInput,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/terminology.ts:10:3]
  9 |   ModalSubmitInteraction,
 10 |   TextInput,
    :   ^^^^|^^^^
    :       `-- 'TextInput' is imported here
 11 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/terminology.ts:12:24]
 11 | } from "seyfert";
 12 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                        ^^^^^^^|^^^^^^
    :                               `-- 'TextInputStyle' is imported here
 13 | import { terminologyTemplates } from "@/lib/terminology-templates";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralBuddyIntro' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/terminology.ts:15:10]
 14 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 15 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'PluralBuddyIntro' is imported here
 16 | import { createdSystems } from "../create-new-system";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'OTLPTraceExporter' is imported but never used.
   ,-[src/index.ts:8:10]
 7 | import { SeqTransport } from "@datalust/winston-seq";
 8 | import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
   :          ^^^^^^^^|^^^^^^^^
   :                  `-- 'OTLPTraceExporter' is imported here
 9 | import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'BatchLogRecordProcessor' is imported but never used.
    ,-[src/index.ts:9:10]
  8 | import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
  9 | import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
    :          ^^^^^^^^^^^|^^^^^^^^^^^
    :                     `-- 'BatchLogRecordProcessor' is imported here
 10 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ConsoleMetricExporter' is imported but never used.
    ,-[src/index.ts:10:10]
  9 | import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
 10 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
    :          ^^^^^^^^^^|^^^^^^^^^^
    :                    `-- 'ConsoleMetricExporter' is imported here
 11 | import { NodeSDK } from "@opentelemetry/sdk-node";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PeriodicExportingMetricReader' is imported but never used.
    ,-[src/index.ts:10:33]
  9 | import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
 10 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
    :                                 ^^^^^^^^^^^^^^|^^^^^^^^^^^^^^
    :                                               `-- 'PeriodicExportingMetricReader' is imported here
 11 | import { NodeSDK } from "@opentelemetry/sdk-node";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'NodeSDK' is imported but never used.
    ,-[src/index.ts:11:10]
 10 | import { ConsoleMetricExporter, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
 11 | import { NodeSDK } from "@opentelemetry/sdk-node";
    :          ^^^|^^^
    :             `-- 'NodeSDK' is imported here
 12 | import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'BatchSpanProcessor' is imported but never used.
    ,-[src/index.ts:12:10]
 11 | import { NodeSDK } from "@opentelemetry/sdk-node";
 12 | import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'BatchSpanProcessor' is imported here
 13 | import * as Sentry from "@sentry/bun";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Sentry' is imported but never used.
    ,-[src/index.ts:13:13]
 12 | import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
 13 | import * as Sentry from "@sentry/bun";
    :             ^^^|^^
    :                `-- 'Sentry' is imported here
 14 | import { RedisAdapter } from "@slipher/redis-adapter";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LimitedCollection' is imported but never used.
    ,-[src/index.ts:22:3]
 21 |   definePlugins,
 22 |   LimitedCollection,
    :   ^^^^^^^^|^^^^^^^^
    :           `-- 'LimitedCollection' is imported here
 23 |   MemoryAdapter,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SeyfertError' is imported but never used.
    ,-[src/index.ts:25:10]
 24 | } from "seyfert";
 25 | import { SeyfertError } from "seyfert/lib/common";
    :          ^^^^^^|^^^^^
    :                `-- 'SeyfertError' is imported here
 26 | import { ActivityType, ButtonStyle, MessageFlags, PresenceUpdateStatus } from "seyfert/lib/types";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/alters/config/keep-proxy-tags.ts:2:10]
 1 | import { AlterFlags } from "plurography";
 2 | import { ActionRow, Button, ComponentCommand, type ComponentContext } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'ActionRow' is imported here
 3 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/components/systems/alters/config/keep-proxy-tags.ts:2:21]
 1 | import { AlterFlags } from "plurography";
 2 | import { ActionRow, Button, ComponentCommand, type ComponentContext } from "seyfert";
   :                     ^^^|^^
   :                        `-- 'Button' is imported here
 3 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
   ,-[src/components/systems/alters/config/keep-proxy-tags.ts:3:10]
 2 | import { ActionRow, Button, ComponentCommand, type ComponentContext } from "seyfert";
 3 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   :          ^^^^^|^^^^^
   :               `-- 'ButtonStyle' is imported here
 4 | import { emojis } from "@/lib/emojis";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emojis' is imported but never used.
   ,-[src/components/systems/alters/config/keep-proxy-tags.ts:4:10]
 3 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 4 | import { emojis } from "@/lib/emojis";
   :          ^^^|^^
   :             `-- 'emojis' is imported here
 5 | import { getAlterFeatures } from "@/lib/get-alter-flags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
    ,-[src/components/systems/alters/config/keep-proxy-tags.ts:10:10]
  9 | import { AlterView } from "@/views/alters";
 10 | import { SystemSettingsView } from "@/views/system-settings";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'SystemSettingsView' is imported here
 11 | import { w } from "@/webhooks";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/edit-context/edit-context-form.ts:2:10]
 1 | import { PGuildObject } from "plurography";
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, type ModalContext } from "seyfert";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ComponentCommand' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/edit-context/edit-context-form.ts:2:33]
 1 | import { PGuildObject } from "plurography";
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, type ModalContext } from "seyfert";
   :                                 ^^^^^^^^|^^^^^^^
   :                                         `-- 'ComponentContext' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-description.ts:6:10]
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 6 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 7 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-pfp.ts:4:10]
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 4 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 5 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ImportStageObject' is imported but never used.
   ,-[src/components/systems/import-mode.ts:1:28]
 1 | import { type ImportStage, ImportStageObject } from "plurography";
   :                            ^^^^^^^^|^^^^^^^^
   :                                    `-- 'ImportStageObject' is imported here
 2 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
    ,-[src/components/pluralbuddy-intro/remove-old.ts:15:10]
 14 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 15 | import { AlertView } from "@/views/alert";
    :          ^^^^|^^^^
    :              `-- 'AlertView' is imported here
 16 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/components/systems/config/case-insensitive-proxies.ts:1:10]
 1 | import { PSystemObject, SystemFlags } from "plurography";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 2 | import { ComponentCommand, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/tag.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createStringOption' is imported but never used.
    ,-[src/commands/delete.ts:9:3]
  8 |   type CommandContext,
  9 |   createStringOption,
    :   ^^^^^^^^^|^^^^^^^^
    :            `-- 'createStringOption' is imported here
 10 |   Declare,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LocalesT' is imported but never used.
    ,-[src/commands/delete.ts:11:3]
 10 |   Declare,
 11 |   LocalesT,
    :   ^^^^|^^^
    :       `-- 'LocalesT' is imported here
 12 |   Message,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
    ,-[src/commands/delete.ts:13:3]
 12 |   Message,
 13 |   Options,
    :   ^^^|^^^
    :      `-- 'Options' is imported here
 14 |   Webhook,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Webhook' is imported but never used.
    ,-[src/commands/delete.ts:14:3]
 13 |   Options,
 14 |   Webhook,
    :   ^^^|^^^
    :      `-- 'Webhook' is imported here
 15 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'client' is imported but never used.
    ,-[src/commands/delete.ts:17:10]
 16 | import { MessageFlags } from "seyfert/lib/types";
 17 | import { client } from "..";
    :          ^^^|^^
    :             `-- 'client' is imported here
 18 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ContextMenuCommand' is imported but never used.
   ,-[src/components/edit-context/edit-reaction.ts:6:3]
 5 |   type ComponentContext,
 6 |   ContextMenuCommand,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'ContextMenuCommand' is imported here
 7 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Declare' is imported but never used.
   ,-[src/components/edit-context/edit-reaction.ts:7:3]
 6 |   ContextMenuCommand,
 7 |   Declare,
   :   ^^^|^^^
   :      `-- 'Declare' is imported here
 8 |   Label,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MenuCommandContext' is imported but never used.
    ,-[src/components/edit-context/edit-reaction.ts:9:3]
  8 |   Label,
  9 |   MenuCommandContext,
    :   ^^^^^^^^^|^^^^^^^^
    :            `-- 'MenuCommandContext' is imported here
 10 |   MessageCommandInteraction,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageCommandInteraction' is imported but never used.
    ,-[src/components/edit-context/edit-reaction.ts:10:3]
  9 |   MenuCommandContext,
 10 |   MessageCommandInteraction,
    :   ^^^^^^^^^^^^|^^^^^^^^^^^^
    :               `-- 'MessageCommandInteraction' is imported here
 11 |   Modal,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ApplicationCommandType' is imported but never used.
    ,-[src/components/edit-context/edit-reaction.ts:17:3]
 16 |   type APITextDisplayComponent,
 17 |   ApplicationCommandType,
    :   ^^^^^^^^^^^|^^^^^^^^^^
    :              `-- 'ApplicationCommandType' is imported here
 18 |   ComponentType,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/components/systems/config/toggle-typing-status.ts:1:10]
 1 | import { PSystemObject, SystemFlags } from "plurography";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 2 | import { ComponentCommand, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/tags/config/set-privacy-form.ts:6:24]
 5 | import { AlertView } from "@/views/alert";
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-privacy-form.ts:7:10]
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 7 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 8 | import { AlterView } from "@/views/alters";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
   ,-[src/components/systems/tags/config/set-privacy-form.ts:8:10]
 7 | import { alterCollection, tagCollection } from "@/mongodb";
 8 | import { AlterView } from "@/views/alters";
   :          ^^^^|^^^^
   :              `-- 'AlterView' is imported here
 9 | import { TagView } from "@/views/tags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pluralbuddy.ts:8:3]
 7 |   Modal,
 8 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 9 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'buildPkExportPayload' is imported but never used.
   ,-[src/components/systems/config/external-export.ts:5:30]
 4 | import type z from "zod";
 5 | import { buildExportPayload, buildPkExportPayload } from "@/lib/export";
   :                              ^^^^^^^^^^|^^^^^^^^^
   :                                        `-- 'buildPkExportPayload' is imported here
 6 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'DiscordSnowflake' is imported but never used.
   ,-[src/error-command.ts:3:10]
 2 | 
 3 | import { DiscordSnowflake } from "@sapphire/snowflake";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'DiscordSnowflake' is imported here
 4 | import * as Sentry from "@sentry/bun";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentCommand' is imported but never used.
   ,-[src/error-command.ts:8:3]
 7 |   CommandContext,
 8 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 9 |   ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'posthogClient' is imported but never used.
    ,-[src/error-command.ts:19:10]
 18 | import { MessageFlags } from "seyfert/lib/types";
 19 | import { posthogClient } from ".";
    :          ^^^^^^|^^^^^^
    :                `-- 'posthogClient' is imported here
 20 | import {
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/privacy.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalSubmitInteraction' is imported but never used.
   ,-[src/components/pluralbuddy-intro/system/privacy.ts:8:3]
 7 |   Modal,
 8 |   ModalSubmitInteraction,
   :   ^^^^^^^^^^^|^^^^^^^^^^
   :              `-- 'ModalSubmitInteraction' is imported here
 9 |   StringSelectMenu,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'StringSelectOption' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/privacy.ts:10:3]
  9 |   StringSelectMenu,
 10 |   StringSelectOption,
    :   ^^^^^^^^^|^^^^^^^^
    :            `-- 'StringSelectOption' is imported here
 11 |   TextInput,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/privacy.ts:11:3]
 10 |   StringSelectOption,
 11 |   TextInput,
    :   ^^^^|^^^^
    :       `-- 'TextInput' is imported here
 12 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/privacy.ts:15:10]
 14 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 15 | import { TextInputStyle } from "seyfert/lib/types";
    :          ^^^^^^^|^^^^^^
    :                 `-- 'TextInputStyle' is imported here
 16 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralBuddyIntro' is imported but never used.
    ,-[src/components/pluralbuddy-intro/system/privacy.ts:16:10]
 15 | import { TextInputStyle } from "seyfert/lib/types";
 16 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'PluralBuddyIntro' is imported here
 17 | import { privacySelection } from "@/lib/selection-options";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/commands/crash-out.ts:2:3]
 1 | import {
 2 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
    ,-[src/components/nudges/remove-user.ts:9:10]
  8 | import { Modal } from "seyfert";
  9 | import { TextInput } from "seyfert";
    :          ^^^^|^^^^
    :              `-- 'TextInput' is imported here
 10 | import { TextInputStyle } from "seyfert/lib/types";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/nudges/remove-user.ts:10:10]
  9 | import { TextInput } from "seyfert";
 10 | import { TextInputStyle } from "seyfert/lib/types";
    :          ^^^^^^^|^^^^^^
    :                 `-- 'TextInputStyle' is imported here
 11 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-banner.ts:4:10]
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 4 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 5 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TagView' is imported but never used.
    ,-[src/components/systems/tags/config/set-color-component.ts:13:10]
 12 | import { AlertView } from "@/views/alert";
 13 | import { TagView } from "@/views/tags";
    :          ^^^|^^^
    :             `-- 'TagView' is imported here
 14 | import { tagColorSelection } from "@/lib/selection-options";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Checkbox' is imported but never used.
   ,-[src/components/systems/alters/config/set-pfp.ts:3:3]
 2 | import {
 3 |   Checkbox,
   :   ^^^^|^^^
   :       `-- 'Checkbox' is imported here
 4 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/components/systems/config/include-proxy-tags.ts:1:10]
 1 | import { PSystemObject, SystemFlags } from "plurography";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 2 | import { ComponentCommand, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'v' is declared but never used. Unused parameters should start with a '_'.
    ,-[src/webhooks.ts:13:17]
 12 |         })
 13 |         .catch((v) => null);
    :                 |
    :                 `-- 'v' is declared here
 14 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/webhooks.ts:21:14]
 20 |       });
 21 |     } catch (_) {}
    :              |
    :              `-- '_' is declared here
 22 |   })();
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
   ,-[src/commands/systems/system-name.ts:3:10]
 2 | import { AlertView } from "@/views/alert";
 3 | import { SystemSettingsView } from "@/views/system-settings";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'SystemSettingsView' is imported here
 4 | import { type CommandContext, createStringOption, Declare, Options, SubCommand } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/tags/config/set-order-string-form.ts:4:24]
 3 | import { ModalCommand, type ModalContext } from "seyfert";
 4 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-order-string-form.ts:6:10]
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 6 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 7 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
   ,-[src/components/systems/tags/config/set-order-string-form.ts:8:10]
 7 | import { AlertView } from "@/views/alert";
 8 | import { AlterView } from "@/views/alters";
   :          ^^^^|^^^^
   :              `-- 'AlterView' is imported here
 9 | import { TagView } from "@/views/tags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'writeBack' is imported but never used.
    ,-[src/components/systems/tags/config/set-order-string-form.ts:11:10]
 10 | import { w } from "@/webhooks";
 11 | import { writeBack } from "@/lib/pk-sync-engine.ts";
    :          ^^^^|^^^^
    :              `-- 'writeBack' is imported here
 12 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getEmojiFromTagColor' is imported but never used.
   ,-[src/components/systems/tags/create-new-tag-form.ts:7:10]
 6 | import z from "zod";
 7 | import { getEmojiFromTagColor } from "@/lib/emojis";
   :          ^^^^^^^^^^|^^^^^^^^^
   :                    `-- 'getEmojiFromTagColor' is imported here
 8 | import { getSystemFeatures } from "@/lib/get-system-flags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/tags/create-new-tag-form.ts:12:10]
 11 | import { getMaxTagPublicValue } from "@/lib/privacy-bitmask";
 12 | import { alterCollection, tagCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 13 | import { PAlterObject } from "@/types/alter";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PAlterObject' is imported but never used.
    ,-[src/components/systems/tags/create-new-tag-form.ts:13:10]
 12 | import { alterCollection, tagCollection } from "@/mongodb";
 13 | import { PAlterObject } from "@/types/alter";
    :          ^^^^^^|^^^^^
    :                `-- 'PAlterObject' is imported here
 14 | import { PTagObject } from "@/types/tag";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'server' is declared but never used. Unused variables should start with a '_'.
    ,-[src/components/systems/tags/create-new-tag-form.ts:40:11]
 39 |     const user = await ctx.retrievePUser();
 40 |     const server = await ctx.retrievePGuild();
    :           ^^^|^^
    :              `-- 'server' is declared here
 41 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'FileUpload' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pk/raw-text.ts:4:3]
 3 |   ComponentCommand,
 4 |   FileUpload,
   :   ^^^^^|^^^^
   :        `-- 'FileUpload' is imported here
 5 |   Label,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'analyticsCollection' is imported but never used.
   ,-[src/analytics.ts:6:3]
 5 |   alterCollection,
 6 |   analyticsCollection,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'analyticsCollection' is imported here
 7 |   guildCollection,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PAnalytics' is imported but never used.
    ,-[src/analytics.ts:12:15]
 11 | } from "./mongodb";
 12 | import type { PAnalytics } from "./types/analytics";
    :               ^^^^^|^^^^
    :                    `-- 'PAnalytics' is imported here
 13 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'countedAlters' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:16:7]
 15 | 
 16 | const countedAlters = new Gauge({
    :       ^^^^^^|^^^^^^
    :             `-- 'countedAlters' is declared here
 17 |   name: "pluralbuddy_counted_alters",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'countedServers' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:24:7]
 23 | });
 24 | const countedServers = new Gauge({
    :       ^^^^^^^|^^^^^^
    :              `-- 'countedServers' is declared here
 25 |   name: "pluralbuddy_counted_guilds",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'countedMessages' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:31:7]
 30 | });
 31 | const countedMessages = new Gauge({
    :       ^^^^^^^|^^^^^^^
    :              `-- 'countedMessages' is declared here
 32 |   name: "pluralbuddy_counted_messages",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'configuredGuildCount' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:39:7]
 38 | });
 39 | const configuredGuildCount = new Gauge({
    :       ^^^^^^^^^^|^^^^^^^^^
    :                 `-- 'configuredGuildCount' is declared here
 40 |   name: "pluralbuddy_counted_mongo_configured_guilds",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'systemCount' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:47:7]
 46 | });
 47 | const systemCount = new Gauge({
    :       ^^^^^|^^^^^
    :            `-- 'systemCount' is declared here
 48 |   name: "pluralbuddy_counted_systems",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'totalShards' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:55:7]
 54 | });
 55 | const totalShards = new Gauge({
    :       ^^^^^|^^^^^
    :            `-- 'totalShards' is declared here
 56 |   name: "pluralbuddy_counted_total_shards",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Variable 'totalTags' is declared but never used. Unused variables should start with a '_'.
    ,-[src/analytics.ts:62:7]
 61 | });
 62 | const totalTags = new Gauge({
    :       ^^^^|^^^^
    :           `-- 'totalTags' is declared here
 63 |   name: "pluralbuddy_counted_total_tags",
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'CheckboxGroup' is imported but never used.
   ,-[src/components/pluralbuddy-intro/create-new-system.ts:5:3]
 4 | import {
 5 |   CheckboxGroup,
   :   ^^^^^^|^^^^^^
   :         `-- 'CheckboxGroup' is imported here
 6 |   CheckboxGroupOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'CheckboxGroupOption' is imported but never used.
   ,-[src/components/pluralbuddy-intro/create-new-system.ts:6:3]
 5 |   CheckboxGroup,
 6 |   CheckboxGroupOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'CheckboxGroupOption' is imported here
 7 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Label' is imported but never used.
    ,-[src/components/pluralbuddy-intro/create-new-system.ts:9:3]
  8 |   type ComponentContext,
  9 |   Label,
    :   ^^|^^
    :     `-- 'Label' is imported here
 10 |   Modal,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Modal' is imported but never used.
    ,-[src/components/pluralbuddy-intro/create-new-system.ts:10:3]
  9 |   Label,
 10 |   Modal,
    :   ^^|^^
    :     `-- 'Modal' is imported here
 11 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/pluralbuddy-intro/create-new-system.ts:11:3]
 10 |   Modal,
 11 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 12 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/nudges/add-user.ts:4:10]
 3 | import { Modal } from "seyfert";
 4 | import { TextInput } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'TextInput' is imported here
 5 | import { TextInputStyle } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/nudges/add-user.ts:5:10]
 4 | import { TextInput } from "seyfert";
 5 | import { TextInputStyle } from "seyfert/lib/types";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'TextInputStyle' is imported here
 6 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/tags/configure-tag.ts:11:10]
 10 | import { MessageFlags } from "seyfert/lib/types";
 11 | import { alterCollection, tagCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 12 | import { AlterView } from "@/views/alters";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/tags/configure-tag.ts:12:10]
 11 | import { alterCollection, tagCollection } from "@/mongodb";
 12 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 13 | import { TagView } from "@/views/tags";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
    ,-[src/components/systems/tags/configure-tag.ts:16:10]
 15 | import { AlertView } from "@/views/alert";
 16 | import { SystemSettingsView } from "@/views/system-settings";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'SystemSettingsView' is imported here
 17 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PSystem' is imported but never used.
    ,-[src/components/systems/config/set-privacy-form.ts:9:15]
  8 | import { createSystemOperation } from "@/lib/system-operation";
  9 | import { type PSystem, SystemProtectionFlags } from "@/types/system";
    :               ^^^|^^^
    :                  `-- 'PSystem' is imported here
 10 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Label' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pk/pluralkit.ts:3:28]
 2 | 
 3 | import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
   :                            ^^|^^
   :                              `-- 'Label' is imported here
 4 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Modal' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pk/pluralkit.ts:3:35]
 2 | 
 3 | import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
   :                                   ^^|^^
   :                                     `-- 'Modal' is imported here
 4 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pk/pluralkit.ts:3:42]
 2 | 
 3 | import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
   :                                          ^^^^|^^^^
   :                                              `-- 'TextInput' is imported here
 4 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/tags/config/set-order-string.ts:6:10]
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 6 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 7 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'InteractionIdentifier' is imported but never used.
   ,-[src/components/disabled.ts:2:10]
 1 | import { ComponentCommand, type ComponentContext } from "seyfert";
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   :          ^^^^^^^^^^|^^^^^^^^^^
   :                    `-- 'InteractionIdentifier' is imported here
 3 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/pluralbuddy-intro/next-page.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/components/pluralbuddy-intro/next-page.ts:5:3]
 4 |   ActionRow,
 5 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 6 |   CheckboxGroup,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'CheckboxGroup' is imported but never used.
   ,-[src/components/pluralbuddy-intro/next-page.ts:6:3]
 5 |   Button,
 6 |   CheckboxGroup,
   :   ^^^^^^|^^^^^^
   :         `-- 'CheckboxGroup' is imported here
 7 |   CheckboxGroupOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'CheckboxGroupOption' is imported but never used.
   ,-[src/components/pluralbuddy-intro/next-page.ts:7:3]
 6 |   CheckboxGroup,
 7 |   CheckboxGroupOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'CheckboxGroupOption' is imported here
 8 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
    ,-[src/components/pluralbuddy-intro/next-page.ts:9:3]
  8 |   ComponentCommand,
  9 |   Container,
    :   ^^^^|^^^^
    :       `-- 'Container' is imported here
 10 |   Label,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Label' is imported but never used.
    ,-[src/components/pluralbuddy-intro/next-page.ts:10:3]
  9 |   Container,
 10 |   Label,
    :   ^^|^^
    :     `-- 'Label' is imported here
 11 |   Modal,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Modal' is imported but never used.
    ,-[src/components/pluralbuddy-intro/next-page.ts:11:3]
 10 |   Label,
 11 |   Modal,
    :   ^^|^^
    :     `-- 'Modal' is imported here
 12 |   Separator,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Separator' is imported but never used.
    ,-[src/components/pluralbuddy-intro/next-page.ts:12:3]
 11 |   Modal,
 12 |   Separator,
    :   ^^^^|^^^^
    :       `-- 'Separator' is imported here
 13 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/pluralbuddy-intro/next-page.ts:13:3]
 12 |   Separator,
 13 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 14 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/pluralbuddy-intro/next-page.ts:16:10]
 15 | } from "seyfert";
 16 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 17 | import { policyModal } from "@/policyModal";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalCommand' is imported but never used.
   ,-[src/components/nudges/add-snooze-user.ts:2:51]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
   :                                                   ^^^^^^|^^^^^
   :                                                         `-- 'ModalCommand' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalContext' is imported but never used.
   ,-[src/components/nudges/add-snooze-user.ts:2:65]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, type ComponentContext, ModalCommand, ModalContext } from "seyfert";
   :                                                                 ^^^^^^|^^^^^
   :                                                                       `-- 'ModalContext' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'defaultUserStructure' is imported but never used.
   ,-[src/components/nudges/add-snooze-user.ts:6:10]
 5 | import { userCollection } from "@/mongodb";
 6 | import { defaultUserStructure, writeUserById } from "@/types/user";
   :          ^^^^^^^^^^|^^^^^^^^^
   :                    `-- 'defaultUserStructure' is imported here
 7 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'NudgePreferences' is imported but never used.
   ,-[src/components/nudges/add-snooze-user.ts:8:10]
 7 | import { AlertView } from "@/views/alert";
 8 | import { NudgePreferences } from "@/views/nudge-preferences";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'NudgePreferences' is imported here
 9 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/systems/tags/config/set-privacy.ts:8:3]
 7 |   StringSelectMenu,
 8 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 9 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/systems/tags/config/set-privacy.ts:13:24]
 12 | import { AlertView } from "@/views/alert";
 13 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
    :                        ^^^^^^^|^^^^^^
    :                               `-- 'TextInputStyle' is imported here
 14 | import { alterCollection, tagCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/tags/config/set-privacy.ts:14:10]
 13 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 14 | import { alterCollection, tagCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 15 | import { tagColorSelection, tagPrivacySelection } from "@/lib/selection-options";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'tagColorSelection' is imported but never used.
    ,-[src/components/systems/tags/config/set-privacy.ts:15:10]
 14 | import { alterCollection, tagCollection } from "@/mongodb";
 15 | import { tagColorSelection, tagPrivacySelection } from "@/lib/selection-options";
    :          ^^^^^^^^|^^^^^^^^
    :                  `-- 'tagColorSelection' is imported here
 16 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/commands/systems/import.ts:1:10]
 1 | import { ActionRow, Button, type CommandContext, Declare, SubCommand } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'ActionRow' is imported here
 2 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/commands/systems/import.ts:1:21]
 1 | import { ActionRow, Button, type CommandContext, Declare, SubCommand } from "seyfert";
   :                     ^^^|^^
   :                        `-- 'Button' is imported here
 2 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
   ,-[src/commands/systems/import.ts:2:10]
 1 | import { ActionRow, Button, type CommandContext, Declare, SubCommand } from "seyfert";
 2 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   :          ^^^^^|^^^^^
   :               `-- 'ButtonStyle' is imported here
 3 | import { emojis } from "@/lib/emojis";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emojis' is imported but never used.
   ,-[src/commands/systems/import.ts:3:10]
 2 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 3 | import { emojis } from "@/lib/emojis";
   :          ^^^|^^
   :             `-- 'emojis' is imported here
 4 | import { getSystemFeatures } from "@/lib/get-system-flags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'InteractionIdentifier' is imported but never used.
   ,-[src/commands/systems/import.ts:5:10]
 4 | import { getSystemFeatures } from "@/lib/get-system-flags";
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   :          ^^^^^^^^^^|^^^^^^^^^^
   :                    `-- 'InteractionIdentifier' is imported here
 6 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/systems/import.ts:6:10]
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 6 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 7 | import { LoadingView } from "@/views/loading";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LoadingView' is imported but never used.
   ,-[src/commands/systems/import.ts:7:10]
 6 | import { AlertView } from "@/views/alert";
 7 | import { LoadingView } from "@/views/loading";
   :          ^^^^^|^^^^^
   :               `-- 'LoadingView' is imported here
 8 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/components/systems/config/include-pronouns.ts:1:10]
 1 | import { PSystemObject, SystemFlags } from "plurography";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 2 | import { ComponentCommand, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/config/set-description-form.ts:4:24]
 3 | import { ModalCommand, type ModalContext } from "seyfert";
 4 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 5 | import { getSystemFeatures } from "@/lib/get-system-flags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-description-form.ts:8:10]
 7 | import { createSystemOperation } from "@/lib/system-operation";
 8 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 9 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/config/set-description-form.ts:10:10]
  9 | import { AlertView } from "@/views/alert";
 10 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 11 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'tagCollection' is imported but never used.
   ,-[src/components/systems/other-alter-pagination/search-form.ts:8:27]
 7 | import { has } from "@/lib/privacy-bitmask";
 8 | import { alterCollection, tagCollection, userCollection } from "@/mongodb";
   :                           ^^^^^^|^^^^^^
   :                                 `-- 'tagCollection' is imported here
 9 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertAssignTagView' is imported but never used.
    ,-[src/components/systems/other-alter-pagination/search-form.ts:10:10]
  9 | import { AlertView } from "@/views/alert";
 10 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'AlertAssignTagView' is imported here
 11 | import { otherAlterPagination, SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assignTagPagination' is imported but never used.
    ,-[src/components/systems/other-alter-pagination/search-form.ts:10:30]
  9 | import { AlertView } from "@/views/alert";
 10 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
    :                              ^^^^^^^^^|^^^^^^^^^
    :                                       `-- 'assignTagPagination' is imported here
 11 | import { otherAlterPagination, SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'fileTypeFromBuffer' is imported but never used.
   ,-[src/components/systems/config/set-pfp-form.ts:3:10]
 2 | 
 3 | import { fileTypeFromBuffer } from "file-type";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'fileTypeFromBuffer' is imported here
 4 | import { type Attachment, ModalCommand, type ModalContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/components/systems/config/set-pfp-form.ts:10:10]
  9 | import { createSystemOperation } from "@/lib/system-operation";
 10 | import { alterCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 11 | import { getOldObject, uploadAttachment } from "@/object-storage";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/config/set-pfp-form.ts:14:10]
 13 | import { AlertView } from "@/views/alert";
 14 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 15 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assetStringGeneration' is imported but never used.
   ,-[src/components/policy-form.ts:3:10]
 2 | import { userCollection } from "@/mongodb";
 3 | import { assetStringGeneration, PUserObject, terminologyDefaults } from "plurography";
   :          ^^^^^^^^^^|^^^^^^^^^^
   :                    `-- 'assetStringGeneration' is imported here
 4 | import { ModalCommand, type ModalContext, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:8:3]
 7 |   CacheFrom,
 8 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 9 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
    ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:9:8]
  8 |   ComponentCommand,
  9 |   type ComponentContext,
    :        ^^^^^^^^|^^^^^^^
    :                `-- 'ComponentContext' is imported here
 10 |   Container,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
    ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:10:3]
  9 |   type ComponentContext,
 10 |   Container,
    :   ^^^^|^^^^
    :       `-- 'Container' is imported here
 11 |   ModalCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:13:3]
 12 |   type ModalContext,
 13 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 14 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter 'error' is caught but never used.
    ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:82:14]
 81 |       JSON.parse(fileData);
 82 |     } catch (error) {
    :              ^^|^^
    :                `-- 'error' is declared here
 83 |       return await ctx.editOrReply({
    `----
  help: Consider handling this error.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
     ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:197:13]
 196 |           public: combine(
 197 |             ...[
     :             ^^^
 198 |               ...(member.privacy.visibility === "public" ? [AlterProtectionFlags.VISIBILITY] : []),
     `----
  help: Pass arguments directly instead of spreading an array.

  ! unicorn(no-useless-spread): Using a spread operator here creates a new array unnecessarily.
     ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:241:11]
 240 |         public: combine(
 241 |           ...[
     :           ^^^
 242 |             ...(group.privacy.description_privacy === "public"
     `----
  help: Pass arguments directly instead of spreading an array.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/components/nudges/toggle-server-replies.ts:5:10]
 4 | import { writeUserById } from "@/types/user";
 5 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 6 | import { NudgePreferences } from "@/views/nudge-preferences";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'object' is imported but never used.
    ,-[src/commands/systems/system-picture.ts:16:10]
 15 | import { MessageFlags } from "seyfert/lib/types";
 16 | import { object } from "zod";
    :          ^^^|^^
    :             `-- 'object' is imported here
 17 | import { FileTooBigException } from "@/lib/file-too-big";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'autocompleteAlters' is imported but never used.
    ,-[src/commands/systems/system-picture.ts:20:10]
 19 | import { deleteOldObject, getOldObject, uploadAttachment } from "@/object-storage";
 20 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'autocompleteAlters' is imported here
 21 | import { alterCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/commands/systems/system-picture.ts:21:10]
 20 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
 21 | import { alterCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 22 | import { assetStringGeneration, operationStringGeneration } from "@/types/operation";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'operationStringGeneration' is imported but never used.
    ,-[src/commands/systems/system-picture.ts:22:33]
 21 | import { alterCollection } from "@/mongodb";
 22 | import { assetStringGeneration, operationStringGeneration } from "@/types/operation";
    :                                 ^^^^^^^^^^^^|^^^^^^^^^^^^
    :                                             `-- 'operationStringGeneration' is imported here
 23 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/configure-tag.ts:4:10]
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 4 | import { alterCollection, tagCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 5 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
   ,-[src/components/systems/config/configure-tag.ts:6:10]
 5 | import { MessageFlags } from "seyfert/lib/types";
 6 | import { AlterView } from "@/views/alters";
   :          ^^^^|^^^^
   :              `-- 'AlterView' is imported here
 7 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'User' is imported but never used.
   ,-[src/components/systems/config/configure-alter.ts:2:28]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, User, type ComponentContext } from "seyfert";
   :                            ^^|^
   :                              `-- 'User' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/sp/simplyplural-modal.ts:3:62]
 2 | import { PAlterObject, type PSystem, PSystemObject, PTagObject } from "plurography";
 3 | import { ActionRow, Button, ModalCommand, type ModalContext, TextDisplay } from "seyfert";
   :                                                              ^^^^^|^^^^^
   :                                                                   `-- 'TextDisplay' is imported here
 4 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'sys' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/sp/simplyplural-modal.ts:5:10]
 4 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 5 | import { sys } from "typescript";
   :          ^|^
   :           `-- 'sys' is imported here
 6 | import z from "zod";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'e' is declared but never used. Unused parameters should start with a '_'.
    ,-[src/components/pluralbuddy-intro/import/sp/simplyplural-modal.ts:33:52]
 32 | 
 33 |     const system = await getSPSystem(token).catch((e) => null);
    :                                                    |
    :                                                    `-- 'e' is declared here
 34 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/components/systems/delete-system-media.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   Attachment,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Attachment' is imported but never used.
   ,-[src/components/systems/delete-system-media.ts:5:3]
 4 |   ActionRow,
 5 |   Attachment,
   :   ^^^^^|^^^^
   :        `-- 'Attachment' is imported here
 6 |   AttachmentBuilder,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/components/systems/delete-system-media.ts:7:3]
 6 |   AttachmentBuilder,
 7 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 8 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'File' is imported but never used.
    ,-[src/components/systems/delete-system-media.ts:10:3]
  9 |   type ComponentContext,
 10 |   File,
    :   ^^|^
    :     `-- 'File' is imported here
 11 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/components/systems/delete-system-media.ts:12:10]
 11 | } from "seyfert";
 12 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 13 | import { deleteAssetPrefix } from "@/object-storage";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assetStringGeneration' is imported but never used.
    ,-[src/components/systems/delete-system-media.ts:14:10]
 13 | import { deleteAssetPrefix } from "@/object-storage";
 14 | import { assetStringGeneration } from "@/types/operation";
    :          ^^^^^^^^^^|^^^^^^^^^^
    :                    `-- 'assetStringGeneration' is imported here
 15 | import { buildExportPayload } from "@/lib/export";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'writeUserById' is imported but never used.
    ,-[src/components/systems/delete-system-media.ts:18:10]
 17 | import { alterCollection, tagCollection, userCollection } from "@/mongodb";
 18 | import { writeUserById } from "@/types/user";
    :          ^^^^^^|^^^^^^
    :                `-- 'writeUserById' is imported here
 19 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PluralBuddyIntro' is imported but never used.
    ,-[src/components/systems/delete-system-media.ts:21:10]
 20 | import { LoadingView } from "@/views/loading";
 21 | import { PluralBuddyIntro } from "@/views/pluralbuddy-intro";
    :          ^^^^^^^^|^^^^^^^
    :                  `-- 'PluralBuddyIntro' is imported here
 22 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/lib/blocked.ts:44:22]
 43 |               });
 44 |             } catch (_) {}
    :                      |
    :                      `-- '_' is declared here
 45 |           return false;
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/lib/blocked.ts:58:18]
 57 |           });
 58 |         } catch (_) {}
    :                  |
    :                  `-- '_' is declared here
 59 | 
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/lib/blocked.ts:79:16]
 78 |         });
 79 |       } catch (_) {}
    :                |
    :                `-- '_' is declared here
 80 |     return false;
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/lib/blocked.ts:92:20]
 91 |             });
 92 |           } catch (_) {}
    :                    |
    :                    `-- '_' is declared here
 93 |         return false;
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/lib/blocked.ts:106:22]
 105 |               });
 106 |             } catch (_) {}
     :                      |
     :                      `-- '_' is declared here
 107 |           return false;
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
    ,-[src/components/systems/alters/configure-alter.ts:12:10]
 11 | import { MessageFlags } from "seyfert/lib/types";
 12 | import { SystemSettingsView } from "@/views/system-settings";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'SystemSettingsView' is imported here
 13 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Message' is imported but never used.
   ,-[src/commands/systems/system.ts:2:59]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { Declare, Command, AutoLoad, type CommandContext, Message, Groups } from "seyfert";
   :                                                           ^^^|^^^
   :                                                              `-- 'Message' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PSystem' is imported but never used.
   ,-[src/components/systems/config/set-name-form.ts:8:15]
 7 | import { createSystemOperation } from "@/lib/system-operation";
 8 | import type { PSystem } from "@/types/system";
   :               ^^^|^^^
   :                  `-- 'PSystem' is imported here
 9 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
   ,-[src/components/systems/config/set-pronouns-form.ts:4:24]
 3 | import { ModalCommand, type ModalContext } from "seyfert";
 4 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
   :                        ^^^^^^^|^^^^^^
   :                               `-- 'TextInputStyle' is imported here
 5 | import { getSystemFeatures } from "@/lib/get-system-flags";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-pronouns-form.ts:8:10]
 7 | import { createSystemOperation } from "@/lib/system-operation";
 8 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 9 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/config/set-pronouns-form.ts:10:10]
  9 | import { AlertView } from "@/views/alert";
 10 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 11 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertAssignTagView' is imported but never used.
    ,-[src/components/systems/other-alter-pagination/search.ts:11:10]
 10 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 11 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'AlertAssignTagView' is imported here
 12 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assignTagPagination' is imported but never used.
    ,-[src/components/systems/other-alter-pagination/search.ts:11:30]
 10 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 11 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
    :                              ^^^^^^^^^|^^^^^^^^^
    :                                       `-- 'assignTagPagination' is imported here
 12 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterPagination' is imported but never used.
    ,-[src/components/systems/other-alter-pagination/search.ts:14:10]
 13 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 14 | import { alterPagination, otherAlterPagination } from "@/views/system-settings";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterPagination' is imported here
 15 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ModalCommand' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/sp/simplyplural-token.ts:7:3]
 6 |   Modal,
 7 |   ModalCommand,
   :   ^^^^^^|^^^^^
   :         `-- 'ModalCommand' is imported here
 8 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ContextComponentCommandInteractionMap' is imported but never used.
    ,-[src/components/pluralbuddy-intro/import/sp/simplyplural-token.ts:9:8]
  8 |   TextInput,
  9 |   type ContextComponentCommandInteractionMap,
    :        ^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^
    :                          `-- 'ContextComponentCommandInteractionMap' is imported here
 10 |   type ModalContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ModalContext' is imported but never used.
    ,-[src/components/pluralbuddy-intro/import/sp/simplyplural-token.ts:10:8]
  9 |   type ContextComponentCommandInteractionMap,
 10 |   type ModalContext,
    :        ^^^^^^|^^^^^
    :              `-- 'ModalContext' is imported here
 11 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'sendAutoproxyOperationDM' is imported but never used.
   ,-[src/components/systems/auto-proxy/off-dms.ts:6:10]
 5 | import { AlertView } from "@/views/alert";
 6 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
   :          ^^^^^^^^^^^^|^^^^^^^^^^^
   :                      `-- 'sendAutoproxyOperationDM' is imported here
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/components/systems/auto-proxy/off-dms.ts:75:51]
 74 | 
 75 |     await ctx.interaction.message.delete().catch((_) => null);
    :                                                   |
    :                                                   `-- '_' is declared here
 76 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'messagesCollection' is imported but never used.
    ,-[src/commands/context/edit-message.ts:21:10]
 20 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 21 | import { messagesCollection } from "@/mongodb";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'messagesCollection' is imported here
 22 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Message' is imported but never used.
    ,-[src/commands/systems/delete-system.command.ts:13:3]
 12 |   TextDisplay,
 13 |   Message,
    :   ^^^|^^^
    :      `-- 'Message' is imported here
 14 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/config/terminology/edit-capital-terms.ts:7:3]
 6 |   Modal,
 7 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 8 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-banner-form.ts:8:10]
 7 | import { createSystemOperation } from "@/lib/system-operation";
 8 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 9 | import { getOldObject, uploadAttachment } from "@/object-storage";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterView' is imported but never used.
    ,-[src/components/systems/config/set-banner-form.ts:12:10]
 11 | import { AlertView } from "@/views/alert";
 12 | import { AlterView } from "@/views/alters";
    :          ^^^^|^^^^
    :              `-- 'AlterView' is imported here
 13 | import { SystemSettingsView } from "@/views/system-settings";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'applicationsCollection' is imported but never used.
    ,-[src/commands/context/delete-message.ts:11:10]
 10 | import { getSimilarWebhooks } from "@/lib/proxying/util";
 11 | import { applicationsCollection, messagesCollection } from "@/mongodb";
    :          ^^^^^^^^^^^|^^^^^^^^^^
    :                     `-- 'applicationsCollection' is imported here
 12 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
   ,-[src/commands/proxy/disable.ts:1:40]
 1 | import { type CommandContext, Declare, Options, SubCommand } from "seyfert";
   :                                        ^^^|^^^
   :                                           `-- 'Options' is imported here
 2 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
   ,-[src/components/nudges/toggle-nudging.ts:4:10]
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 4 | import { userCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'userCollection' is imported here
 5 | import { writeUserById } from "@/types/user";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/components/nudges/toggle-nudging.ts:6:10]
 5 | import { writeUserById } from "@/types/user";
 6 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 7 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterProtectionFlags' is imported but never used.
   ,-[src/commands/systems/create-alter.command.ts:4:10]
 3 | import { DiscordSnowflake } from "@sapphire/snowflake";
 4 | import { AlterProtectionFlags, assetStringGeneration, type PTag } from "plurography";
   :          ^^^^^^^^^^|^^^^^^^^^
   :                    `-- 'AlterProtectionFlags' is imported here
 5 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/commands/systems/create-alter.command.ts:11:3]
 10 |   Declare,
 11 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 12 |   type OKFunction,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'OnOptionsReturnObject' is imported but never used.
    ,-[src/commands/systems/create-alter.command.ts:13:8]
 12 |   type OKFunction,
 13 |   type OnOptionsReturnObject,
    :        ^^^^^^^^^^|^^^^^^^^^^
    :                  `-- 'OnOptionsReturnObject' is imported here
 14 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getWiderAutoProxy' is imported but never used.
    ,-[src/commands/systems/create-alter.command.ts:22:32]
 21 | import z from "zod";
 22 | import { getSpecificAutoProxy, getWiderAutoProxy } from "@/lib/autoproxy-util";
    :                                ^^^^^^^^|^^^^^^^^
    :                                        `-- 'getWiderAutoProxy' is imported here
 23 | import { emojis } from "@/lib/emojis";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'markdown' is imported but never used.
   ,-[eslint.config.ts:2:8]
 1 | import js from "@eslint/js";
 2 | import markdown from "@eslint/markdown";
   :        ^^^^|^^^
   :            `-- 'markdown' is imported here
 3 | import pluginReact from "eslint-plugin-react";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'pluginReact' is imported but never used.
   ,-[eslint.config.ts:3:8]
 2 | import markdown from "@eslint/markdown";
 3 | import pluginReact from "eslint-plugin-react";
   :        ^^^^^|^^^^^
   :             `-- 'pluginReact' is imported here
 4 | import { defineConfig, globalIgnores } from "eslint/config";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertAssignTagView' is imported but never used.
   ,-[src/components/systems/tag-pagination/search.ts:3:10]
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 3 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'AlertAssignTagView' is imported here
 4 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assignTagPagination' is imported but never used.
   ,-[src/components/systems/tag-pagination/search.ts:3:30]
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 3 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
   :                              ^^^^^^^^^|^^^^^^^^^
   :                                       `-- 'assignTagPagination' is imported here
 4 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Options' is imported but never used.
   ,-[src/commands/proxy/enable.ts:1:40]
 1 | import { type CommandContext, Declare, Options, SubCommand } from "seyfert";
   :                                        ^^^|^^^
   :                                           `-- 'Options' is imported here
 2 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/nudges/remove-user-form.ts:2:10]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext } from "seyfert";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ComponentCommand' is imported here
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/nudges/remove-user-form.ts:2:66]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext } from "seyfert";
   :                                                                  ^^^^^^^^|^^^^^^^
   :                                                                          `-- 'ComponentContext' is imported here
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'defaultUserStructure' is imported but never used.
   ,-[src/components/nudges/remove-user-form.ts:4:10]
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 4 | import { defaultUserStructure, writeUserById } from "@/types/user";
   :          ^^^^^^^^^^|^^^^^^^^^
   :                    `-- 'defaultUserStructure' is imported here
 5 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
   ,-[src/components/systems/config/left-side-tags.ts:1:10]
 1 | import { PSystemObject, SystemFlags } from "plurography";
   :          ^^^^^^|^^^^^^
   :                `-- 'PSystemObject' is imported here
 2 | import { ComponentCommand, type ComponentContext } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pluralbuddy-modal.ts:7:3]
 6 |   Button,
 7 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 8 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/pluralbuddy-intro/import/pluralbuddy-modal.ts:8:8]
 7 |   ComponentCommand,
 8 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 9 |   ModalCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'PSystemObject' is imported but never used.
    ,-[src/components/pluralbuddy-intro/import/pluralbuddy-modal.ts:18:10]
 17 | import { alterCollection, tagCollection } from "@/mongodb";
 18 | import { PSystemObject } from "@/types/system";
    :          ^^^^^^|^^^^^^
    :                `-- 'PSystemObject' is imported here
 19 | import { getUserById, writeUserById } from "@/types/user";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ReturnCache' is imported but never used.
   ,-[src/cache/similar-webhooks.ts:5:59]
 4 | } from "@/events/on-message-create";
 5 | import { BaseResource, type CacheFrom, type Webhook, type ReturnCache } from "seyfert";
   :                                                           ^^^^^|^^^^^
   :                                                                `-- 'ReturnCache' is imported here
 6 | import type { MakeDeepPartial, SendResolverProps } from "seyfert/lib/common";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'MakeDeepPartial' is imported but never used.
   ,-[src/cache/similar-webhooks.ts:6:15]
 5 | import { BaseResource, type CacheFrom, type Webhook, type ReturnCache } from "seyfert";
 6 | import type { MakeDeepPartial, SendResolverProps } from "seyfert/lib/common";
   :               ^^^^^^^|^^^^^^^
   :                      `-- 'MakeDeepPartial' is imported here
 7 | import type {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'SendResolverProps' is imported but never used.
   ,-[src/cache/similar-webhooks.ts:6:32]
 5 | import { BaseResource, type CacheFrom, type Webhook, type ReturnCache } from "seyfert";
 6 | import type { MakeDeepPartial, SendResolverProps } from "seyfert/lib/common";
   :                                ^^^^^^^^|^^^^^^^^
   :                                        `-- 'SendResolverProps' is imported here
 7 | import type {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'RESTPostAPIWebhookWithTokenJSONBody' is imported but never used.
    ,-[src/cache/similar-webhooks.ts:9:3]
  8 |   APIWebhook,
  9 |   RESTPostAPIWebhookWithTokenJSONBody,
    :   ^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^
    :                    `-- 'RESTPostAPIWebhookWithTokenJSONBody' is imported here
 10 |   RESTPostAPIWebhookWithTokenQuery,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'RESTPostAPIWebhookWithTokenQuery' is imported but never used.
    ,-[src/cache/similar-webhooks.ts:10:3]
  9 |   RESTPostAPIWebhookWithTokenJSONBody,
 10 |   RESTPostAPIWebhookWithTokenQuery,
    :   ^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^
    :                   `-- 'RESTPostAPIWebhookWithTokenQuery' is imported here
 11 | } from "seyfert/lib/types";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/nudges/add-user-form.ts:2:10]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext } from "seyfert";
   :          ^^^^^^^^|^^^^^^^
   :                  `-- 'ComponentCommand' is imported here
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/nudges/add-user-form.ts:2:66]
 1 | /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
 2 | import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext } from "seyfert";
   :                                                                  ^^^^^^^^|^^^^^^^
   :                                                                          `-- 'ComponentContext' is imported here
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'defaultUserStructure' is imported but never used.
   ,-[src/components/nudges/add-user-form.ts:4:10]
 3 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 4 | import { defaultUserStructure, writeUserById } from "@/types/user";
   :          ^^^^^^^^^^|^^^^^^^^^
   :                    `-- 'defaultUserStructure' is imported here
 5 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/components/systems/config/set-description.ts:7:10]
 6 | import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
 7 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 8 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'tagCollection' is imported but never used.
   ,-[src/components/systems/alter-pagination/search-form.ts:6:27]
 5 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 6 | import { alterCollection, tagCollection } from "@/mongodb";
   :                           ^^^^^^|^^^^^^
   :                                 `-- 'tagCollection' is imported here
 7 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertAssignTagView' is imported but never used.
   ,-[src/components/systems/alter-pagination/search-form.ts:8:10]
 7 | import { AlertView } from "@/views/alert";
 8 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'AlertAssignTagView' is imported here
 9 | import { alterPagination, SystemSettingsView } from "@/views/system-settings";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assignTagPagination' is imported but never used.
   ,-[src/components/systems/alter-pagination/search-form.ts:8:30]
 7 | import { AlertView } from "@/views/alert";
 8 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
   :                              ^^^^^^^^^|^^^^^^^^^
   :                                       `-- 'assignTagPagination' is imported here
 9 | import { alterPagination, SystemSettingsView } from "@/views/system-settings";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/nudge-preferences.ts:4:10]
 3 | import { userCollection } from "@/mongodb";
 4 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 5 | import { NudgePreferences } from "@/views/nudge-preferences";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/config/terminology/edit-plural-terms.ts:7:3]
 6 |   Modal,
 7 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 8 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'autocompleteAlters' is imported but never used.
    ,-[src/commands/systems/system-banner.ts:19:10]
 18 | import { deleteOldObject, getOldObject, uploadAttachment } from "@/object-storage";
 19 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'autocompleteAlters' is imported here
 20 | import { alterCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
    ,-[src/commands/systems/system-banner.ts:20:10]
 19 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
 20 | import { alterCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^^
    :                 `-- 'alterCollection' is imported here
 21 | import { assetStringGeneration, operationStringGeneration } from "@/types/operation";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'operationStringGeneration' is imported but never used.
    ,-[src/commands/systems/system-banner.ts:21:33]
 20 | import { alterCollection } from "@/mongodb";
 21 | import { assetStringGeneration, operationStringGeneration } from "@/types/operation";
    :                                 ^^^^^^^^^^^^|^^^^^^^^^^^^
    :                                             `-- 'operationStringGeneration' is imported here
 22 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'AllChannels' is imported but never used.
   ,-[src/components/guilds/blacklists/remove-category-form.ts:4:61]
 3 | import { ServerConfigView } from "@/views/server-cfg";
 4 | import { Middlewares, ModalCommand, type ModalContext, type AllChannels } from "seyfert";
   :                                                             ^^^^^|^^^^^
   :                                                                  `-- 'AllChannels' is imported here
 5 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/setup.ts:8:3]
 7 |   type CommandContext,
 8 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 9 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Emoji' is imported but never used.
    ,-[src/commands/setup.ts:10:3]
  9 |   Declare,
 10 |   Emoji,
    :   ^^|^^
    :     `-- 'Emoji' is imported here
 11 |   LocalesT,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LocalesT' is imported but never used.
    ,-[src/commands/setup.ts:11:3]
 10 |   Emoji,
 11 |   LocalesT,
    :   ^^^^|^^^
    :       `-- 'LocalesT' is imported here
 12 |   TextDisplay,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/commands/setup.ts:12:3]
 11 |   LocalesT,
 12 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 13 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
   ,-[src/components/systems/config/terminology/edit-normal-terms.ts:7:3]
 6 |   Modal,
 7 |   TextDisplay,
   :   ^^^^^|^^^^^
   :        `-- 'TextDisplay' is imported here
 8 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ChannelSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/add-category.ts:2:3]
 1 | import {
 2 |   ChannelSelectMenu,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'ChannelSelectMenu' is imported here
 3 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'RoleSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/add-category.ts:7:3]
 6 |   Modal,
 7 |   RoleSelectMenu,
   :   ^^^^^^^|^^^^^^
   :          `-- 'RoleSelectMenu' is imported here
 8 |   StringSelectMenu,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'StringSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/add-category.ts:8:3]
 7 |   RoleSelectMenu,
 8 |   StringSelectMenu,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'StringSelectMenu' is imported here
 9 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'UserSelectMenu' is imported but never used.
    ,-[src/components/guilds/blacklists/add-category.ts:10:3]
  9 |   TextInput,
 10 |   UserSelectMenu,
    :   ^^^^^^^|^^^^^^
    :          `-- 'UserSelectMenu' is imported here
 11 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'guild' is declared but never used. Unused variables should start with a '_'.
    ,-[src/components/guilds/blacklists/add-category.ts:25:11]
 24 |   override async run(ctx: ComponentContext<typeof this.componentType>) {
 25 |     const guild = await ctx.retrievePGuild();
    :           ^^|^^
    :             `-- 'guild' is declared here
 26 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'AlertAssignTagView' is imported but never used.
   ,-[src/components/systems/alter-assigning-pagination/search.ts:3:10]
 2 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 3 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'AlertAssignTagView' is imported here
 4 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertAssignTagView' is imported but never used.
    ,-[src/components/systems/alter-pagination/search.ts:11:10]
 10 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 11 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
    :          ^^^^^^^^^|^^^^^^^^
    :                   `-- 'AlertAssignTagView' is imported here
 12 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'assignTagPagination' is imported but never used.
    ,-[src/components/systems/alter-pagination/search.ts:11:30]
 10 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 11 | import { AlertAssignTagView, assignTagPagination } from "@/views/alter-assign-tag";
    :                              ^^^^^^^^^|^^^^^^^^^
    :                                       `-- 'assignTagPagination' is imported here
 12 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'set' is imported but never used.
   ,-[src/commands/reproxy.ts:2:10]
 1 | import { getColor } from "colorthief";
 2 | import { set } from "lodash";
   :          ^|^
   :           `-- 'set' is imported here
 3 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'IgnoreCommand' is imported but never used.
    ,-[src/commands/reproxy.ts:12:3]
 11 |   Declare,
 12 |   IgnoreCommand,
    :   ^^^^^^|^^^^^^
    :         `-- 'IgnoreCommand' is imported here
 13 |   MediaGallery,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MediaGallery' is imported but never used.
    ,-[src/commands/reproxy.ts:13:3]
 12 |   IgnoreCommand,
 13 |   MediaGallery,
    :   ^^^^^^|^^^^^
    :         `-- 'MediaGallery' is imported here
 14 |   Message,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'APIContainerComponent' is imported but never used.
    ,-[src/commands/reproxy.ts:23:8]
 22 | import {
 23 |   type APIContainerComponent,
    :        ^^^^^^^^^^|^^^^^^^^^^
    :                  `-- 'APIContainerComponent' is imported here
 24 |   type APIMediaGalleryComponent,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'APIMediaGalleryComponent' is imported but never used.
    ,-[src/commands/reproxy.ts:24:8]
 23 |   type APIContainerComponent,
 24 |   type APIMediaGalleryComponent,
    :        ^^^^^^^^^^^^|^^^^^^^^^^^
    :                    `-- 'APIMediaGalleryComponent' is imported here
 25 |   type APITextDisplayComponent,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'APITextDisplayComponent' is imported but never used.
    ,-[src/commands/reproxy.ts:25:8]
 24 |   type APIMediaGalleryComponent,
 25 |   type APITextDisplayComponent,
    :        ^^^^^^^^^^^|^^^^^^^^^^^
    :                   `-- 'APITextDisplayComponent' is imported here
 26 |   ComponentType,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getSystemFeatures' is imported but never used.
    ,-[src/commands/reproxy.ts:34:10]
 33 | import { emojis } from "@/lib/emojis";
 34 | import { getSystemFeatures } from "@/lib/get-system-flags";
    :          ^^^^^^^^|^^^^^^^^
    :                  `-- 'getSystemFeatures' is imported here
 35 | import { getModernComponentsMappings } from "@/lib/proxying";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'changeLatch' is declared but never used. Unused variables should start with a '_'.
    ,-[src/commands/reproxy.ts:66:47]
 65 |     const { system } = await ctx.retrievePUser();
 66 |     const { alter: alterName, "change-latch": changeLatch } = ctx.options;
    :                                               ^^^^^|^^^^^
    :                                                    `-- 'changeLatch' is declared here
 67 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/commands/reproxy.ts:245:20]
 244 |             color = (await getColor(image))?.hex() ?? "Green";
 245 |           } catch (_) {}
     :                    |
     :                    `-- '_' is declared here
 246 | 
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'UserSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/add-role.ts:8:3]
 7 |   RoleSelectMenu,
 8 |   UserSelectMenu,
   :   ^^^^^^^|^^^^^^
   :          `-- 'UserSelectMenu' is imported here
 9 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/guilds/roles/new-form.ts:2:3]
 1 | import {
 2 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 3 |   Container,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/components/guilds/roles/new-form.ts:3:3]
 2 |   ComponentCommand,
 3 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 4 |   type GuildRole,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/guilds/roles/new-form.ts:8:8]
 7 |   type ModalContext,
 8 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 9 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInput' is imported but never used.
   ,-[src/components/guilds/manage-managers.ts:7:3]
 6 |   RoleSelectMenu,
 7 |   TextInput,
   :   ^^^^|^^^^
   :       `-- 'TextInput' is imported here
 8 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextInputStyle' is imported but never used.
    ,-[src/components/guilds/manage-managers.ts:11:10]
 10 | import { InteractionIdentifier } from "@/lib/interaction-ids";
 11 | import { TextInputStyle } from "seyfert/lib/types";
    :          ^^^^^^^|^^^^^^
    :                 `-- 'TextInputStyle' is imported here
 12 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PGuild' is imported but never used.
   ,-[src/cache/i18n.ts:1:15]
 1 | import type { PGuild } from "plurography";
   :               ^^^|^^
   :                  `-- 'PGuild' is imported here
 2 | import { BaseResource, type CacheFrom } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Interaction' is imported but never used.
    ,-[src/extended-context.ts:18:3]
 17 |   extendContext,
 18 |   Interaction,
    :   ^^^^^|^^^^^
    :        `-- 'Interaction' is imported here
 19 |   Message,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'WebhookMessage' is imported but never used.
    ,-[src/extended-context.ts:21:3]
 20 |   TextDisplay,
 21 |   WebhookMessage,
    :   ^^^^^^^|^^^^^^
    :          `-- 'WebhookMessage' is imported here
 22 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'InteractionMessageUpdateBodyRequest' is imported but never used.
    ,-[src/extended-context.ts:25:3]
 24 |   InteractionCreateBodyRequest,
 25 |   InteractionMessageUpdateBodyRequest,
    :   ^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^
    :                    `-- 'InteractionMessageUpdateBodyRequest' is imported here
 26 |   MessageWebhookCreateBodyRequest,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'APIInteraction' is imported but never used.
    ,-[src/extended-context.ts:28:15]
 27 | } from "seyfert/lib/common";
 28 | import { type APIInteraction, ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :               ^^^^^^^|^^^^^^
    :                      `-- 'APIInteraction' is imported here
 29 | import { client } from ".";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'InteractionIdentifier' is imported but never used.
    ,-[src/extended-context.ts:31:10]
 30 | import { emojis } from "./lib/emojis";
 31 | import { InteractionIdentifier } from "./lib/interaction-ids";
    :          ^^^^^^^^^^|^^^^^^^^^^
    :                    `-- 'InteractionIdentifier' is imported here
 32 | import { getLanguageByUserId, langMemoryCache } from "./lib/lang";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
     ,-[src/extended-context.ts:115:37]
 114 |           if (i.isButton()) {
 115 |             message.delete().catch((_) => null);
     :                                     |
     :                                     `-- '_' is declared here
 116 |             const writtenMessage = await modal.write(body, true);
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
     ,-[src/extended-context.ts:141:35]
 140 |         if (i.isButton()) {
 141 |           message.delete().catch((_) => null);
     :                                   |
     :                                   `-- '_' is declared here
 142 |           const writtenMessage = await i.write(body, true);
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/extended-context.ts:181:18]
 180 |           langMemoryCache[interaction.user.id] = data;
 181 |         } catch (_) {}
     :                  |
     :                  `-- '_' is declared here
 182 |       }
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/extended-context.ts:185:14]
 184 |       return data;
 185 |     } catch (_) {
     :              |
     :              `-- '_' is declared here
 186 |       return "en";
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/extended-context.ts:202:18]
 201 |           terminologyMemoryCache[interaction.user.id] = data;
 202 |         } catch (_) {}
     :                  |
     :                  `-- '_' is declared here
 203 |       }
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
     ,-[src/extended-context.ts:205:14]
 204 |       return JSON.parse(data);
 205 |     } catch (_) {
     :              |
     :              `-- '_' is declared here
 206 |       return terminologyDefaults;
     `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/commands/alter.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   AutoLoad,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AutoLoad' is imported but never used.
   ,-[src/commands/alter.ts:5:3]
 4 |   ActionRow,
 5 |   AutoLoad,
   :   ^^^^|^^^
   :       `-- 'AutoLoad' is imported here
 6 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/commands/alter.ts:6:3]
 5 |   AutoLoad,
 6 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 7 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LocalesT' is imported but never used.
    ,-[src/commands/alter.ts:12:3]
 11 |   Declare,
 12 |   LocalesT,
    :   ^^^^|^^^
    :       `-- 'LocalesT' is imported here
 13 |   Message,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/commands/alter.ts:91:16]
 90 |             })));
 91 |       } catch (_) {
    :                |
    :                `-- '_' is declared here
 92 |         return await ctx.ephemeral(
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'ChannelSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/remove-category.ts:2:3]
 1 | import {
 2 |   ChannelSelectMenu,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'ChannelSelectMenu' is imported here
 3 |   ComponentCommand,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'RoleSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/remove-category.ts:7:3]
 6 |   Modal,
 7 |   RoleSelectMenu,
   :   ^^^^^^^|^^^^^^
   :          `-- 'RoleSelectMenu' is imported here
 8 |   StringSelectMenu,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'StringSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/remove-category.ts:8:3]
 7 |   RoleSelectMenu,
 8 |   StringSelectMenu,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'StringSelectMenu' is imported here
 9 |   TextInput,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'UserSelectMenu' is imported but never used.
    ,-[src/components/guilds/blacklists/remove-category.ts:10:3]
  9 |   TextInput,
 10 |   UserSelectMenu,
    :   ^^^^^^^|^^^^^^
    :          `-- 'UserSelectMenu' is imported here
 11 |   type ComponentContext,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'guild' is declared but never used. Unused variables should start with a '_'.
    ,-[src/components/guilds/blacklists/remove-category.ts:25:11]
 24 |   override async run(ctx: ComponentContext<typeof this.componentType>) {
 25 |     const guild = await ctx.retrievePGuild();
    :           ^^|^^
    :             `-- 'guild' is declared here
 26 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Identifier 'getUserById' is imported but never used.
   ,-[src/components/systems/alters/remove-alter.ts:8:10]
 7 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 8 | import { getUserById, writeUserById } from "@/types/user";
   :          ^^^^^|^^^^^
   :               `-- 'getUserById' is imported here
 9 | import { emojis } from "@/lib/emojis";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'writeUserById' is imported but never used.
   ,-[src/components/systems/alters/remove-alter.ts:8:23]
 7 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
 8 | import { getUserById, writeUserById } from "@/types/user";
   :                       ^^^^^^|^^^^^^
   :                             `-- 'writeUserById' is imported here
 9 | import { emojis } from "@/lib/emojis";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/commands/fwf.ts:2:3]
 1 | import {
 2 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 3 |   Command,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/guilds/roles/search-form.ts:2:3]
 1 | import {
 2 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 3 |   Middlewares,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/guilds/roles/search-form.ts:6:8]
 5 |   type ModalContext,
 6 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 7 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'OKFunction' is imported but never used.
    ,-[src/commands/systems/create-tag.command.ts:9:8]
  8 |   Declare,
  9 |   type OKFunction,
    :        ^^^^^|^^^^
    :             `-- 'OKFunction' is imported here
 10 |   Options,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Variable 'server' is declared but never used. Unused variables should start with a '_'.
    ,-[src/commands/systems/create-tag.command.ts:57:11]
 56 |     const user = await ctx.retrievePUser();
 57 |     const server = await ctx.retrievePGuild();
    :           ^^^|^^
    :              `-- 'server' is declared here
 58 | 
    `----
  help: Consider removing this declaration.

  ! eslint(no-unused-vars): Type 'PGuild' is imported but never used.
   ,-[src/cache/terminology.ts:1:15]
 1 | import type { PGuild } from "plurography";
   :               ^^^|^^
   :                  `-- 'PGuild' is imported here
 2 | import { BaseResource, type CacheFrom } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'DefaultLocale' is imported but never used.
   ,-[src/views/loading.ts:3:26]
 2 | 
 3 | import { Container, type DefaultLocale, TextDisplay } from "seyfert";
   :                          ^^^^^^|^^^^^^
   :                                `-- 'DefaultLocale' is imported here
 4 | import type { TranslationString } from "../lang";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createUserOption' is imported but never used.
   ,-[src/commands/app.ts:5:3]
 4 |   Container,
 5 |   createUserOption,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'createUserOption' is imported here
 6 |   Declare,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LocalesT' is imported but never used.
   ,-[src/commands/app.ts:7:3]
 6 |   Declare,
 7 |   LocalesT,
   :   ^^^^|^^^
   :       `-- 'LocalesT' is imported here
 8 |   type Message,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/commands/app.ts:26:50]
 25 |       if (ctx.isChat() && ctx.message) {
 26 |         (ctx.message as Message).delete().catch((_) => null);
    :                                                  |
    :                                                  `-- '_' is declared here
 27 |         try {
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/commands/app.ts:34:18]
 33 |           });
 34 |         } catch (_) {}
    :                  |
    :                  `-- '_' is declared here
 35 |         return;
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'UserSelectMenu' is imported but never used.
   ,-[src/components/guilds/roles/search.ts:7:3]
 6 |   RoleSelectMenu,
 7 |   UserSelectMenu,
   :   ^^^^^^^|^^^^^^
   :          `-- 'UserSelectMenu' is imported here
 8 |   type ComponentContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'AllChannels' is imported but never used.
   ,-[src/components/guilds/blacklists/add-category-form.ts:4:61]
 3 | import { ServerConfigView } from "@/views/server-cfg";
 4 | import { Middlewares, ModalCommand, type ModalContext, type AllChannels } from "seyfert";
   :                                                             ^^^^^|^^^^^
   :                                                                  `-- 'AllChannels' is imported here
 5 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlterProtectionFlags' is imported but never used.
    ,-[src/components/systems/alters/create-new-alter-form.ts:15:10]
 14 | import { uploadAttachment } from "@/object-storage";
 15 | import { AlterProtectionFlags, PAlterObject } from "@/types/alter";
    :          ^^^^^^^^^^|^^^^^^^^^
    :                    `-- 'AlterProtectionFlags' is imported here
 16 | import { getUserById, writeUserById } from "@/types/user";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
   ,-[src/commands/systems/system-nickname-format.ts:3:10]
 2 | import { AlertView } from "@/views/alert";
 3 | import { SystemSettingsView } from "@/views/system-settings";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'SystemSettingsView' is imported here
 4 | import { type CommandContext, createStringOption, Declare, Options, SubCommand } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'operationStringGeneration' is imported but never used.
    ,-[src/commands/alters/alter-picture.ts:23:33]
 22 | import { alterCollection } from "@/mongodb";
 23 | import { assetStringGeneration, operationStringGeneration } from "@/types/operation";
    :                                 ^^^^^^^^^^^^|^^^^^^^^^^^^
    :                                             `-- 'operationStringGeneration' is imported here
 24 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'Document' is imported but never used.
   ,-[src/commands/alters/alter-rename.ts:3:15]
 2 | 
 3 | import type { Document } from "mongodb";
   :               ^^^^|^^^
   :                   `-- 'Document' is imported here
 4 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'getUserById' is imported but never used.
    ,-[src/commands/alters/alter-rename.ts:17:10]
 16 | import { alterCollection } from "@/mongodb";
 17 | import { getUserById } from "@/types/user";
    :          ^^^^^|^^^^^
    :               `-- 'getUserById' is imported here
 18 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AttachmentBuilder' is imported but never used.
   ,-[src/views/system.ts:5:3]
 4 |   ActionRow,
 5 |   AttachmentBuilder,
   :   ^^^^^^^^|^^^^^^^^
   :           `-- 'AttachmentBuilder' is imported here
 6 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'RoleSelectMenu' is imported but never used.
   ,-[src/components/guilds/blacklists/add-channel.ts:8:3]
 7 |   Modal,
 8 |   RoleSelectMenu,
   :   ^^^^^^^|^^^^^^
   :          `-- 'RoleSelectMenu' is imported here
 9 |   UserSelectMenu,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'UserSelectMenu' is imported but never used.
    ,-[src/components/guilds/blacklists/add-channel.ts:9:3]
  8 |   RoleSelectMenu,
  9 |   UserSelectMenu,
    :   ^^^^^^^|^^^^^^
    :          `-- 'UserSelectMenu' is imported here
 10 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'Attachment' is imported but never used.
   ,-[src/commands/alters/alter-color.ts:4:8]
 3 | import {
 4 |   type Attachment,
   :        ^^^^^|^^^^
   :             `-- 'Attachment' is imported here
 5 |   type CommandContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/commands/alters/alter-color.ts:6:3]
 5 |   type CommandContext,
 6 |   Container,
   :   ^^^^|^^^^
   :       `-- 'Container' is imported here
 7 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MediaGallery' is imported but never used.
    ,-[src/commands/alters/alter-color.ts:9:3]
  8 |   Declare,
  9 |   MediaGallery,
    :   ^^^^^^|^^^^^
    :         `-- 'MediaGallery' is imported here
 10 |   MediaGalleryItem,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MediaGalleryItem' is imported but never used.
    ,-[src/commands/alters/alter-color.ts:10:3]
  9 |   MediaGallery,
 10 |   MediaGalleryItem,
    :   ^^^^^^^^|^^^^^^^
    :           `-- 'MediaGalleryItem' is imported here
 11 |   type OKFunction,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'svix' is imported but never used.
    ,-[src/commands/alters/alter-color.ts:17:10]
 16 | import { writeBack } from "@/lib/pk-sync-engine";
 17 | import { svix, w } from "@/webhooks";
    :          ^^|^
    :            `-- 'svix' is imported here
 18 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ComponentCommand' is imported but never used.
   ,-[src/components/guilds/errors/search-form.ts:2:3]
 1 | import {
 2 |   ComponentCommand,
   :   ^^^^^^^^|^^^^^^^
   :           `-- 'ComponentCommand' is imported here
 3 |   Middlewares,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'ComponentContext' is imported but never used.
   ,-[src/components/guilds/errors/search-form.ts:6:8]
 5 |   type ModalContext,
 6 |   type ComponentContext,
   :        ^^^^^^^^|^^^^^^^
   :                `-- 'ComponentContext' is imported here
 7 | } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
    ,-[src/components/guilds/errors/search-form.ts:9:10]
  8 | import { InteractionIdentifier } from "@/lib/interaction-ids";
  9 | import { AlertView } from "@/views/alert";
    :          ^^^^|^^^^
    :              `-- 'AlertView' is imported here
 10 | import { MessageFlags } from "seyfert/lib/types";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'FindCursor' is imported but never used.
   ,-[src/views/system-settings.ts:4:15]
 3 | import { DiscordSnowflake } from "@sapphire/snowflake";
 4 | import type { FindCursor, WithId } from "mongodb";
   :               ^^^^^|^^^^
   :                    `-- 'FindCursor' is imported here
 5 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'POperation' is imported but never used.
   ,-[src/views/system-settings.ts:7:8]
 6 |   type PImportTranscript,
 7 |   type POperation,
   :        ^^^^^|^^^^
   :             `-- 'POperation' is imported here
 8 |   type PUser,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SelectMenu' is imported but never used.
    ,-[src/views/system-settings.ts:18:3]
 17 |   Section,
 18 |   SelectMenu,
    :   ^^^^^|^^^^
    :        `-- 'SelectMenu' is imported here
 19 |   Separator,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PAlter' is imported but never used.
    ,-[src/views/system-settings.ts:29:37]
 28 | import { alterCollection, tagCollection } from "@/mongodb";
 29 | import { AlterProtectionFlags, type PAlter } from "@/types/alter";
    :                                     ^^^|^^
    :                                        `-- 'PAlter' is imported here
 30 | import { build } from "..";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter 'guildId' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/views/system-settings.ts:239:5]
 238 |     system,
 239 |     guildId,
     :     ^^^|^^^
     :        `-- 'guildId' is declared here
 240 |     $translations,
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter 'guildId' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/views/system-settings.ts:394:5]
 393 |     system,
 394 |     guildId,
     :     ^^^|^^^
     :        `-- 'guildId' is declared here
 395 |     $translations,
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Parameter 'system' is declared but never used. Unused parameters should start with a '_'.
     ,-[src/views/system-settings.ts:884:18]
 883 | 
 884 |   importSettings(system: PSystem) {
     :                  ^^^|^^
     :                     `-- 'system' is declared here
 885 |     return [
     `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Identifier 'CommandContext' is imported but never used.
   ,-[src/commands/alters/edit-alter.ts:3:38]
 2 | 
 3 | import { Command, AutoLoad, Declare, CommandContext } from "seyfert";
   :                                      ^^^^^^^|^^^^^^
   :                                             `-- 'CommandContext' is imported here
 4 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'autocompleteAlters' is imported but never used.
   ,-[src/commands/systems/system-description.ts:4:10]
 3 | import { SubCommand } from "seyfert";
 4 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'autocompleteAlters' is imported here
 5 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/commands/systems/system-description.ts:5:10]
 4 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
 5 | import { alterCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 6 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createBooleanOption' is imported but never used.
    ,-[src/commands/systems/system-description.ts:10:3]
  9 |   Container,
 10 |   createBooleanOption,
    :   ^^^^^^^^^|^^^^^^^^^
    :            `-- 'createBooleanOption' is imported here
 11 |   createStringOption,
    `----
  help: Consider removing this import.

  ! unicorn(no-unnecessary-await): Unexpected `await` on a non-Promise value
    ,-[src/commands/systems/system-description.ts:82:12]
 81 |         ...new AlertView(await ctx.userTranslations()).successViewCustom(
 82 |           (await await ctx.userTranslations()).ALTER_SUCCESS_DESC.replace(
    :            ^^^^^
 83 |             "@%alter%",
    `----
  help: Consider removing the `await`

  ! eslint(no-unused-vars): Identifier 'operationStringGeneration' is imported but never used.
    ,-[src/commands/alters/alter-banner.ts:22:33]
 21 | import { alterCollection } from "@/mongodb";
 22 | import { assetStringGeneration, operationStringGeneration } from "@/types/operation";
    :                                 ^^^^^^^^^^^^|^^^^^^^^^^^^
    :                                             `-- 'operationStringGeneration' is imported here
 23 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LoadingView' is imported but never used.
   ,-[src/commands/alters/alter-proxy-mode.ts:8:10]
 7 | import { AlterView } from "@/views/alters";
 8 | import { LoadingView } from "@/views/loading";
   :          ^^^^^|^^^^^
   :               `-- 'LoadingView' is imported here
 9 | import { type CommandContext, createStringOption, Declare, Options } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'sendAutoproxyOperationDM' is imported but never used.
   ,-[src/commands/auto-proxy/custom.ts:2:10]
 1 | import { runCustomProviderCommand } from "@/lib/ap-cmds/custom";
 2 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
   :          ^^^^^^^^^^^^|^^^^^^^^^^^
   :                      `-- 'sendAutoproxyOperationDM' is imported here
 3 | import { getOAuthConsents } from "@/lib/oauth";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
   ,-[src/commands/auto-proxy/custom.ts:4:10]
 3 | import { getOAuthConsents } from "@/lib/oauth";
 4 | import { userCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^
   :                 `-- 'userCollection' is imported here
 5 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/auto-proxy/custom.ts:5:10]
 4 | import { userCollection } from "@/mongodb";
 5 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 6 | import type { PAutoProxy } from "plurography";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PAutoProxy' is imported but never used.
   ,-[src/commands/auto-proxy/custom.ts:6:15]
 5 | import { AlertView } from "@/views/alert";
 6 | import type { PAutoProxy } from "plurography";
   :               ^^^^^|^^^^
   :                    `-- 'PAutoProxy' is imported here
 7 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
    ,-[src/commands/auto-proxy/custom.ts:9:3]
  8 |   type CommandContext,
  9 |   Container,
    :   ^^^^|^^^^
    :       `-- 'Container' is imported here
 10 |   createStringOption,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
    ,-[src/commands/auto-proxy/custom.ts:16:10]
 15 | } from "seyfert";
 16 | import { MessageFlags } from "seyfert/lib/types";
    :          ^^^^^^|^^^^^
    :                `-- 'MessageFlags' is imported here
 17 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Middlewares' is imported but never used.
   ,-[src/commands/alters/delete-alter.command.ts:3:10]
 2 | 
 3 | import { Middlewares, SubCommand } from "seyfert";
   :          ^^^^^|^^^^^
   :               `-- 'Middlewares' is imported here
 4 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
    ,-[src/commands/auto-proxy/off.ts:11:10]
 10 | } from "seyfert";
 11 | import { MessageFlags } from "seyfert/lib/types";
    :          ^^^^^^|^^^^^
    :                `-- 'MessageFlags' is imported here
 12 | import { Shortcut } from "yunaforseyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Shortcut' is imported but never used.
    ,-[src/commands/auto-proxy/off.ts:12:10]
 11 | import { MessageFlags } from "seyfert/lib/types";
 12 | import { Shortcut } from "yunaforseyfert";
    :          ^^^^|^^^
    :              `-- 'Shortcut' is imported here
 13 | import { runOffCommand } from "@/lib/ap-cmds/off";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'sendAutoproxyOperationDM' is imported but never used.
    ,-[src/commands/auto-proxy/off.ts:14:10]
 13 | import { runOffCommand } from "@/lib/ap-cmds/off";
 14 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
    :          ^^^^^^^^^^^^|^^^^^^^^^^^
    :                      `-- 'sendAutoproxyOperationDM' is imported here
 15 | import { userCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
    ,-[src/commands/auto-proxy/off.ts:15:10]
 14 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
 15 | import { userCollection } from "@/mongodb";
    :          ^^^^^^^|^^^^^^
    :                 `-- 'userCollection' is imported here
 16 | import type { PAutoProxy } from "@/types/auto-proxy";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PAutoProxy' is imported but never used.
    ,-[src/commands/auto-proxy/off.ts:16:15]
 15 | import { userCollection } from "@/mongodb";
 16 | import type { PAutoProxy } from "@/types/auto-proxy";
    :               ^^^^^|^^^^
    :                    `-- 'PAutoProxy' is imported here
 17 | import { AlertView } from "@/views/alert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
    ,-[src/commands/auto-proxy/off.ts:17:10]
 16 | import type { PAutoProxy } from "@/types/auto-proxy";
 17 | import { AlertView } from "@/views/alert";
    :          ^^^^|^^^^
    :              `-- 'AlertView' is imported here
 18 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'RoleSelectMenu' is imported but never used.
   ,-[src/components/guilds/errors/search.ts:8:3]
 7 |   Modal,
 8 |   RoleSelectMenu,
   :   ^^^^^^^|^^^^^^
   :          `-- 'RoleSelectMenu' is imported here
 9 |   StringSelectMenu,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'sendAutoproxyOperationDM' is imported but never used.
   ,-[src/commands/auto-proxy/latch.ts:5:10]
 4 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
 5 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
   :          ^^^^^^^^^^^^|^^^^^^^^^^^
   :                      `-- 'sendAutoproxyOperationDM' is imported here
 6 | import { alterCollection, userCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'alterCollection' is imported but never used.
   ,-[src/commands/auto-proxy/latch.ts:6:10]
 5 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
 6 | import { alterCollection, userCollection } from "@/mongodb";
   :          ^^^^^^^|^^^^^^^
   :                 `-- 'alterCollection' is imported here
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'userCollection' is imported but never used.
   ,-[src/commands/auto-proxy/latch.ts:6:27]
 5 | import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
 6 | import { alterCollection, userCollection } from "@/mongodb";
   :                           ^^^^^^^|^^^^^^
   :                                  `-- 'userCollection' is imported here
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PAutoProxy' is imported but never used.
   ,-[src/commands/auto-proxy/latch.ts:7:15]
 6 | import { alterCollection, userCollection } from "@/mongodb";
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
   :               ^^^^^|^^^^
   :                    `-- 'PAutoProxy' is imported here
 8 | import { AlertView } from "@/views/alert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'AlertView' is imported but never used.
   ,-[src/commands/auto-proxy/latch.ts:8:10]
 7 | import type { PAutoProxy } from "@/types/auto-proxy";
 8 | import { AlertView } from "@/views/alert";
   :          ^^^^|^^^^
   :              `-- 'AlertView' is imported here
 9 | import {
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'User' is imported but never used.
    ,-[src/commands/auto-proxy/latch.ts:15:3]
 14 |   Options,
 15 |   User,
    :   ^^|^
    :     `-- 'User' is imported here
 16 |   IgnoreCommand,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'MessageFlags' is imported but never used.
    ,-[src/commands/auto-proxy/latch.ts:18:10]
 17 | } from "seyfert";
 18 | import { MessageFlags } from "seyfert/lib/types";
    :          ^^^^^^|^^^^^
    :                `-- 'MessageFlags' is imported here
 19 | 
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'friendlyProtectionSystem' is imported but never used.
    ,-[src/views/alters.ts:22:3]
 21 |   friendlyProtectionAlters,
 22 |   friendlyProtectionSystem,
    :   ^^^^^^^^^^^^|^^^^^^^^^^^
    :               `-- 'friendlyProtectionSystem' is imported here
 23 |   has,
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'listFromMaskSystems' is imported but never used.
    ,-[src/views/alters.ts:25:3]
 24 |   listFromMaskAlters,
 25 |   listFromMaskSystems,
    :   ^^^^^^^^^|^^^^^^^^^
    :            `-- 'listFromMaskSystems' is imported here
 26 | } from "@/lib/privacy-bitmask";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'paginateComponents' is imported but never used.
    ,-[src/views/alters.ts:28:8]
 27 | import { sanitizeEmojis } from "@/lib/sanitize-emojis";
 28 | import paginateComponents from "@/lib/views/paginate";
    :        ^^^^^^^^^|^^^^^^^^
    :                 `-- 'paginateComponents' is imported here
 29 | import { tagCollection } from "@/mongodb";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Type 'PSystem' is imported but never used.
    ,-[src/views/alters.ts:30:15]
 29 | import { tagCollection } from "@/mongodb";
 30 | import type { PSystem } from "@/types/system";
    :               ^^^|^^^
    :                  `-- 'PSystem' is imported here
 31 | import type { PTag } from "@/types/tag";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createBooleanOption' is imported but never used.
   ,-[src/commands/alters/alter-pronouns.ts:6:3]
 5 |   Container,
 6 |   createBooleanOption,
   :   ^^^^^^^^^|^^^^^^^^^
   :            `-- 'createBooleanOption' is imported here
 7 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Command' is imported but never used.
   ,-[src/middleware/server-block.middleware.ts:2:10]
 1 | import { PGuildObject } from "plurography";
 2 | import { Command, ComponentContext, createMiddleware, type Message, SubCommand } from "seyfert";
   :          ^^^|^^^
   :             `-- 'Command' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SubCommand' is imported but never used.
   ,-[src/middleware/server-block.middleware.ts:2:69]
 1 | import { PGuildObject } from "plurography";
 2 | import { Command, ComponentContext, createMiddleware, type Message, SubCommand } from "seyfert";
   :                                                                     ^^^^^|^^^^
   :                                                                          `-- 'SubCommand' is imported here
 3 | import { MessageFlags } from "seyfert/lib/types";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/middleware/server-block.middleware.ts:46:50]
 45 |       if (ctx instanceof ComponentContext && ctx.message) {
 46 |         (ctx.message as Message).delete().catch((_) => null);
    :                                                  |
    :                                                  `-- '_' is declared here
 47 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/middleware/server-block.middleware.ts:70:22]
 69 |               });
 70 |             } catch (_) {}
    :                      |
    :                      `-- '_' is declared here
 71 | 
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/middleware/server-block.middleware.ts:86:18]
 85 |           });
 86 |         } catch (_) {}
    :                  |
    :                  `-- '_' is declared here
 87 |         return await middle.stop();
    `----
  help: Consider handling this error.

  ! eslint(no-unused-vars): Identifier 'ActionRow' is imported but never used.
   ,-[src/commands/alters/alter-assign.ts:4:3]
 3 | import {
 4 |   ActionRow,
   :   ^^^^|^^^^
   :       `-- 'ActionRow' is imported here
 5 |   Button,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Button' is imported but never used.
   ,-[src/commands/alters/alter-assign.ts:5:3]
 4 |   ActionRow,
 5 |   Button,
   :   ^^^|^^
   :      `-- 'Button' is imported here
 6 |   type CommandContext,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'TextDisplay' is imported but never used.
    ,-[src/commands/alters/alter-assign.ts:11:3]
 10 |   SubCommand,
 11 |   TextDisplay,
    :   ^^^^^|^^^^^
    :        `-- 'TextDisplay' is imported here
 12 | } from "seyfert";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'ButtonStyle' is imported but never used.
    ,-[src/commands/alters/alter-assign.ts:13:10]
 12 | } from "seyfert";
 13 | import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
    :          ^^^^^|^^^^^
    :               `-- 'ButtonStyle' is imported here
 14 | import { autocompleteAlters } from "@/lib/autocomplete-alters";
    `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'emojis' is imported but never used.
    ,-[src/commands/alters/alter-assign.ts:16:10]
 15 | import { autocompleteTags } from "@/lib/autocomplete-tags";
 16 | import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
    :          ^^^|^^
    :             `-- 'emojis' is imported here
 17 | import { writeBack } from "@/lib/pk-sync-engine";
    `----
  help: Consider removing this import.

  ! unicorn(no-unnecessary-await): Unexpected `await` on a non-Promise value
     ,-[src/commands/alters/alter-assign.ts:101:14]
 100 |           components: new AlertView(await ctx.userTranslations()).errorViewCustom(
 101 |             (await await ctx.userTranslations()).TAG_ALREADY_ASSIGNED.replaceAll(
     :              ^^^^^
 102 |               "%tag%",
     `----
  help: Consider removing the `await`

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
   ,-[src/commands/systems/system-pronouns.ts:3:10]
 2 | import { AlertView } from "@/views/alert";
 3 | import { SystemSettingsView } from "@/views/system-settings";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'SystemSettingsView' is imported here
 4 | import { type CommandContext, createStringOption, Declare, Options, SubCommand } from "seyfert";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'createNumberOption' is imported but never used.
   ,-[src/commands/systems/config/set-latch-delay.command.ts:7:3]
 6 |   type CommandContext,
 7 |   createNumberOption,
   :   ^^^^^^^^^|^^^^^^^^
   :            `-- 'createNumberOption' is imported here
 8 |   createStringOption,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'SystemSettingsView' is imported but never used.
   ,-[src/commands/alters/alter-proxy-tags.ts:6:10]
 5 | import { MessageFlags } from "seyfert/lib/types";
 6 | import { SystemSettingsView } from "@/views/system-settings";
   :          ^^^^^^^^^|^^^^^^^^
   :                   `-- 'SystemSettingsView' is imported here
 7 | import { alterCollection } from "@/mongodb";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Container' is imported but never used.
   ,-[src/middleware/global-block.middleware.ts:3:10]
 2 | 
 3 | import { Container, createMiddleware } from "seyfert";
   :          ^^^^|^^^^
   :              `-- 'Container' is imported here
 4 | import { middlewareIssue } from "../lib/middleware-issue";
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'Message' is imported but never used.
   ,-[src/commands/context/get-message-info.ts:7:19]
 6 | import type { MenuCommandContext, MessageCommandInteraction } from "seyfert";
 7 | import { Declare, Message } from "seyfert";
   :                   ^^^|^^^
   :                      `-- 'Message' is imported here
 8 | import { ContextMenuCommand } from "seyfert";
   `----
  help: Consider removing this import.

  ! typescript(no-non-null-asserted-optional-chain): Optional chain expressions can return undefined by design: using a non-null assertion is unsafe and wrong.
    ,-[src/commands/context/get-message-info.ts:54:68]
 53 |         ctx.target,
 54 |         await (await ctx.guild())?.members.fetch(user.userId, true)!,
    :                                  |                                 |
    :                                  |                                 `-- non-null assertion made after optional chain
    :                                  `-- optional chain used
 55 |         alter.systemId !== ctx.author.id,
    `----
  help: Remove the non-null assertion.

  ! eslint(no-unused-vars): Identifier 'ChannelType' is imported but never used.
   ,-[src/middleware/no-webhook.middleware.ts:2:10]
 1 | import { createMiddleware } from "seyfert";
 2 | import { ChannelType } from "seyfert/lib/types";
   :          ^^^^^|^^^^^
   :               `-- 'ChannelType' is imported here
 3 | 
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Identifier 'LocalesT' is imported but never used.
   ,-[src/commands/check-permissions.ts:8:3]
 7 |   Declare,
 8 |   LocalesT,
   :   ^^^^|^^^
   :       `-- 'LocalesT' is imported here
 9 |   type Message,
   `----
  help: Consider removing this import.

  ! eslint(no-unused-vars): Parameter '_' is declared but never used.
    ,-[src/commands/check-permissions.ts:25:50]
 24 |       if (ctx.isChat() && ctx.message) {
 25 |         (ctx.message as Message).delete().catch((_) => null);
    :                                                  |
    :                                                  `-- '_' is declared here
 26 | 
    `----
  help: Consider removing this parameter.

  ! eslint(no-unused-vars): Catch parameter '_' is caught but never used.
    ,-[src/commands/check-permissions.ts:34:18]
 33 |           });
 34 |         } catch (_) {}
    :                  |
    :                  `-- '_' is declared here
 35 |         return;
    `----
  help: Consider handling this error.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/webhooks.ts:6:3]
  5 |      export function w(userId: string, type: string, payload: any) {
  6 | ,-->   (async () => {
  7 | ||       try {
  8 | ||         const application = await svix.application
  9 | ||           .getOrCreate({
 10 | ||             name: `Webhooks - ${userId}`,
 11 | ||             uid: userId,
 12 | ||           })
 13 | ||           .catch((v) => null);
 14 | ||   
 15 | ||         if (!application) return;
 16 | ||   
 17 | ||         await svix.message.create(userId, {
 18 | ||           eventType: type,
 19 | ||           payload: { ...payload, userId },
 20 | ||         });
 21 | ||       } catch (_) {}
 22 | |-->   })();
    : `----- This unhandled promise-like value has type `Promise<void>`.
 23 |      }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/types/guild.ts:15:3]
 14 |   const guild = (await guildCollection.findOne({ guildId: id })) ?? defaultGuildStructure(id);
 15 |   client.cache.pguild.set(CacheFrom.Gateway, guild.guildId, { g: guild });
    :   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                                      `-- This unhandled promise-like value has type `Awaitable<void>`.
 16 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-base-to-string): 'operation[c]' may use Object's default stringification format ('[object Object]') when stringified.
     ,-[src/lib/system-operation.ts:164:11]
 163 |           "%value%",
 164 |           operation[c]?.toString() ?? "?",
     :           ^^^^^^^^^^^^
 165 |         );
     `----
  help: Consider picking a property (e.g. `user.name`), using a formatter (or `JSON.stringify`), or implementing a custom `toString()`/`toLocaleString()` on the type.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/system-operation.ts:182:3]
 181 |      
 182 | ,-->   (async () => {
 183 | ||       const { syncConfiguration } = await getUserById(system.associatedUserId);
 184 | ||   
 185 | ||       writeBack({
 186 | ||         type: "system",
 187 | ||         id: "@me",
 188 | ||         change: operation,
 189 | ||         syncConfig: syncConfiguration,
 190 | ||       });
 191 | |-->   })();
     : `----- This unhandled promise-like value has type `Promise<void>`.
 192 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/system-operation.ts:185:5]
 184 |      
 185 | ,-->     writeBack({
 186 | ||         type: "system",
 187 | ||         id: "@me",
 188 | ||         change: operation,
 189 | ||         syncConfig: syncConfiguration,
 190 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 191 |        })();
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/plugins/opentelemetry.ts:10:1]
  9 | export const exporter = new PrometheusExporter(options);
 10 | exporter.stopServer();
    : ^^^^^^^^^^|^^^^^^^^^^^
    :           `-- This unhandled promise-like value has type `Promise<void>`.
 11 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/api.ts:55:7]
 54 |         return json(
 55 | ,->       await (
    : |         ^^^^^
 56 | |           (client.cache as unknown as { statistic: BaseResource })
 57 | |             .statistic as unknown as StatisticResource
 58 | |->       ).get("latest"),
    : `---- This expression is not Promise-like
 59 |         );
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/lib/lang.ts:12:40]
 11 |   try {
 12 |     let data = langMemoryCache[id] ?? (await client.cache.i18n.get(id))?.l;
    :                                        ^^^^^ ^^^^^^^^^^^^|^^^^^^^^^^^^
    :                                          |               `-- This expression is not Promise-like
 13 | 
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
   ,-[src/lib/autoproxy-util.ts:8:23]
 7 |   system: PSystem,
 8 |   serverId?: string | undefined,
   :                       ^^^^^^^^^
 9 |   channelId?: string | undefined,
   `----

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
    ,-[src/lib/autoproxy-util.ts:9:24]
  8 |   serverId?: string | undefined,
  9 |   channelId?: string | undefined,
    :                        ^^^^^^^^^
 10 | ) => {
    `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/create-error.ts:38:3]
 37 |   );
 38 |   client.cache.pguild.remove(guildId);
    :   ^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^
    :                    `-- This unhandled promise-like value has type `Awaitable<void>`.
 39 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/create-error.ts:40:3]
 39 |      
 40 | ,-->   (async () => {
 41 | ||       const guild = await getGuildFromId(guildId);
 42 | ||   
 43 | ||       if (guild.logChannel)
 44 | ||         await client.messages
 45 | ||           .write(guild.logChannel, {
 46 | ||             components: [
 47 | ||               new TextDisplay().setContent(`\`${opts.type}\``),
 48 | ||               new Container()
 49 | ||                 .setComponents(
 50 | ||                   new Section()
 51 | ||                     .setComponents(
 52 | ||                       new TextDisplay().setContent(
 53 | ||                         `**${opts.title}**
 54 | ||   > ${opts.description}`,
 55 | ||                       ),
 56 | ||                     )
 57 | ||                     .setAccessory(new Thumbnail().setMedia("https://pluralbuddy.app/image/pfp.png")),
 58 | ||                   new Separator().setSpacing(Spacing.Large),
 59 | ||                   new TextDisplay()
 60 | ||                     .setContent(`-# PluralBuddy ran into an issue while doing an action on this server.
 61 | ||   ${opts.responsibleChannelId ? `-# In <#${opts.responsibleChannelId}>` : `${opts.responsibleUserId ? `-# By <@${opts.responsibleUserId}>` : ""}`}${opts.responsibleChannelId && opts.responsibleUserId ? `\n-# By <@${opts.responsibleUserId}>` : ""}
 62 | ||   -# View more details in ${mentionCommand("pb;", "server-config errors", true)}`),
 63 | ||                 )
 64 | ||                 .setColor("Red"),
 65 | ||             ],
 66 | ||             flags: MessageFlags.IsComponentsV2,
 67 | ||             allowed_mentions: { parse: [] },
 68 | ||           })
 69 | ||           .catch(() => null);
 70 | |-->   })();
    : `----- This unhandled promise-like value has type `Promise<void>`.
 71 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/error.ts:41:3]
 40 |   });
 41 |   message.react(emojis.x);
    :   ^^^^^^^^^^^|^^^^^^^^^^^^
    :              `-- This unhandled promise-like value has type `Promise<void>`.
 42 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/pk-sync-engine.ts:440:5]
 439 |   if (!("proxyTags" in alter)) {
 440 |     client.cache.alterProxy.remove(String(alter.alterId));
     :     ^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                               `-- This unhandled promise-like value has type `Awaitable<void>`.
 441 |     return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/pk-sync-engine.ts:444:3]
 443 |      
 444 | ,-->   client.cache.alterProxy.set(CacheFrom.Rest, String(alter.alterId), {
 445 | ||       pt: JSON.stringify(
 446 | ||         alter.proxyTags.map((c) => ({
 447 | ||           p: c.prefix,
 448 | ||           s: c.suffix,
 449 | ||         })),
 450 | ||       ),
 451 | |-->   });
     : `----- This unhandled promise-like value has type `Awaitable<void>`.
 452 |      }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
    ,-[src/lib/proxying/process-url-attachments.ts:30:79]
 29 |   uploadedEmojis: ApplicationEmoji[],
 30 |   channelReference?: { channelId: string; guildId: string; userId: string } | undefined,
    :                                                                               ^^^^^^^^^
 31 |   altUserId?: string | undefined,
    `----

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
    ,-[src/lib/proxying/process-url-attachments.ts:31:24]
 30 |   channelReference?: { channelId: string; guildId: string; userId: string } | undefined,
 31 |   altUserId?: string | undefined,
    :                        ^^^^^^^^^
 32 |   altGuildId?: string | undefined,
    `----

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
    ,-[src/lib/proxying/process-url-attachments.ts:32:25]
 31 |   altUserId?: string | undefined,
 32 |   altGuildId?: string | undefined,
    :                         ^^^^^^^^^
 33 | ) {
    `----

  ! typescript(no-base-to-string): 'json?.title ?? json?.["og:title"] ?? json?.["twitter:title"] ?? json?.["og:site_name"] ?? ""' will use Object's default stringification format ('[object Object]') when stringified.
     ,-[src/lib/proxying/process-url-attachments.ts:99:41]
  98 |                   new TextDisplay()
  99 |                     .setContent(`### [${json?.title ?? json?.["og:title"] ?? json?.["twitter:title"] ?? json?.["og:site_name"] ?? ""}](${regex})
     :                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 100 | ${json?.description ?? json?.["og:description"] ?? json?.["twitter:description"] ?? ""}`),
     `----
  help: Consider picking a property (e.g. `user.name`), using a formatter (or `JSON.stringify`), or implementing a custom `toString()`/`toLocaleString()` on the type.

  ! typescript(no-base-to-string): 'json?.description ?? json?.["og:description"] ?? json?.["twitter:description"] ?? ""' will use Object's default stringification format ('[object Object]') when stringified.
     ,-[src/lib/proxying/process-url-attachments.ts:100:3]
  99 |                     .setContent(`### [${json?.title ?? json?.["og:title"] ?? json?.["twitter:title"] ?? json?.["og:site_name"] ?? ""}](${regex})
 100 | ${json?.description ?? json?.["og:description"] ?? json?.["twitter:description"] ?? ""}`),
     :   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 101 |                   ...(json?.["og:image"]
     `----
  help: Consider picking a property (e.g. `user.name`), using a formatter (or `JSON.stringify`), or implementing a custom `toString()`/`toLocaleString()` on the type.

  ! typescript(restrict-template-expressions): Invalid type used in template literal expression.
     ,-[src/lib/proxying/process-url-attachments.ts:99:41]
  98 |                   new TextDisplay()
  99 |                     .setContent(`### [${json?.title ?? json?.["og:title"] ?? json?.["twitter:title"] ?? json?.["og:site_name"] ?? ""}](${regex})
     :                                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                                                                       `-- Type: {}
 100 | ${json?.description ?? json?.["og:description"] ?? json?.["twitter:description"] ?? ""}`),
     `----

  ! typescript(restrict-template-expressions): Invalid type used in template literal expression.
     ,-[src/lib/proxying/process-url-attachments.ts:100:3]
  99 |                     .setContent(`### [${json?.title ?? json?.["og:title"] ?? json?.["twitter:title"] ?? json?.["og:site_name"] ?? ""}](${regex})
 100 | ${json?.description ?? json?.["og:description"] ?? json?.["twitter:description"] ?? ""}`),
     :   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                             `-- Type: {}
 101 |                   ...(json?.["og:image"]
     `----

  ! typescript(no-base-to-string): 'json?.["og:site_name"]' may use Object's default stringification format ('[object Object]') when stringified.
     ,-[src/lib/proxying/process-url-attachments.ts:114:37]
 113 |                           json?.["og:site_name"] !== undefined
 114 |                             ? `-# ${json?.["og:site_name"]}`
     :                                     ^^^^^^^^^^^^^^^^^^^^^^
 115 |                             : "",
     `----
  help: Consider picking a property (e.g. `user.name`), using a formatter (or `JSON.stringify`), or implementing a custom `toString()`/`toLocaleString()` on the type.

  ! typescript(restrict-template-expressions): Invalid type used in template literal expression.
     ,-[src/lib/proxying/process-url-attachments.ts:114:37]
 113 |                           json?.["og:site_name"] !== undefined
 114 |                             ? `-# ${json?.["og:site_name"]}`
     :                                     ^^^^^^^^^^^|^^^^^^^^^^^
     :                                                `-- Type: {} | null
 115 |                             : "",
     `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/types/alter-ap.ts:35:3]
 34 |      ) {
 35 | ,-->   (async () => {
 36 | ||       const channel = await message.channel();
 37 | ||   
 38 | ||       if (
 39 | ||         channel.isTextable() &&
 40 | ||         !guild.getFeatures().disabledProxyTyping &&
 41 | ||         user.system !== undefined &&
 42 | ||         !getSystemFeatures(user.system).noTypingStatus
 43 | ||       ) {
 44 | ||         channel.typing().catch(() => null);
 45 | ||       }
 46 | |-->   })();
    : `----- This unhandled promise-like value has type `Promise<void>`.
 47 |        alterCollection.updateOne(
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/api.ts:117:7]
 116 |      
 117 | ,-->       client.interactions
 118 | ||           .editOriginal(importStage.webhook.token, {
 119 | ||             components: new LoadingView(translations).loadingViewLongTerm(),
 120 | ||             flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
 121 | ||           })
 122 | ||           .then(async (message) => {
 123 | ||             console.log(message);
 124 | ||             if (importStage.response === null) return;
 125 | ||   
 126 | ||             const system = await userCollection.findOne({
 127 | ||               userId: importStage.originatingSystemId,
 128 | ||             });
 129 | ||             const alters = await alterCollection.find({ systemId: system?.userId }).toArray();
 130 | ||             const tags = await tagCollection.find({ systemId: system?.userId }).toArray();
 131 | ||             let response = null;
 132 | ||   
 133 | ||             response = await importControllers[importStage.response.dataType]
 134 | ||               [
 135 | ||                 importStage.importMode.replace("full-mode", "both").replace("delete", "deleteM") as
 136 | ||                   | "both"
 137 | ||                   | "add"
 138 | ||                   | "replace"
 139 | ||                   | "deleteM"
 140 | ||               ]({
 141 | ||                 existing: {
 142 | ||                   alters,
 143 | ||                   tags,
 144 | ||                   userId: importStage.originatingSystemId,
 145 | ||                 },
 146 | ||                 import: JSON.parse(importStage.response?.data ?? ""),
 147 | ||               })
 148 | ||               .catch((e) => console.error(e));
 149 | ||   
 150 | ||             client.interactions.editOriginal(importStage.webhook.token, {
 151 | ||               components: new AlertView(translations).successViewCustom(
 152 | ||                 translations.SYSTEM_ADVANCED_IMPORT.replace(
 153 | ||                   "{{ alter-count }}",
 154 | ||                   String(response?.affected.alters ?? 0),
 155 | ||                 ).replace("{{ tag-count }}", String(response?.affected.tags ?? 0)),
 156 | ||               ),
 157 | ||               flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
 158 | ||             });
 159 | |-->         });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 160 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/util.ts:49:5]
 48 | 
 49 |     client.cache.similarWebhookResource.set(CacheFrom.Gateway, channelId, result);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 50 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/types/tag-proxying.ts:52:3]
 51 |      ) {
 52 | ,-->   (async () => {
 53 | ||       const channel = await message.channel();
 54 | ||   
 55 | ||       if (
 56 | ||         channel.isTextable() &&
 57 | ||         !guild.getFeatures().disabledProxyTyping &&
 58 | ||         user.system !== undefined &&
 59 | ||         !getSystemFeatures(user.system).noTypingStatus
 60 | ||       )
 61 | ||         channel.typing().catch(() => null);
 62 | |-->   })();
    : `----- This unhandled promise-like value has type `Promise<void>`.
 63 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/types/tag-proxying.ts:64:3]
 63 |      
 64 | ,-->   alterCollection.updateOne(
 65 | ||       { alterId: checkAlter?.alterId, systemId: checkAlter?.systemId },
 66 | ||       {
 67 | ||         $inc: { messageCount: 1 },
 68 | ||         $set: { lastMessageTimestamp: new Date() },
 69 | ||       },
 70 | |-->   );
    : `----- This unhandled promise-like value has type `Promise<UpdateResult<{ alterId: number; systemId: string; username: string; displayName: string; nameMap: { server: string; name: string; }[]; color: string | null; description: string | null; created: Date; ... 12 more ...; fields: Record<...>; }>>`.
 71 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:96:7]
  95 |          if (checkAlter?.alterMode === "nickname" && guild.getFeatures().forcedWebhookMode) {
  96 | ,-->       createProxyError(user, message, {
  97 | ||           title: "Server requires Webhook Proxy Mode",
  98 | ||           description:
  99 | ||             "You cannot proxy with an alter that is on `nickname` mode, as this server requires the use of the Webhook Proxy Mode.",
 100 | ||           type: "EnforcedProxyModeRegulation",
 101 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 102 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:107:7]
 106 |          if (checkAlter?.alterMode === "nickname" && !sendingUserPerms.has(["ChangeNickname"])) {
 107 | ,-->       createProxyError(user, message, {
 108 | ||           title: "User Cannot Change Nickname",
 109 | ||           description:
 110 | ||             "You cannot proxy with an alter that is on `nickname` mode, when you do not have the Change Nickname (`CHANGE_NICKNAME`) permission yourself.",
 111 | ||           type: "UserPermissionsRequired",
 112 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 113 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:121:7]
 120 |          ) {
 121 | ,-->       createProxyError(user, message, {
 122 | ||           title: "Bot Cannot Change Nickname",
 123 | ||           description:
 124 | ||             "You cannot proxy with an alter that is on `nickname` mode, when the bot does not have the Manage Nicknames (`MANAGE_NICKNAMES`) permission. Please contact a server administrator if you believe this is incorrect.",
 125 | ||           type: "BotPermissionsRequired",
 126 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 127 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:133:5]
 132 |      
 133 | ,-->     message.member?.edit({
 134 | ||         nick: systemFormat
 135 | ||           .replace("%username%", checkAlter.username)
 136 | ||           .replace("%display%", checkAlter.displayName)
 137 | ||           .substring(0, 31),
 138 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<GuildMember> | undefined`.
 139 |        }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:154:9]
 153 |            if (webhook === null) {
 154 | ,-->         createError(guild.guildId ?? "", {
 155 | ||             title: `Error while creating webhook for <#${channel.id}>`,
 156 | ||             description: `There was an error while creating the corresponding webhook for <#${channel.id}>. Check if PluralBuddy has the correct permissions in that channel.`,
 157 | ||             type: "WebhookFailedCreation",
 158 | ||             responsibleUserId: user.userId,
 159 | ||             responsibleChannelId: channel.id,
 160 | |-->         });
     : `----- This unhandled promise-like value has type `Promise<{ title: string; description: string; type: "BotPermissionsRequired" | "EnforcedGuildTagRegulation" | "EnforcedProxyModeRegulation" | "FailedLogging" | "FailedMessageReaction" | "UserPermissionsRequired" | "WebhookFailedCreation"; responsibleUserId?: string | undefined; responsibleChannelId?: string | undefi...`.
 161 |              return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:163:7]
 162 |       }
 163 |       client.cache.similarWebhookResource.set(CacheFrom.Gateway, message.channelId, [webhook]);
     :       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                                   `-- This unhandled promise-like value has type `Awaitable<void>`.
 164 |     }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:176:7]
 175 |          if (checkAlter?.alterMode === "webhook" && guild.getFeatures().forcedNicknameMode) {
 176 | ,-->       createProxyError(user, message, {
 177 | ||           title: "Server requires Nickname Proxy Mode",
 178 | ||           description:
 179 | ||             "You cannot proxy with an alter that is on `webhook` mode, as this server requires the use of the Nickname Proxy Mode.",
 180 | ||           type: "EnforcedProxyModeRegulation",
 181 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 182 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:187:7]
 186 |          if (!userPerms.has(["ManageWebhooks", "ManageMessages"])) {
 187 | ,-->       createProxyError(user, message, {
 188 | ||           title: "Bot Cannot Efffectively Proxy",
 189 | ||           description:
 190 | ||             "This bot needs Manage Webhooks (`MANAGE_WEBHOOKS`) and (`MANAGE_MESSAGES`) to work properly. Please ask for an administrator to grant those permissions.",
 191 | ||           type: "BotPermissionsRequired",
 192 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 193 |            return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/index.ts:240:11]
 239 |                });
 240 | ,-->           messagesCollection.insertOne({
 241 | ||               messageId: sentMessage?.id ?? "0",
 242 | ||               alterId,
 243 | ||               systemId,
 244 | ||               createdAt: new Date(),
 245 | ||               guildId: message.guildId,
 246 | ||               channelId: message.channelId,
 247 | ||               referencedMessage: message.referencedMessage?.id,
 248 | |-->           });
     : `----- This unhandled promise-like value has type `Promise<InsertOneResult<{ messageId: string; systemId: string; alterId: number; createdAt: Date; guildId?: string | undefined; channelId: string; referencedMessage?: string | undefined; expressUserId?: string | undefined; }>>`.
 249 |                try {
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/index.ts:250:13]
 249 |                try {
 250 | ,-->             (async () => {
 251 | ||                 const guild = await getGuildFromId(message.guildId ?? "");
 252 | ||                 const user = await client.users.fetch(message.author.id);
 253 | ||                 const alter = await alterCollection.findOne({
 254 | ||                   alterId,
 255 | ||                   systemId,
 256 | ||                 });
 257 | ||                 let color = "Green";
 258 | ||   
 259 | ||                 if (!guild.logChannel) return;
 260 | ||   
 261 | ||                 try {
 262 | ||                   const image = await (
 263 | ||                     await fetch(
 264 | ||                       `https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
 265 | ||                       { signal: AbortSignal.timeout(3000) },
 266 | ||                     )
 267 | ||                   ).arrayBuffer();
 268 | ||   
 269 | ||                   color = (await getColor(image))?.hex() ?? "Green";
 270 | ||                 } catch (_) {}
 271 | ||   
 272 | ||                 await client.messages
 273 | ||                   .write(guild.logChannel, {
 274 | ||                     components: [
 275 | ||                       new TextDisplay().setContent(
 276 | ||                         `https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${sentMessage?.id}`,
 277 | ||                       ),
 278 | ||                       new Container()
 279 | ||                         .setComponents(
 280 | ||                           new Section()
 281 | ||                             .setComponents(
 282 | ||                               new TextDisplay().setContent(
 283 | ||                                 stringContents === ""
 284 | ||                                   ? "Cannot render message as string - use link above."
 285 | ||                                   : stringContents,
 286 | ||                               ),
 287 | ||                             )
 288 | ||                             .setAccessory(
 289 | ||                               new Thumbnail().setMedia(
 290 | ||                                 (alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ??
 291 | ||                                   alter?.avatarUrl ??
 292 | ||                                   "https://cdn.discordapp.com/embed/avatars/0.png",
 293 | ||                               ),
 294 | ||                             ),
 295 | ||                           new Separator().setSpacing(Spacing.Large),
 296 | ||                           new TextDisplay()
 297 | ||                             .setContent(`-# Sent by system/user \`${systemId}\`, by alter \`${alterId}\`
 298 | ||   -# Mention: @${user.username} (<@${systemId}>)
 299 | ||   -# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})${
 300 | ||                             message.messageReference !== undefined
 301 | ||                               ? `
 302 | ||   -# Reply: https://discord.com/channels/${message.messageReference.guildId ?? "@me"}/${message.messageReference.channelId}/${message.messageReference.messageId}`
 303 | ||                               : ""
 304 | ||                           }
 305 | ||   -# Proxied message as: \`${message.id}\` → \`${sentMessage?.id ?? "Unknown"}\`
 306 | ||   -# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
 307 | ||                           ...(message.referencedMessage
 308 | ||                             ? [
 309 | ||                                 new Separator(),
 310 | ||                                 new TextDisplay().setContent("-# **REFERENCED MESSAGE**"),
 311 | ||                                 new TextDisplay()
 312 | ||                                   .setContent(`-# Message author: <@${message.referencedMessage.author.id}>
 313 | ||   -# Message ID: [${message.referencedMessage.id}](https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${message.referencedMessage.id})
 314 | ||   -# Message contents: ${message.referencedMessage.content.slice(0, 1000)}`),
 315 | ||                               ]
 316 | ||                             : []),
 317 | ||                         )
 318 | ||                         .setColor(color as `#${string}` | "Green"),
 319 | ||                     ],
 320 | ||                     flags: MessageFlags.IsComponentsV2,
 321 | ||                     allowed_mentions: { parse: [] },
 322 | ||                   })
 323 | ||                   .catch(() =>
 324 | ||                     createError(guild.guildId, {
 325 | ||                       title: "Failed to send proxy log in log channel.",
 326 | ||                       description:
 327 | ||                         "PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
 328 | ||                       responsibleChannelId: guild.logChannel ?? undefined,
 329 | ||                       type: "FailedLogging",
 330 | ||                     }),
 331 | ||                   );
 332 | |-->             })();
     : `----- This unhandled promise-like value has type `Promise<void>`.
 333 |                } catch (_: unknown) {
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/index.ts:334:13]
 333 |                } catch (_: unknown) {
 334 | ,-->             createError(guild.guildId, {
 335 | ||                 title: "Failed to send proxy log in log channel.",
 336 | ||                 description:
 337 | ||                   "PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
 338 | ||                 responsibleChannelId: guild.logChannel ?? undefined,
 339 | ||                 type: "FailedLogging",
 340 | |-->             });
     : `----- This unhandled promise-like value has type `Promise<{ title: string; description: string; type: "BotPermissionsRequired" | "EnforcedGuildTagRegulation" | "EnforcedProxyModeRegulation" | "FailedLogging" | "FailedMessageReaction" | "UserPermissionsRequired" | "WebhookFailedCreation"; responsibleUserId?: string | undefined; responsibleChannelId?: string | undefi...`.
 341 |                }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/api.ts:150:11]
 149 |      
 150 | ,-->           client.interactions.editOriginal(importStage.webhook.token, {
 151 | ||               components: new AlertView(translations).successViewCustom(
 152 | ||                 translations.SYSTEM_ADVANCED_IMPORT.replace(
 153 | ||                   "{{ alter-count }}",
 154 | ||                   String(response?.affected.alters ?? 0),
 155 | ||                 ).replace("{{ tag-count }}", String(response?.affected.tags ?? 0)),
 156 | ||               ),
 157 | ||               flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
 158 | |-->           });
     : `----- This unhandled promise-like value has type `Promise<WebhookMessage>`.
 159 |              });
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/index.ts:357:15]
 356 |             for (const emoji of uploadedEmojis) {
 357 |               emoji.delete();
     :               ^^^^^^^|^^^^^^^
     :                      `-- This unhandled promise-like value has type `Promise<void>`.
 358 |             }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/index.ts:363:11]
 362 | 
 363 |           client.cache.similarWebhookResource.remove(message.channelId);
     :           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                         `-- This unhandled promise-like value has type `Awaitable<void>`.
 364 |         });
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/types/alter-ap.ts:47:3]
 46 |        })();
 47 | ,-->   alterCollection.updateOne(
 48 | ||       { alterId: alter?.alterId, systemId: alter?.systemId },
 49 | ||       {
 50 | ||         $inc: { messageCount: 1 },
 51 | ||         $set: { lastMessageTimestamp: new Date() },
 52 | ||       },
 53 | |-->   );
    : `----- This unhandled promise-like value has type `Promise<UpdateResult<{ alterId: number; systemId: string; username: string; displayName: string; nameMap: { server: string; name: string; }[]; color: string | null; description: string | null; created: Date; ... 12 more ...; fields: Record<...>; }>>`.
 54 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/index.ts:368:7]
 367 | 
 368 |       client.cache.similarWebhookResource.remove(message.channelId);
     :       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                     `-- This unhandled promise-like value has type `Awaitable<void>`.
 369 |     }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/types/alter-ap.ts:79:7]
 78 |          if (alter?.alterMode === "nickname" && guild.getFeatures().forcedWebhookMode) {
 79 | ,-->       createProxyError(user, message, {
 80 | ||           title: "Server requires Webhook Proxy Mode",
 81 | ||           description:
 82 | ||             "You cannot proxy with an alter that is on `nickname` mode, as this server requires the use of the Webhook Proxy Mode.",
 83 | ||           type: "EnforcedProxyModeRegulation",
 84 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 85 |          }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/proxying/types/alter-ap.ts:90:7]
 89 |          if (alter?.alterMode === "nickname" && !sendingUserPerms.has(["ChangeNickname"])) {
 90 | ,-->       createProxyError(user, message, {
 91 | ||           title: "User Cannot Change Nickname",
 92 | ||           description:
 93 | ||             "You cannot proxy with an alter that is on `nickname` mode, when you do not have the Change Nickname (`CHANGE_NICKNAME`) permission yourself.",
 94 | ||           type: "UserPermissionsRequired",
 95 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 96 |          }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:104:7]
 103 |          ) {
 104 | ,-->       createProxyError(user, message, {
 105 | ||           title: "Bot Cannot Change Nickname",
 106 | ||           description:
 107 | ||             "You cannot proxy with an alter that is on `nickname` mode, when the bot does not have the Manage Nicknames (`MANAGE_NICKNAMES`) permission. Please contact a server administrator if you believe this is incorrect.",
 108 | ||           type: "BotPermissionsRequired",
 109 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 110 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:301:7]
 300 |          if (message.guildId && user.system)
 301 | ,-->       proxy(
 302 | ||           webhook,
 303 | ||           client,
 304 | ||           message,
 305 | ||           processedContents,
 306 | ||           getDisplayNameWebhook(checkAlter, message, user),
 307 | ||           checkAlter?.alterId as number,
 308 | ||           checkAlter?.systemId as string,
 309 | ||           [...referencedMessage],
 310 | ||           messageComponents,
 311 | ||           uploadedEmojis,
 312 | ||           guild,
 313 | ||           (checkAlter?.avatarUrlMap ?? {})[message.guildId] ?? checkAlter?.avatarUrl ?? undefined,
 314 | |-->       );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 315 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:116:5]
 115 |      
 116 | ,-->     message.member?.edit({
 117 | ||         nick: systemFormat
 118 | ||           .replace("%username%", alter.username)
 119 | ||           .replace("%display%", alter.displayName)
 120 | ||           .substring(0, 31),
 121 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<GuildMember> | undefined`.
 122 |        }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/tag-proxying.ts:317:7]
 316 |     if (message.guildId && user.system)
 317 |       setLastLatchAlter(message.guildId, message.channelId, user.system, checkAlter);
     :       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                              `-- This unhandled promise-like value has type `Promise<void>`.
 318 |   }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:137:9]
 136 |            if (webhook === null) {
 137 | ,-->         createError(guild.guildId ?? "", {
 138 | ||             title: `Error while creating webhook for <#${channel.id}>`,
 139 | ||             description: `There was an error while creating the corresponding webhook for <#${channel.id}>. Check if PluralBuddy has the correct permissions in that channel.`,
 140 | ||             type: "WebhookFailedCreation",
 141 | ||             responsibleUserId: user.userId,
 142 | ||             responsibleChannelId: channel.id,
 143 | |-->         });
     : `----- This unhandled promise-like value has type `Promise<{ title: string; description: string; type: "BotPermissionsRequired" | "EnforcedGuildTagRegulation" | "EnforcedProxyModeRegulation" | "FailedLogging" | "FailedMessageReaction" | "UserPermissionsRequired" | "WebhookFailedCreation"; responsibleUserId?: string | undefined; responsibleChannelId?: string | undefi...`.
 144 |              return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/events/on-message-create.ts:89:5]
 88 |     );
 89 |     handleDMReply(message);
    :     ^^^^^^^^^^^|^^^^^^^^^^^
    :                `-- This unhandled promise-like value has type `Promise<void>`.
 90 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:146:7]
 145 |       }
 146 |       client.cache.similarWebhookResource.set(CacheFrom.Gateway, message.channelId, [webhook]);
     :       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                                   `-- This unhandled promise-like value has type `Awaitable<void>`.
 147 |     }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/api.ts:186:7]
 185 |      
 186 | ,-->       createSystemOperation(
 187 | ||           { ...oldSystem, subAccounts: [], systemAutoproxy: [] },
 188 | ||           changedOperation,
 189 | ||           translations,
 190 | ||           method === "exchange" ? "api-exchange" : "api-web",
 191 | |-->       );
     : `----- This unhandled promise-like value has type `Promise<{ associatedUserId: string; systemName: string; systemDisplayTag?: string | null | undefined; displayTagMap: Record<string, string>; systemDescription?: string | undefined; ... 14 more ...; disabled: boolean; } | undefined>`.
 192 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:159:7]
 158 |          if (alter?.alterMode === "webhook" && guild.getFeatures().forcedNicknameMode) {
 159 | ,-->       createProxyError(user, message, {
 160 | ||           title: "Server requires Nickname Proxy Mode",
 161 | ||           description:
 162 | ||             "You cannot proxy with an alter that is on `webhook` mode, as this server requires the use of the Nickname Proxy Mode.",
 163 | ||           type: "EnforcedProxyModeRegulation",
 164 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 165 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:170:7]
 169 |          if (!userPerms.has(["ManageWebhooks", "ManageMessages"])) {
 170 | ,-->       createProxyError(user, message, {
 171 | ||           title: "Bot Cannot Efffectively Proxy",
 172 | ||           description:
 173 | ||             "This bot needs Manage Webhooks (`MANAGE_WEBHOOKS`) and (`MANAGE_MESSAGES`) to work properly. Please ask for an administrator to grant those permissions.",
 174 | ||           type: "BotPermissionsRequired",
 175 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 176 |            return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:174:7]
 173 |          if (await isValidDm(message)) {
 174 | ,-->       message.reply({
 175 | ||           components: [
 176 | ||             // @ts-expect-error
 177 | ||             ...new AlertView(locale).errorView("NO_DM_CHANNELS"),
 178 | ||           ],
 179 | ||           flags: MessageFlags.IsComponentsV2,
 180 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<Message>`.
 181 |            return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/events/on-message-create.ts:196:8]
 195 |     const guild = PGuildObject.parse(
 196 |       (await client.cache.pguild.get(message.guildId ?? ""))?.g ??
     :        ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^
     :          |                          `-- This expression is not Promise-like
 197 |         (await getGuildFromId(message.guildId ?? "")),
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:248:11]
 247 |                endTimer(`proxy: bruteforce proxy (${message.id})`);
 248 | ,-->           createProxyError(user, message, {
 249 | ||               title: locale.DISPLAY_TAG_ENFORCE,
 250 | ||               description: locale.DISPLAY_TAG_ENFORCE_DESC,
 251 | ||               type: "EnforcedGuildTagRegulation",
 252 | ||               setSystemTag: locale.ALTER_SET_TAG,
 253 | |-->           });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 254 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/types/alter-ap.ts:245:7]
 244 |          if (message.guildId && user.system)
 245 | ,-->       proxy(
 246 | ||           webhook,
 247 | ||           client,
 248 | ||           message,
 249 | ||           processedContents,
 250 | ||           getDisplayNameWebhook(alter, message, user),
 251 | ||           alter?.alterId as number,
 252 | ||           alter?.systemId as string,
 253 | ||           [...referencedMessage],
 254 | ||           messageComponents,
 255 | ||           uploadedEmojis,
 256 | ||           guild,
 257 | ||           (alter.avatarUrlMap ?? {})[message.guildId] ?? alter?.avatarUrl ?? undefined,
 258 | |-->       );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 259 |        }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/cache/similar-webhooks.ts:47:20]
 46 |   async fetch(id: string) {
 47 |     const result = await super.get(id);
    :                    ^^^^^ ^^^^^^|^^^^^^
    :                      |         `-- This expression is not Promise-like
 48 | 
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:266:11]
 265 |      
 266 | ,-->           performAlterAutoProxy(
 267 | ||               message,
 268 | ||               similarWebhooks,
 269 | ||               fetchedAlter,
 270 | ||               user,
 271 | ||               guild,
 272 | ||               message.member,
 273 | |-->           );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 274 |                return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-redundant-type-constituents): 'unknown' overrides all other types in this union type.
    ,-[src/error-command-impl.ts:19:49]
 18 |   onBeforeMiddlewares?(context: ComponentContext): any;
 19 |   onAfterRun?(context: ComponentContext, error: unknown | undefined): any;
    :                                                 ^^^^^^^
 20 |   onRunError?(context: ComponentContext, error: unknown): any;
    `----

  ! typescript(no-redundant-type-constituents): 'unknown' overrides all other types in this union type.
    ,-[src/error-command-impl.ts:45:45]
 44 |   onBeforeMiddlewares?(context: ModalContext): any;
 45 |   onAfterRun?(context: ModalContext, error: unknown | undefined): any;
    :                                             ^^^^^^^
 46 |   onRunError?(context: ModalContext, error: unknown): any;
    `----

  ! typescript(restrict-template-expressions): Invalid type used in template literal expression.
    ,-[src/error-command.ts:33:39]
 32 |       .filter((_) => _[1].failed)
 33 |       .map((error) => `${error[0]}: ${error[1].value}`)
    :                                       ^^^^^^^|^^^^^^^
    :                                              `-- Type: unknown
 34 |       .join("\n");
    `----

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/events/on-message-create.ts:332:29]
 331 |         const alterIdStr = user.system.alterIds[i]?.toString() ?? "";
 332 |         const proxyObject = await message.client.cache.alterProxy.get(alterIdStr);
     :                             ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
     :                               |                          `-- This expression is not Promise-like
 333 | 
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(unbound-method): Avoid referencing unbound methods which may cause unintentional scoping of `this`.
    ,-[src/extended-context.ts:61:20]
 60 |           afterSendTask({
 61 |             reply: writtenMessage?.write,
    :                    ^^^^^^^^^^^^^^^^^^^^^|
    :                              |          `-- This reference may be unbound and lose `this` context
 62 |             editMessage: interaction.editResponse,
    `----
  help: If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.

  ! typescript(no-redundant-type-constituents): 'unknown' overrides all other types in this union type.
     ,-[src/error-command.ts:161:63]
 160 | export class PluralBuddyComponentErrorCommand extends PluralBuddyErrorComponentCommandImpl {
 161 |   override async onAfterRun(context: ComponentContext, error: unknown | undefined) {
     :                                                               ^^^^^^^
 162 |     if (error) {
     `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:428:15]
 427 |                    endTimer(`proxy: bruteforce proxy (${message.id})`);
 428 | ,-->               createProxyError(user, message, {
 429 | ||                   title: locale.DISPLAY_TAG_ENFORCE,
 430 | ||                   description: locale.DISPLAY_TAG_ENFORCE_DESC,
 431 | ||                   type: "EnforcedGuildTagRegulation",
 432 | ||                   setSystemTag: locale.ALTER_SET_TAG,
 433 | |-->               });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 434 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:458:13]
 457 |                  removeFromMap();
 458 | ,-->             performTagProxy(
 459 | ||                 checkAlter as PAlter,
 460 | ||                 user,
 461 | ||                 similarWebhooks,
 462 | ||                 proxyTag,
 463 | ||                 message,
 464 | ||                 guild,
 465 | ||                 message.member,
 466 | |-->             );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 467 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:480:9]
 479 |       if (message.content.startsWith("\\\\")) {
 480 |         setLastLatchAlter(guild.guildId, message.channelId, user.system);
     :         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                         `-- This unhandled promise-like value has type `Promise<void>`.
 481 |         return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-redundant-type-constituents): 'unknown' overrides all other types in this union type.
     ,-[src/error-command.ts:224:59]
 223 | export class PluralBuddyModalErrorCommand extends PluralBuddyErrorModalCommandImpl {
 224 |   override async onAfterRun(context: ModalContext, error: unknown | undefined) {
     :                                                           ^^^^^^^
 225 |     if (error) {
     `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:492:11]
 491 |         ) {
 492 |           setLastLatchAlter(guild.guildId, message.channelId, user.system);
     :           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                           `-- This unhandled promise-like value has type `Promise<void>`.
 493 |           return;
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:514:11]
 513 |                endTimer(`proxy: bruteforce proxy (${message.id})`);
 514 | ,-->           createProxyError(user, message, {
 515 | ||               title: locale.DISPLAY_TAG_ENFORCE,
 516 | ||               description: locale.DISPLAY_TAG_ENFORCE_DESC,
 517 | ||               type: "EnforcedGuildTagRegulation",
 518 | ||               setSystemTag: locale.ALTER_SET_TAG,
 519 | |-->           });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 520 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-create.ts:530:11]
 529 |                endTimer(`proxy: latch proxy (${message.id})`);
 530 | ,-->           performAlterAutoProxy(
 531 | ||               message,
 532 | ||               similarWebhooks,
 533 | ||               fetchedAlter,
 534 | ||               user,
 535 | ||               guild,
 536 | ||               message.member,
 537 | |-->           );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 538 |              }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/clean-up-emojis.ts:11:3]
 10 | export function startEmojiCleanupTimer() {
 11 |   cleanUpCustomEmojis();
    :   ^^^^^^^^^^|^^^^^^^^^^^
    :             `-- This unhandled promise-like value has type `Promise<void>`.
 12 |   setInterval(
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/clean-up-emojis.ts:14:7]
 13 |     async () => {
 14 |       cleanUpCustomEmojis();
    :       ^^^^^^^^^^|^^^^^^^^^^^
    :                 `-- This unhandled promise-like value has type `Promise<void>`.
 15 |     },
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(unbound-method): Avoid referencing unbound methods which may cause unintentional scoping of `this`.
     ,-[src/extended-context.ts:120:24]
 119 |               afterSendTask({
 120 |                 reply: interaction.message?.reply,
     :                        ^^^^^^^^^^^^^^^^^^^^^^^^^^|
     :                                     |            `-- This reference may be unbound and lose `this` context
 121 |                 editMessage: (body: InteractionCreateBodyRequest) =>
     `----
  help: If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.

  ! typescript(unbound-method): Avoid referencing unbound methods which may cause unintentional scoping of `this`.
     ,-[src/extended-context.ts:145:22]
 144 |             afterSendTask({
 145 |               reply: interaction.message?.reply,
     :                      ^^^^^^^^^^^^^^^^^^^^^^^^^^|
     :                                   |            `-- This reference may be unbound and lose `this` context
 146 |               editMessage: (body: InteractionCreateBodyRequest) => i.editMessage("@original", body),
     `----
  help: If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/extended-context.ts:172:10]
 171 |         langMemoryCache[interaction.user.id] ??
 172 |         (await client.cache.i18n.get(interaction.user.id))?.l;
     :          ^^^^^ ^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^
     :            |                        `-- This expression is not Promise-like
 173 | 
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/cleanup-indexing.ts:45:5]
 44 |   setInterval(() => {
 45 |     cleanupIndexingMap();
    :     ^^^^^^^^^^|^^^^^^^^^^
    :               `-- This unhandled promise-like value has type `Promise<void>`.
 46 |   }, 4000);
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/lib/middleware-issue.ts:23:3]
 22 |      
 23 | ,-->   ctx.context.ephemeral({
 24 | ||       components: new AlertView(await ctx.context.userTranslations()).errorView(string),
 25 | ||       flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
 26 | |-->   });
    : `----- This unhandled promise-like value has type `Promise<WebhookMessage | undefined>`.
 27 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/extended-context.ts:193:10]
 192 |         terminologyMemoryCache[interaction.user.id] ??
 193 |         (await client.cache.terminology.get(interaction.user.id))?.terms;
     :          ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
     :            |                           `-- This expression is not Promise-like
 194 | 
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/middleware/ensure-guild-permissions.middleware.ts:19:6]
 18 |   const pluralGuild = PGuildObject.parse(
 19 |     (await ctx.client.cache.pguild.get(ctx.guildId ?? ""))?.g ??
    :      ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^
    :        |                          `-- This expression is not Promise-like
 20 |       (await getGuildFromId(ctx.guildId ?? "")),
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/middleware/server-block.middleware.ts:12:6]
 11 |   const { blockedChannels, blockedRoles, blockedCategories } = PGuildObject.parse(
 12 |     (await middle.context.client.cache.pguild.get(middle.context.guildId ?? ""))?.g ??
    :      ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    :        |                                     `-- This expression is not Promise-like
 13 |       (await getGuildFromId(middle.context.guildId ?? "")),
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/analytics.ts:28:15]
 27 |   async collect() {
 28 |     this.set((await client.cache.guilds?.count()) ?? 3);
    :               ^^^^^ ^^^^^^^^^^^^^^|^^^^^^^^^^^^^
    :                 |                 `-- This expression is not Promise-like
 29 |   },
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/analytics.ts:77:18]
 76 |   await client.cache.statistic.set(CacheFrom.Gateway, "latest", {
 77 |     guildCount: (await client.cache.guilds?.count()) ?? 3,
    :                  ^^^^^ ^^^^^^^^^^^^^^|^^^^^^^^^^^^^
    :                    |                 `-- This expression is not Promise-like
 78 |     userCount: 0,
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/analytics.ts:83:3]
 82 |      export function startStatisticalTimer() {
 83 | ,-->   (async () => {
 84 | ||       await gatherStatisticalData();
 85 | |-->   })();
    : `----- This unhandled promise-like value has type `Promise<void>`.
 86 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-redundant-type-constituents): 'any' overrides all other types in this intersection type.
    ,-[src/lib/views/paginate.ts:20:25]
 19 | export default async function paginateComponents<
 20 |   K extends { $?: I } & any,
    :                         ^^^
 21 |   I extends string | undefined,
    `----

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/middleware/server-block.middleware.ts:72:20]
 71 | 
 72 |             return await middle.stop();
    :                    ^^^^^ ^^^^^^|^^^^^^
    :                      |         `-- This expression is not Promise-like
 73 |           }
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/middleware/server-block.middleware.ts:87:16]
 86 |         } catch (_) {}
 87 |         return await middle.stop();
    :                ^^^^^ ^^^^^^|^^^^^^
    :                  |         `-- This expression is not Promise-like
 88 |       }
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/index.ts:203:18]
 202 |   setInterval(async () => {
 203 |     const data = await client.cache.statistic.get("latest");
     :                  ^^^^^ ^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^
     :                    |                     `-- This expression is not Promise-like
 204 | 
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/process-edit.ts:160:5]
 159 |        if (await message.fetch().catch(() => null)) {
 160 | ,-->     webhook.messages
 161 | ||         .edit({
 162 | ||           messageId: messageData.messageId,
 163 | ||           body: {
 164 | ||             ...getModernComponentsMappings(components),
 165 | ||             files: fileAttachments.map((c) =>
 166 | ||               new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name),
 167 | ||             ),
 168 | ||           },
 169 | ||           query: {
 170 | ||             ...(parent ? { thread_id: channel.id } : {}),
 171 | ||           },
 172 | ||         })
 173 | ||         .then((sentMessage) => {
 174 | ||           (async () => {
 175 | ||             if (guild.logChannel) {
 176 | ||               const alter = await alterCollection.findOne({
 177 | ||                 alterId: messageData.alterId,
 178 | ||                 systemId: messageData.systemId,
 179 | ||               });
 180 | ||               let color = "Green";
 181 | ||   
 182 | ||               try {
 183 | ||                 const image = await (
 184 | ||                   await fetch(
 185 | ||                     `https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
 186 | ||                     { signal: AbortSignal.timeout(3000) },
 187 | ||                   )
 188 | ||                 ).arrayBuffer();
 189 | ||   
 190 | ||                 color = (await getColor(image))?.hex() ?? "Green";
 191 | ||               } catch (_) {}
 192 | ||   
 193 | ||               await client.messages
 194 | ||                 .write(guild.logChannel, {
 195 | ||                   components: [
 196 | ||                     new TextDisplay().setContent(
 197 | ||                       `https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${sentMessage?.id}`,
 198 | ||                     ),
 199 | ||                     new Container()
 200 | ||                       .setComponents(
 201 | ||                         new Section()
 202 | ||                           .setComponents(
 203 | ||                             new TextDisplay().setContent(
 204 | ||                               contents === ""
 205 | ||                                 ? "Cannot render message as string - use link above."
 206 | ||                                 : contents,
 207 | ||                             ),
 208 | ||                           )
 209 | ||                           .setAccessory(
 210 | ||                             new Thumbnail().setMedia(
 211 | ||                               (alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ??
 212 | ||                                 alter?.avatarUrl ??
 213 | ||                                 "https://cdn.discordapp.com/embed/avatars/0.png",
 214 | ||                             ),
 215 | ||                           ),
 216 | ||                         new Separator().setSpacing(Spacing.Large),
 217 | ||                         new TextDisplay().setContent(`-# **Sent as an edit.**
 218 | ||   -# Sent by system/user \`${messageData.systemId}\`, by alter \`${messageData.alterId}\`
 219 | ||   -# Mention: @${message.user.username} (<@${messageData.systemId}>)
 220 | ||   -# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})${
 221 | ||                           message.messageReference !== undefined
 222 | ||                             ? `
 223 | ||   -# Reply: https://discord.com/channels/${message.messageReference.guildId ?? "@me"}/${message.messageReference.channelId}/${message.messageReference.messageId}`
 224 | ||                             : ""
 225 | ||                         }
 226 | ||   -# Proxied message as: \`${message.id}\` → \`${sentMessage?.id ?? "Unknown"}\`
 227 | ||   -# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
 228 | ||                         ...(message.referencedMessage
 229 | ||                           ? [
 230 | ||                               new Separator(),
 231 | ||                               new TextDisplay().setContent("-# **REFERENCED MESSAGE**"),
 232 | ||                               new TextDisplay()
 233 | ||                                 .setContent(`-# Message author: <@${message.referencedMessage.author.id}>
 234 | ||   -# Message ID: [${message.referencedMessage.id}](https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${message.referencedMessage.id})
 235 | ||   -# Message contents: ${message.referencedMessage.content.slice(0, 1000)}`),
 236 | ||                             ]
 237 | ||                           : []),
 238 | ||                       )
 239 | ||                       .setColor(color as `#${string}` | "Green"),
 240 | ||                   ],
 241 | ||                   flags: MessageFlags.IsComponentsV2,
 242 | ||                   allowed_mentions: { parse: [] },
 243 | ||                 })
 244 | ||                 .catch(() =>
 245 | ||                   createError(guild.guildId, {
 246 | ||                     title: "Failed to send proxy log in log channel.",
 247 | ||                     description:
 248 | ||                       "PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
 249 | ||                     responsibleChannelId: guild.logChannel ?? undefined,
 250 | ||                     type: "FailedLogging",
 251 | ||                   }),
 252 | ||                 );
 253 | ||             }
 254 | ||           })();
 255 | ||           if (sentMessage?.id) {
 256 | ||             processUrlIntegrations(
 257 | ||               webhook,
 258 | ||               client,
 259 | ||               sentMessage,
 260 | ||               sentMessage.id,
 261 | ||               contents,
 262 | ||               referencedMessage,
 263 | ||               messageComponents,
 264 | ||               fileAttachments,
 265 | ||               uploadedEmojis,
 266 | ||               undefined,
 267 | ||               messageData.systemId,
 268 | ||               messageData.guildId,
 269 | ||             ).catch(console.error);
 270 | ||           } else
 271 | ||             for (const emoji of uploadedEmojis) {
 272 | ||               emoji.delete();
 273 | ||             }
 274 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 275 |        }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/process-edit.ts:174:9]
 173 |            .then((sentMessage) => {
 174 | ,-->         (async () => {
 175 | ||             if (guild.logChannel) {
 176 | ||               const alter = await alterCollection.findOne({
 177 | ||                 alterId: messageData.alterId,
 178 | ||                 systemId: messageData.systemId,
 179 | ||               });
 180 | ||               let color = "Green";
 181 | ||   
 182 | ||               try {
 183 | ||                 const image = await (
 184 | ||                   await fetch(
 185 | ||                     `https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
 186 | ||                     { signal: AbortSignal.timeout(3000) },
 187 | ||                   )
 188 | ||                 ).arrayBuffer();
 189 | ||   
 190 | ||                 color = (await getColor(image))?.hex() ?? "Green";
 191 | ||               } catch (_) {}
 192 | ||   
 193 | ||               await client.messages
 194 | ||                 .write(guild.logChannel, {
 195 | ||                   components: [
 196 | ||                     new TextDisplay().setContent(
 197 | ||                       `https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${sentMessage?.id}`,
 198 | ||                     ),
 199 | ||                     new Container()
 200 | ||                       .setComponents(
 201 | ||                         new Section()
 202 | ||                           .setComponents(
 203 | ||                             new TextDisplay().setContent(
 204 | ||                               contents === ""
 205 | ||                                 ? "Cannot render message as string - use link above."
 206 | ||                                 : contents,
 207 | ||                             ),
 208 | ||                           )
 209 | ||                           .setAccessory(
 210 | ||                             new Thumbnail().setMedia(
 211 | ||                               (alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ??
 212 | ||                                 alter?.avatarUrl ??
 213 | ||                                 "https://cdn.discordapp.com/embed/avatars/0.png",
 214 | ||                             ),
 215 | ||                           ),
 216 | ||                         new Separator().setSpacing(Spacing.Large),
 217 | ||                         new TextDisplay().setContent(`-# **Sent as an edit.**
 218 | ||   -# Sent by system/user \`${messageData.systemId}\`, by alter \`${messageData.alterId}\`
 219 | ||   -# Mention: @${message.user.username} (<@${messageData.systemId}>)
 220 | ||   -# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})${
 221 | ||                           message.messageReference !== undefined
 222 | ||                             ? `
 223 | ||   -# Reply: https://discord.com/channels/${message.messageReference.guildId ?? "@me"}/${message.messageReference.channelId}/${message.messageReference.messageId}`
 224 | ||                             : ""
 225 | ||                         }
 226 | ||   -# Proxied message as: \`${message.id}\` → \`${sentMessage?.id ?? "Unknown"}\`
 227 | ||   -# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
 228 | ||                         ...(message.referencedMessage
 229 | ||                           ? [
 230 | ||                               new Separator(),
 231 | ||                               new TextDisplay().setContent("-# **REFERENCED MESSAGE**"),
 232 | ||                               new TextDisplay()
 233 | ||                                 .setContent(`-# Message author: <@${message.referencedMessage.author.id}>
 234 | ||   -# Message ID: [${message.referencedMessage.id}](https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${message.referencedMessage.id})
 235 | ||   -# Message contents: ${message.referencedMessage.content.slice(0, 1000)}`),
 236 | ||                             ]
 237 | ||                           : []),
 238 | ||                       )
 239 | ||                       .setColor(color as `#${string}` | "Green"),
 240 | ||                   ],
 241 | ||                   flags: MessageFlags.IsComponentsV2,
 242 | ||                   allowed_mentions: { parse: [] },
 243 | ||                 })
 244 | ||                 .catch(() =>
 245 | ||                   createError(guild.guildId, {
 246 | ||                     title: "Failed to send proxy log in log channel.",
 247 | ||                     description:
 248 | ||                       "PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
 249 | ||                     responsibleChannelId: guild.logChannel ?? undefined,
 250 | ||                     type: "FailedLogging",
 251 | ||                   }),
 252 | ||                 );
 253 | ||             }
 254 | |-->         })();
     : `----- This unhandled promise-like value has type `Promise<void>`.
 255 |              if (sentMessage?.id) {
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/delete.ts:84:11]
 83 |      
 84 | ,-->           message.delete(
 85 | ||               `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
 86 | |-->           );
    : `----- This unhandled promise-like value has type `Promise<void>`.
 87 |              }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/edit.ts:109:9]
 108 | 
 109 |         message.delete(`Removed after user request of @${ctx.author.username} (${ctx.author.id})`);
     :         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                                      `-- This unhandled promise-like value has type `Promise<void>`.
 110 |       }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/set-language.ts:105:5]
 104 | 
 105 |     ctx.client.cache.i18n.remove(ctx.author.id);
     :     ^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^
     :                          `-- This unhandled promise-like value has type `Awaitable<void>`.
 106 |     delete langMemoryCache[ctx.author.id];
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/reproxy.ts:182:5]
 181 |          );
 182 | ,-->     webhook.messages
 183 | ||         .write({
 184 | ||           body: {
 185 | ||             ...getModernComponentsMappings(componentList),
 186 | ||             allowed_mentions: { parse: [] },
 187 | ||             files: attachments,
 188 | ||             username: displayName.substring(0, 80),
 189 | ||             avatar_url:
 190 | ||               (alter.avatarUrlMap ?? {})[ctx.guildId ?? ""] ?? alter?.avatarUrl ?? undefined,
 191 | ||           },
 192 | ||           query: {
 193 | ||             wait: true,
 194 | ||             ...(parent === null ? {} : { thread_id: ctx.channelId }),
 195 | ||           },
 196 | ||         })
 197 | ||         .catch((v) => console.error(v))
 198 | ||         .then((sentMessage) => {
 199 | ||           setLastLatchAlter(ctx.guildId ?? "", ctx.channelId ?? "", system, alter);
 200 | ||   
 201 | ||           messagesCollection.replaceOne(
 202 | ||             { messageId: message.messageId },
 203 | ||             {
 204 | ||               messageId: sentMessage?.id ?? "0",
 205 | ||               alterId: alter.alterId,
 206 | ||               systemId,
 207 | ||               createdAt: new Date(),
 208 | ||               channelId: sentMessage?.channelId ?? "0",
 209 | ||               guildId: message.guildId,
 210 | ||             },
 211 | ||           );
 212 | ||   
 213 | ||           (async () => {
 214 | ||             await Promise.all(processedEmojis.map(async (c) => await c.delete()));
 215 | ||   
 216 | ||             await webhook.messages.delete({
 217 | ||               messageId,
 218 | ||               query: parent !== null ? { thread_id: channel.id } : {},
 219 | ||               reason: `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
 220 | ||             });
 221 | ||   
 222 | ||             const guild = await getGuildFromId(ctx.guildId ?? "");
 223 | ||             const user = await client.users.fetch(ctx.author.id);
 224 | ||             const message = originalMessage.components
 225 | ||               .map((v) => v.toBuilder())
 226 | ||               .filter((v) => v.data.type === ComponentType.TextDisplay)
 227 | ||               .map((c) => (c as TextDisplay).data.content)
 228 | ||               .filter((c) => c !== undefined)
 229 | ||               .filter((c) => !c.startsWith(`-# ${emojis.reply}`))
 230 | ||               .join("");
 231 | ||   
 232 | ||             let color = "Green";
 233 | ||   
 234 | ||             if (!guild.logChannel) return;
 235 | ||   
 236 | ||             try {
 237 | ||               const image = await (
 238 | ||                 await fetch(
 239 | ||                   `https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
 240 | ||                   { signal: AbortSignal.timeout(3000) },
 241 | ||                 )
 242 | ||               ).arrayBuffer();
 243 | ||   
 244 | ||               color = (await getColor(image))?.hex() ?? "Green";
 245 | ||             } catch (_) {}
 246 | ||   
 247 | ||             if (!guild.logChannel) return;
 248 | ||   
 249 | ||             await client.messages
 250 | ||               .write(guild.logChannel, {
 251 | ||                 components: [
 252 | ||                   new TextDisplay().setContent(
 253 | ||                     `https://discord.com/channels/${ctx.guildId ?? "@me"}/${ctx.channelId}/${sentMessage?.id}`,
 254 | ||                   ),
 255 | ||                   new Container()
 256 | ||                     .setComponents(
 257 | ||                       new Section()
 258 | ||                         .setComponents(
 259 | ||                           new TextDisplay().setContent(
 260 | ||                             message === "" || message === undefined
 261 | ||                               ? "Cannot render message as string - use link above."
 262 | ||                               : message,
 263 | ||                           ),
 264 | ||                         )
 265 | ||                         .setAccessory(
 266 | ||                           new Thumbnail().setMedia(
 267 | ||                             alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png",
 268 | ||                           ),
 269 | ||                         ),
 270 | ||                       new Separator().setSpacing(Spacing.Large),
 271 | ||                       new TextDisplay()
 272 | ||                         .setContent(`-# Sent by system/user \`${systemId}\`, by alter \`${alter.alterId}\`
 273 | ||   -# Mention: @${user.username} (<@${systemId}>)
 274 | ||   -# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})
 275 | ||   -# Proxied message as: \`N/A\` → \`${sentMessage?.id ?? "Unknown"}\`
 276 | ||   -# Proxied via: /reproxy
 277 | ||   -# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
 278 | ||                     )
 279 | ||                     .setColor((color as `#${string}` | "Green") ?? "Green"),
 280 | ||                 ],
 281 | ||                 flags: MessageFlags.IsComponentsV2,
 282 | ||                 allowed_mentions: { parse: [] },
 283 | ||               })
 284 | ||               .catch(() =>
 285 | ||                 createError(guild.guildId, {
 286 | ||                   title: "Failed to send proxy log in log channel.",
 287 | ||                   description:
 288 | ||                     "PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
 289 | ||                   responsibleChannelId: guild.logChannel ?? undefined,
 290 | ||                   type: "FailedLogging",
 291 | ||                 }),
 292 | ||               );
 293 | ||           })();
 294 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 295 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/reproxy.ts:199:9]
 198 |       .then((sentMessage) => {
 199 |         setLastLatchAlter(ctx.guildId ?? "", ctx.channelId ?? "", system, alter);
     :         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     :                                             `-- This unhandled promise-like value has type `Promise<void>`.
 200 | 
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/reproxy.ts:201:9]
 200 |      
 201 | ,-->         messagesCollection.replaceOne(
 202 | ||             { messageId: message.messageId },
 203 | ||             {
 204 | ||               messageId: sentMessage?.id ?? "0",
 205 | ||               alterId: alter.alterId,
 206 | ||               systemId,
 207 | ||               createdAt: new Date(),
 208 | ||               channelId: sentMessage?.channelId ?? "0",
 209 | ||               guildId: message.guildId,
 210 | ||             },
 211 | |-->         );
     : `----- This unhandled promise-like value has type `Promise<UpdateResult<{ messageId: string; systemId: string; alterId: number; createdAt: Date; guildId?: string | undefined; channelId: string; referencedMessage?: string | undefined; expressUserId?: string | undefined; }>>`.
 212 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/reproxy.ts:213:9]
 212 |      
 213 | ,-->         (async () => {
 214 | ||             await Promise.all(processedEmojis.map(async (c) => await c.delete()));
 215 | ||   
 216 | ||             await webhook.messages.delete({
 217 | ||               messageId,
 218 | ||               query: parent !== null ? { thread_id: channel.id } : {},
 219 | ||               reason: `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
 220 | ||             });
 221 | ||   
 222 | ||             const guild = await getGuildFromId(ctx.guildId ?? "");
 223 | ||             const user = await client.users.fetch(ctx.author.id);
 224 | ||             const message = originalMessage.components
 225 | ||               .map((v) => v.toBuilder())
 226 | ||               .filter((v) => v.data.type === ComponentType.TextDisplay)
 227 | ||               .map((c) => (c as TextDisplay).data.content)
 228 | ||               .filter((c) => c !== undefined)
 229 | ||               .filter((c) => !c.startsWith(`-# ${emojis.reply}`))
 230 | ||               .join("");
 231 | ||   
 232 | ||             let color = "Green";
 233 | ||   
 234 | ||             if (!guild.logChannel) return;
 235 | ||   
 236 | ||             try {
 237 | ||               const image = await (
 238 | ||                 await fetch(
 239 | ||                   `https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
 240 | ||                   { signal: AbortSignal.timeout(3000) },
 241 | ||                 )
 242 | ||               ).arrayBuffer();
 243 | ||   
 244 | ||               color = (await getColor(image))?.hex() ?? "Green";
 245 | ||             } catch (_) {}
 246 | ||   
 247 | ||             if (!guild.logChannel) return;
 248 | ||   
 249 | ||             await client.messages
 250 | ||               .write(guild.logChannel, {
 251 | ||                 components: [
 252 | ||                   new TextDisplay().setContent(
 253 | ||                     `https://discord.com/channels/${ctx.guildId ?? "@me"}/${ctx.channelId}/${sentMessage?.id}`,
 254 | ||                   ),
 255 | ||                   new Container()
 256 | ||                     .setComponents(
 257 | ||                       new Section()
 258 | ||                         .setComponents(
 259 | ||                           new TextDisplay().setContent(
 260 | ||                             message === "" || message === undefined
 261 | ||                               ? "Cannot render message as string - use link above."
 262 | ||                               : message,
 263 | ||                           ),
 264 | ||                         )
 265 | ||                         .setAccessory(
 266 | ||                           new Thumbnail().setMedia(
 267 | ||                             alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png",
 268 | ||                           ),
 269 | ||                         ),
 270 | ||                       new Separator().setSpacing(Spacing.Large),
 271 | ||                       new TextDisplay()
 272 | ||                         .setContent(`-# Sent by system/user \`${systemId}\`, by alter \`${alter.alterId}\`
 273 | ||   -# Mention: @${user.username} (<@${systemId}>)
 274 | ||   -# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})
 275 | ||   -# Proxied message as: \`N/A\` → \`${sentMessage?.id ?? "Unknown"}\`
 276 | ||   -# Proxied via: /reproxy
 277 | ||   -# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
 278 | ||                     )
 279 | ||                     .setColor((color as `#${string}` | "Green") ?? "Green"),
 280 | ||                 ],
 281 | ||                 flags: MessageFlags.IsComponentsV2,
 282 | ||                 allowed_mentions: { parse: [] },
 283 | ||               })
 284 | ||               .catch(() =>
 285 | ||                 createError(guild.guildId, {
 286 | ||                   title: "Failed to send proxy log in log channel.",
 287 | ||                   description:
 288 | ||                     "PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
 289 | ||                   responsibleChannelId: guild.logChannel ?? undefined,
 290 | ||                   type: "FailedLogging",
 291 | ||                 }),
 292 | ||               );
 293 | |-->         })();
     : `----- This unhandled promise-like value has type `Promise<void>`.
 294 |            });
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/reproxy.ts:305:11]
 304 |      
 305 | ,-->           message.delete(
 306 | ||               `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
 307 | |-->           );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 308 |              }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/commands/alters/alter-assign.ts:101:14]
 100 |           components: new AlertView(await ctx.userTranslations()).errorViewCustom(
 101 |             (await await ctx.userTranslations()).TAG_ALREADY_ASSIGNED.replaceAll(
     :              ^^^^^ ^^^^^^^^^^^^^^|^^^^^^^^^^^^^
     :                |                 `-- This expression is not Promise-like
 102 |               "%tag%",
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-assign.ts:139:7]
 138 |          if (alter.fields["@/converter/pk"] && tag.fields["@/converter/pk"])
 139 | ,-->       writeBack({
 140 | ||           type: "member-group-relationship",
 141 | ||           id: alter.fields["@/converter/pk"],
 142 | ||           change: {
 143 | ||             type: "add",
 144 | ||             groupId: tag.fields["@/converter/pk"],
 145 | ||           },
 146 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 147 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 148 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/alters/alter-color.ts:85:9]
 84 |            if (alter.fields["@/converter/pk"])
 85 | ,-->         writeBack({
 86 | ||             type: "alter",
 87 | ||             id: alter.fields["@/converter/pk"],
 88 | ||             change: {
 89 | ||               color: null,
 90 | ||             },
 91 | ||             syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 92 | |-->         });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 93 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-color.ts:114:7]
 113 |          if (alter.fields["@/converter/pk"])
 114 | ,-->       writeBack({
 115 | ||           type: "alter",
 116 | ||           id: alter.fields["@/converter/pk"],
 117 | ||           change: {
 118 | ||             color,
 119 | ||           },
 120 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 121 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 122 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-description.ts:99:7]
  98 |          if (alter.fields["@/converter/pk"])
  99 | ,-->       writeBack({
 100 | ||           type: "alter",
 101 | ||           id: alter.fields["@/converter/pk"],
 102 | ||           change: {
 103 | ||             description: alterDescription,
 104 | ||           },
 105 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 106 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 107 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-banner.ts:103:9]
 102 |            if (alter.fields["@/converter/pk"])
 103 | ,-->         writeBack({
 104 | ||             type: "alter",
 105 | ||             id: alter.fields["@/converter/pk"],
 106 | ||             change: {
 107 | ||               banner: null,
 108 | ||             },
 109 | ||             syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 110 | |-->         });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 111 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-banner.ts:174:7]
 173 |          if (alter.fields["@/converter/pk"])
 174 | ,-->       writeBack({
 175 | ||           type: "alter",
 176 | ||           id: alter.fields["@/converter/pk"],
 177 | ||           change: {
 178 | ||             banner: attachmentText,
 179 | ||           },
 180 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 181 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 182 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-display-name.ts:191:9]
 190 |            if (alter.fields["@/converter/pk"])
 191 | ,-->         writeBack({
 192 | ||             type: "alter",
 193 | ||             id: alter.fields["@/converter/pk"],
 194 | ||             change: {
 195 | ||               displayName: alterNewName,
 196 | ||             },
 197 | ||             syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 198 | |-->         });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 199 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-picture.ts:210:7]
 209 |          if (alter.fields["@/converter/pk"])
 210 | ,-->       writeBack({
 211 | ||           type: "alter",
 212 | ||           id: alter.fields["@/converter/pk"],
 213 | ||           change: { avatarUrl: attachmentText },
 214 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 215 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 216 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-privacy.ts:134:7]
 133 |          if (alter.fields["@/converter/pk"])
 134 | ,-->       writeBack({
 135 | ||           type: "alter",
 136 | ||           id: alter.fields["@/converter/pk"],
 137 | ||           change: { public: newPublic },
 138 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 139 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 140 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-base-to-string): 'operation[c]' may use Object's default stringification format ('[object Object]') when stringified.
    ,-[src/lib/alter-operation.ts:57:11]
 56 |           "%value%",
 57 |           operation[c]?.toString() ?? "?",
    :           ^^^^^^^^^^^^
 58 |         );
    `----
  help: Consider picking a property (e.g. `user.name`), using a formatter (or `JSON.stringify`), or implementing a custom `toString()`/`toLocaleString()` on the type.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/alters/alter-pronouns.ts:99:7]
  98 |          if (alter.fields["@/converter/pk"])
  99 | ,-->       writeBack({
 100 | ||           type: "alter",
 101 | ||           id: alter.fields["@/converter/pk"],
 102 | ||           change: { pronouns: alterPronouns },
 103 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 104 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 105 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/alters/alter-rename.ts:85:7]
 84 |          if (alter.fields["@/converter/pk"])
 85 | ,-->       writeBack({
 86 | ||           type: "alter",
 87 | ||           id: alter.fields["@/converter/pk"],
 88 | ||           change: { username: alterNewName },
 89 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 90 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 91 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/events/on-message-delete.ts:35:9]
 34 |      
 35 | ,-->         webhook.messages.edit({
 36 | ||             messageId: nativeMessage.id,
 37 | ||             body: {
 38 | ||               // @ts-expect-error
 39 | ||               components: nativeMessage.components.slice(1),
 40 | ||             },
 41 | ||             query: parent !== null ? { thread_id: channel.id } : {},
 42 | |-->         });
    : `----- This unhandled promise-like value has type `Promise<WebhookMessage>`.
 43 |            } catch (_) {}
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/lib/proxying/process-edit.ts:272:13]
 271 |           for (const emoji of uploadedEmojis) {
 272 |             emoji.delete();
     :             ^^^^^^^|^^^^^^^
     :                    `-- This unhandled promise-like value has type `Promise<void>`.
 273 |           }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
     ,-[src/views/server-cfg.ts:286:29]
 285 |     filters?: (typeof errorPagination)[0]["filters"],
 286 |     paginationId?: string | undefined,
     :                             ^^^^^^^^^
 287 |   ) {
     `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/log-channel.ts:47:5]
 46 | 
 47 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 48 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/require-tag.ts:47:5]
 46 |     );
 47 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 48 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/set-proxy-delay.ts:42:5]
 41 |     );
 42 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 43 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/set-feature.ts:68:5]
 67 |     );
 68 |     ctx.client.cache.pguild.remove(nativeGuild.id);
    :     ^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                            `-- This unhandled promise-like value has type `Awaitable<void>`.
 69 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/blocks/add-blocked-category.ts:65:5]
 64 |     );
 65 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 66 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/blocks/add-blocked-channel.ts:57:5]
 56 |     );
 57 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 58 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/blocks/add-blocked-role.ts:58:5]
 57 |     );
 58 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 59 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/blocks/remove-blocked-category.ts:52:5]
 51 |     );
 52 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 53 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/blocks/remove-blocked-channel.ts:44:5]
 43 |     );
 44 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 45 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/blocks/remove-blocked-role.ts:45:5]
 44 |     );
 45 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 46 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/manager-roles/add.ts:56:5]
 55 |     );
 56 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 57 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/manager-roles/remove.ts:42:5]
 41 |     );
 42 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 43 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/prefixes/add-prefix.ts:49:5]
 48 |     );
 49 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 50 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/role-containers/set-color.ts:73:5]
 72 |       );
 73 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 74 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/prefixes/remove-prefix.ts:88:5]
 87 |     );
 88 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 89 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/role-containers/set-contents.ts:66:5]
 65 | 
 66 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 67 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/commands/server-config/role-containers/set-location.ts:72:5]
 71 | 
 72 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 73 |     guild.rolePreferences = [
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(unbound-method): Avoid referencing unbound methods which may cause unintentional scoping of `this`.
     ,-[src/views/system-settings.ts:382:53]
 381 |       {
 382 |         "Systems.Configuration.Pagination.PageOne": this.generalSettingsPageOne,
     :                                                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^|
     :                                                                  |             `-- This reference may be unbound and lose `this` context
 383 |         "Systems.Configuration.Pagination.PageTwo": this.generalSettingsPageTwo,
     `----
  help: If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.

  ! typescript(unbound-method): Avoid referencing unbound methods which may cause unintentional scoping of `this`.
     ,-[src/views/system-settings.ts:383:53]
 382 |         "Systems.Configuration.Pagination.PageOne": this.generalSettingsPageOne,
 383 |         "Systems.Configuration.Pagination.PageTwo": this.generalSettingsPageTwo,
     :                                                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^|
     :                                                                  |             `-- This reference may be unbound and lose `this` context
 384 |         "Systems.Configuration.Pagination.PageThree": this.generalSettingsPageThree,
     `----
  help: If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.

  ! typescript(unbound-method): Avoid referencing unbound methods which may cause unintentional scoping of `this`.
     ,-[src/views/system-settings.ts:384:55]
 383 |         "Systems.Configuration.Pagination.PageTwo": this.generalSettingsPageTwo,
 384 |         "Systems.Configuration.Pagination.PageThree": this.generalSettingsPageThree,
     :                                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
     :                                                                     |              `-- This reference may be unbound and lose `this` context
 385 |       },
     `----
  help: If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/commands/sync/settings.ts:37:15]
 36 |             components: [
 37 | ,->           ...(await new SystemSettingsView(
    : |                 ^^^^^
 38 | |               await ctx.userTranslations(),
 39 | |               getSystemFeatures(user.system)?.preferAccessiblity,
 40 | |->           ).syncSettings(user)),
    : `---- This expression is not Promise-like
 41 |             ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/systems/create-alter.command.ts:188:5]
 187 |          await alterCollection.insertOne(alter.data);
 188 | ,-->     writeBack({
 189 | ||         type: "create-alter",
 190 | ||         id: String(alter.data.alterId),
 191 | ||         change: { ...alter.data, userId: ctx.author.id },
 192 | ||         syncConfig: user.syncConfiguration,
 193 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 194 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/systems/create-tag.command.ts:122:5]
 121 | 
 122 |     tagCollection.insertOne(tag.data);
     :     ^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^
     :                     `-- This unhandled promise-like value has type `Promise<InsertOneResult<{ tagId: string; systemId: string; tagFriendlyName: string; tagDescription?: string | null | undefined; tagColor: string; associatedAlters: string[]; orderString?: string | undefined; public: number; fields: Record<...>; }>>`.
 123 | 
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/systems/create-tag.command.ts:124:5]
 123 |      
 124 | ,-->     writeBack({
 125 | ||         type: "create-tag",
 126 | ||         id: String(tag.data.tagId),
 127 | ||         change: { ...tag.data, userId: user.userId },
 128 | ||         syncConfig: user.syncConfiguration,
 129 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 130 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/commands/systems/export-system.command.ts:43:11]
 42 |             if (user.system)
 43 | ,->           await ctx.followup?.({
    : |             ^^^^^
 44 | |               files: [
 45 | |                 new AttachmentBuilder()
 46 | |                   .setName("system.json")
 47 | |                   .setFile("buffer", Buffer.from(await buildExportPayload(user.system))),
 48 | |               ],
 49 | |               flags: MessageFlags.Ephemeral,
 50 | |->           });
    : `---- This expression is not Promise-like
 51 |           },
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/commands/systems/system-description.ts:82:12]
 81 |         ...new AlertView(await ctx.userTranslations()).successViewCustom(
 82 |           (await await ctx.userTranslations()).ALTER_SUCCESS_DESC.replace(
    :            ^^^^^ ^^^^^^^^^^^^^^|^^^^^^^^^^^^^
    :              |                 `-- This expression is not Promise-like
 83 |             "@%alter%",
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/tags/tag-description.ts:97:7]
  96 |          if (tag.fields["@/converter/pk"])
  97 | ,-->       writeBack({
  98 | ||           type: "tag",
  99 | ||           id: tag.fields["@/converter/pk"],
 100 | ||           change: {
 101 | ||             tagDescription,
 102 | ||           },
 103 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 104 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 105 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/loading.ts:14:5]
 13 |   override async run(ctx: ComponentContext<typeof this.componentType>) {
 14 |     ctx.deferUpdate();
    :     ^^^^^^^^|^^^^^^^^^
    :             `-- This unhandled promise-like value has type `Promise<undefined>`.
 15 |   }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/commands/tags/rename-tag.ts:97:7]
  96 |          if (tag.fields["@/converter/pk"])
  97 | ,-->       writeBack({
  98 | ||           type: "tag",
  99 | ||           id: tag.fields["@/converter/pk"],
 100 | ||           change: {
 101 | ||             tagFriendlyName,
 102 | ||           },
 103 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 104 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 105 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/commands/systems/terminology.command.ts:41:15]
 40 |               ).topView("terminology", user.system.associatedUserId),
 41 | ,->           ...(await new SystemSettingsView(
    : |                 ^^^^^
 42 | |               await ctx.userTranslations(),
 43 | |               getSystemFeatures(user.system)?.preferAccessiblity,
 44 | |->           ).terminologySettings(user.system)),
    : `---- This expression is not Promise-like
 45 |             ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/set-guild-prefixes-form.ts:35:5]
 34 |     );
 35 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 36 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/manage-managers-form.ts:34:5]
 33 |     );
 34 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 35 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/set-logging-channel-form.ts:35:5]
 34 |     );
 35 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 36 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/set-ping-mode.ts:27:5]
 26 |     );
 27 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 28 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/set-proxy-delay-form.ts:38:5]
 37 |     );
 38 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 39 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/toggle-mand-tags.ts:32:5]
 31 |     );
 32 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 33 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/blacklists/add-category-form.ts:28:5]
 27 |     );
 28 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 29 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/blacklists/add-role-form.ts:26:5]
 25 |     );
 26 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 27 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/blacklists/remove-category-form.ts:28:5]
 27 |     );
 28 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 29 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/errors/clear-error.ts:35:5]
 34 |     );
 35 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 36 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/blacklists/add-channel-form.ts:31:5]
 30 |     );
 31 |     ctx.client.cache.pguild.remove(pluralGuild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^^^
    :                              `-- This unhandled promise-like value has type `Awaitable<void>`.
 32 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/features/toggle-feature.ts:38:5]
 37 |     );
 38 |     ctx.client.cache.pguild.remove(guildObj.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                             `-- This unhandled promise-like value has type `Awaitable<void>`.
 39 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-misused-spread): Using the spread operator on class instances will lose their class prototype.
    ,-[src/components/policy-form.ts:28:11]
 27 |         await c.filter?.({
 28 |           ...ctx,
    :           ^^^^^^
 29 |           customId: newCustomId,
    `----

  ! typescript(no-misused-spread): Using the spread operator on class instances will lose their class prototype.
    ,-[src/components/policy-form.ts:30:26]
 29 |           customId: newCustomId,
 30 |           interaction: { ...ctx.interaction, values: ["", "", "", ""] },
    :                          ^^^^^^^^^^^^^^^^^^
 31 |         } as unknown as ModalContext & ComponentContext<never>)
    `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/roles/new-form.ts:45:5]
 44 |     );
 45 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 46 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/roles/general/color-form.ts:53:5]
 52 |     );
 53 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 54 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/roles/general/contents-form.ts:47:5]
 46 |     );
 47 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 48 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/guilds/roles/general/location-form.ts:47:5]
 46 |     );
 47 |     ctx.client.cache.pguild.remove(guild.guildId);
    :     ^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^
    :                           `-- This unhandled promise-like value has type `Awaitable<void>`.
 48 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/pluralbuddy-intro/import/pluralbuddy.ts:23:5]
 22 |        async run(ctx: ComponentContext<typeof this.componentType>) {
 23 | ,-->     ctx.modal(
 24 | ||         new Modal()
 25 | ||           .setTitle((await ctx.userTranslations()).IMPORT_PLURALBUDDY_DESCRIPTION)
 26 | ||           .setCustomId(InteractionIdentifier.Setup.FormSelection.ImportForm.create())
 27 | ||           .setComponents([
 28 | ||             new Label()
 29 | ||               .setLabel((await ctx.userTranslations()).IMPORT_SOURCE_DESCRIPTION)
 30 | ||               .setComponent(
 31 | ||                 new FileUpload()
 32 | ||                   .setCustomId(InteractionIdentifier.Setup.FormSelection.ImportType.create())
 33 | ||                   .setMaxValues(1)
 34 | ||                   .setMinValues(1)
 35 | ||                   .setRequired(true),
 36 | ||               ),
 37 | ||           ]),
 38 | |-->     );
    : `----- This unhandled promise-like value has type `Promise<undefined>`.
 39 |        }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-duplicate-type-constituents): Explicit undefined is unnecessary on an optional parameter.
    ,-[src/views/alter-assign-tag.ts:23:22]
 22 |     system: PSystem,
 23 |     alter?: PAlter | undefined,
    :                      ^^^^^^^^^
 24 |     pgObj?: (typeof assignTagPagination)[0],
    `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/pluralbuddy-intro/import/pk/pluralkit-modal.ts:312:7]
 311 |            terminologyMemoryCache[ctx.author.id] = newObj;
 312 | ,-->       ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
 313 | ||           terms: newObj,
 314 | |-->       });
     : `----- This unhandled promise-like value has type `Awaitable<void>`.
 315 |          }
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alter-assigning-pagination/assign-toggle.ts:77:7]
 76 |      
 77 | ,-->       (async () => {
 78 | ||           const tag = await tagCollection.findOne({ tagId });
 79 | ||   
 80 | ||           w(ctx.author.id, "tag.update", {
 81 | ||             type: "tag.update",
 82 | ||             tag,
 83 | ||           });
 84 | ||   
 85 | ||           if (tag?.fields["@/converter/pk"] && corresponding.alter.fields["@/converter/pk"])
 86 | ||             writeBack({
 87 | ||               type: "member-group-relationship",
 88 | ||               id: corresponding.alter.fields["@/converter/pk"],
 89 | ||               change: {
 90 | ||                 type: "remove",
 91 | ||                 groupId: tag?.fields["@/converter/pk"],
 92 | ||               },
 93 | ||               syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 94 | ||             });
 95 | |-->       })();
    : `----- This unhandled promise-like value has type `Promise<void>`.
 96 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alter-assigning-pagination/assign-toggle.ts:86:11]
 85 |              if (tag?.fields["@/converter/pk"] && corresponding.alter.fields["@/converter/pk"])
 86 | ,-->           writeBack({
 87 | ||               type: "member-group-relationship",
 88 | ||               id: corresponding.alter.fields["@/converter/pk"],
 89 | ||               change: {
 90 | ||                 type: "remove",
 91 | ||                 groupId: tag?.fields["@/converter/pk"],
 92 | ||               },
 93 | ||               syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 94 | |-->           });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 95 |            })();
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alter-assigning-pagination/assign-toggle.ts:136:7]
 135 |      
 136 | ,-->       (async () => {
 137 | ||           const tag = await tagCollection.findOne({ tagId });
 138 | ||   
 139 | ||           w(ctx.author.id, "tag.update", {
 140 | ||             type: "tag.update",
 141 | ||             tag,
 142 | ||           });
 143 | ||   
 144 | ||           if (tag?.fields["@/converter/pk"] && corresponding.alter.fields["@/converter/pk"])
 145 | ||             writeBack({
 146 | ||               type: "member-group-relationship",
 147 | ||               id: corresponding.alter.fields["@/converter/pk"],
 148 | ||               change: {
 149 | ||                 type: "add",
 150 | ||                 groupId: tag?.fields["@/converter/pk"],
 151 | ||               },
 152 | ||               syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 153 | ||             });
 154 | |-->       })();
     : `----- This unhandled promise-like value has type `Promise<void>`.
 155 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alter-assigning-pagination/assign-toggle.ts:145:11]
 144 |              if (tag?.fields["@/converter/pk"] && corresponding.alter.fields["@/converter/pk"])
 145 | ,-->           writeBack({
 146 | ||               type: "member-group-relationship",
 147 | ||               id: corresponding.alter.fields["@/converter/pk"],
 148 | ||               change: {
 149 | ||                 type: "add",
 150 | ||                 groupId: tag?.fields["@/converter/pk"],
 151 | ||               },
 152 | ||               syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 153 | |-->           });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 154 |            })();
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(restrict-template-expressions): Invalid type used in template literal expression.
    ,-[src/components/systems/alter-plain-pagination/page-untrusted.ts:84:28]
 83 |               )
 84 |               .setLabel(`${page}/${Math.ceil(user.system.alterIds.length / 90)}`)
    :                            ^^|^^
    :                              `-- Type: string | string[]
 85 |               .setStyle(ButtonStyle.Secondary),
    `----

  ! typescript(restrict-template-expressions): Invalid type used in template literal expression.
     ,-[src/components/systems/alter-plain-pagination/page-untrusted.ts:125:26]
 124 |             )
 125 |             .setLabel(`${page}/${Math.ceil(user.system.alterIds.length / 90)}`)
     :                          ^^|^^
     :                            `-- Type: string | string[]
 126 |             .setStyle(ButtonStyle.Secondary),
     `----

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alters/create-new-alter-form.ts:173:5]
 172 |          await alterCollection.insertOne(alter.data);
 173 | ,-->     writeBack({
 174 | ||         type: "create-alter",
 175 | ||         id: String(alter.data.alterId),
 176 | ||         change: { ...alter.data, userId: ctx.author.id },
 177 | ||         syncConfig: user.syncConfiguration,
 178 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 179 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alters/config/create-proxy-tag-modal.ts:115:7]
 114 |          if ((alter.fields ?? {})["@/converter/pk"] !== undefined)
 115 | ,-->       writeBack({
 116 | ||           type: "alter",
 117 | ||           id: alter.fields["@/converter/pk"] ?? "??",
 118 | ||           change: {
 119 | ||             proxyTags: [
 120 | ||               ...alter.proxyTags,
 121 | ||               {
 122 | ||                 prefix,
 123 | ||                 suffix,
 124 | ||                 id: String(id),
 125 | ||               },
 126 | ||             ],
 127 | ||           },
 128 | ||           syncConfig: (await context.retrievePUser()).syncConfiguration,
 129 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 130 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alters/config/create-proxy-tag-modal.ts:137:18]
 136 | 
 137 |     if (alterId) context.client.cache.alterProxy.remove(alterId);
     :                  ^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
     :                                         `-- This unhandled promise-like value has type `Awaitable<void>`.
 138 | 
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/keep-proxy-tags.ts:67:7]
 66 |          if (alter.fields["@/converter/pk"])
 67 | ,-->       writeBack({
 68 | ||           type: "alter",
 69 | ||           id: alter.fields["@/converter/pk"],
 70 | ||           change: {
 71 | ||             flags: getAlterFeatures(alter).keepProxyTags
 72 | ||               ? getAlterFeatures(alter).disable(AlterFlags.PROXY_TAGS_KEPT)
 73 | ||               : getAlterFeatures(alter).enable(AlterFlags.PROXY_TAGS_KEPT),
 74 | ||           },
 75 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 76 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 77 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/delete-proxy-tag.ts:62:7]
 61 |          if (alter.fields["@/converter/pk"])
 62 | ,-->       writeBack({
 63 | ||           type: "alter",
 64 | ||           id: alter.fields["@/converter/pk"],
 65 | ||           change: {
 66 | ||             proxyTags: [...alter.proxyTags.filter((v) => v.id !== proxyTag)],
 67 | ||           },
 68 | ||           syncConfig: (await context.retrievePUser()).syncConfiguration,
 69 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 70 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/delete-proxy-tag.ts:76:18]
 75 |       })) ?? alter;
 76 |     if (alterId) context.client.cache.alterProxy.remove(alterId);
    :                  ^^^^^^^^^^^^^^^^^^^^^^^|^^^^^^^^^^^^^^^^^^^^^^^^
    :                                         `-- This unhandled promise-like value has type `Awaitable<void>`.
 77 | 
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alters/config/set-banner-form.ts:105:7]
 104 |          if (alter.fields["@/converter/pk"])
 105 | ,-->       writeBack({
 106 | ||           type: "alter",
 107 | ||           id: alter.fields["@/converter/pk"],
 108 | ||           change: {
 109 | ||             banner: url,
 110 | ||           },
 111 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 112 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 113 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/set-color-form.ts:71:7]
 70 |          if (alter.fields["@/converter/pk"])
 71 | ,-->       writeBack({
 72 | ||           type: "alter",
 73 | ||           id: alter.fields["@/converter/pk"],
 74 | ||           change: {
 75 | ||             color: newAlterColor as string,
 76 | ||           },
 77 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 78 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 79 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/set-description-form.ts:64:7]
 63 |          if (alter.fields["@/converter/pk"])
 64 | ,-->       writeBack({
 65 | ||           type: "alter",
 66 | ||           id: alter.fields["@/converter/pk"],
 67 | ||           change: {
 68 | ||             description: newAlterDescription as string | undefined,
 69 | ||           },
 70 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 71 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 72 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/set-display-name-form.ts:64:7]
 63 |          if (alter.fields["@/converter/pk"])
 64 | ,-->       writeBack({
 65 | ||           type: "alter",
 66 | ||           id: alter.fields["@/converter/pk"],
 67 | ||           change: {
 68 | ||             displayName: newAlterUsername as string | undefined,
 69 | ||           },
 70 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 71 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 72 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alters/config/set-pfp-form.ts:105:7]
 104 |          if (alter.fields["@/converter/pk"])
 105 | ,-->       writeBack({
 106 | ||           type: "alter",
 107 | ||           id: alter.fields["@/converter/pk"],
 108 | ||           change: {
 109 | ||             avatarUrl: url,
 110 | ||           },
 111 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 112 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 113 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/alters/config/set-privacy-modal.ts:105:7]
 104 |          if (alter.fields["@/converter/pk"])
 105 | ,-->       writeBack({
 106 | ||           type: "alter",
 107 | ||           id: alter.fields["@/converter/pk"],
 108 | ||           change: {
 109 | ||             public: privacyFlag,
 110 | ||           },
 111 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 112 | |-->       });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 113 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/set-pronouns-form.ts:64:7]
 63 |          if (alter.fields["@/converter/pk"])
 64 | ,-->       writeBack({
 65 | ||           type: "alter",
 66 | ||           id: alter.fields["@/converter/pk"],
 67 | ||           change: {
 68 | ||             pronouns: newAlterUsername as string | undefined,
 69 | ||           },
 70 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 71 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 72 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/alters/config/set-username-form.ts:73:7]
 72 |          if (alter.fields["@/converter/pk"])
 73 | ,-->       writeBack({
 74 | ||           type: "alter",
 75 | ||           id: alter.fields["@/converter/pk"],
 76 | ||           change: {
 77 | ||             username: newAlterUsername as string | undefined,
 78 | ||           },
 79 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 80 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 81 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/sync/auto-syncing-prefs-form.ts:78:13]
 77 |           components: [
 78 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 79 | |             await ctx.userTranslations(),
 80 | |             getSystemFeatures(user.system)?.preferAccessiblity,
 81 | |->         ).syncSettings(user)),
    : `---- This expression is not Promise-like
 82 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/components/systems/config/sync/manual-sync-form.ts:98:15]
  97 |             components: [
  98 | ,->           ...(await new SystemSettingsView(
     : |                 ^^^^^
  99 | |               await ctx.userTranslations(),
 100 | |               getSystemFeatures(systemPB)?.preferAccessiblity,
 101 | |->           ).syncSettings(await ctx.retrievePUser())),
     : `---- This expression is not Promise-like
 102 |             ],
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/components/systems/config/sync/manual-sync-form.ts:121:15]
 120 |             components: [
 121 | ,->           ...(await new SystemSettingsView(
     : |                 ^^^^^
 122 | |               await ctx.userTranslations(),
 123 | |               getSystemFeatures(systemPB)?.preferAccessiblity,
 124 | |->           ).syncSettings(await ctx.retrievePUser())),
     : `---- This expression is not Promise-like
 125 |             ],
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/components/systems/config/sync/manual-sync-form.ts:158:17]
 157 |               components: [
 158 | ,->             ...(await new AlertView(await ctx.userTranslations()).errorViewCustom(
     : |                   ^^^^^
 159 | |                 (await ctx.userTranslations()).PK_ERROR.replace(
 160 | |                   "{{ error }}",
 161 | |                   (v._zod.output as { message: string | undefined } | undefined)?.message ?? "??",
 162 | |                 ),
 163 | |->             )),
     : `---- This expression is not Promise-like
 164 |               ],
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/config/terminology/edit-capital-terms-form.ts:61:5]
 60 |          terminologyMemoryCache[ctx.author.id] = newObj;
 61 | ,-->     ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
 62 | ||         terms: newObj,
 63 | |-->     });
    : `----- This unhandled promise-like value has type `Awaitable<void>`.
 64 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
     ,-[src/components/systems/config/sync/quick-sync.ts:116:13]
 115 |           components: [
 116 | ,->         ...(await new SystemSettingsView(
     : |               ^^^^^
 117 | |             await ctx.userTranslations(),
 118 | |             getSystemFeatures(systemPB)?.preferAccessiblity,
 119 | |->         ).syncSettings(await ctx.retrievePUser(), QuickSyncStatus.Done)),
     : `---- This expression is not Promise-like
 120 |           ],
     `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/terminology/edit-capital-terms-form.ts:71:13]
 70 |             ).topView("terminology", system.associatedUserId),
 71 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 72 | |             await ctx.userTranslations(),
 73 | |             getSystemFeatures(system)?.preferAccessiblity,
 74 | |->         ).terminologySettings(system)),
    : `---- This expression is not Promise-like
 75 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/config/terminology/edit-normal-terms-form.ts:64:5]
 63 |          terminologyMemoryCache[ctx.author.id] = newObj;
 64 | ,-->     ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
 65 | ||         terms: newObj,
 66 | |-->     });
    : `----- This unhandled promise-like value has type `Awaitable<void>`.
 67 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/config/terminology/edit-plural-terms-form.ts:61:5]
 60 |          terminologyMemoryCache[ctx.author.id] = newObj;
 61 | ,-->     ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
 62 | ||         terms: newObj,
 63 | |-->     });
    : `----- This unhandled promise-like value has type `Awaitable<void>`.
 64 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/terminology/edit-normal-terms-form.ts:74:13]
 73 |             ).topView("terminology", system.associatedUserId),
 74 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 75 | |             await ctx.userTranslations(),
 76 | |             getSystemFeatures(system)?.preferAccessiblity,
 77 | |->         ).terminologySettings(system)),
    : `---- This expression is not Promise-like
 78 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/sync/writing-back-prefs-form.ts:71:13]
 70 |           components: [
 71 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 72 | |             await ctx.userTranslations(),
 73 | |             getSystemFeatures(user.system)?.preferAccessiblity,
 74 | |->         ).syncSettings(user)),
    : `---- This expression is not Promise-like
 75 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/terminology/edit-plural-terms-form.ts:71:13]
 70 |             ).topView("terminology", system.associatedUserId),
 71 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 72 | |             await ctx.userTranslations(),
 73 | |             getSystemFeatures(system)?.preferAccessiblity,
 74 | |->         ).terminologySettings(system)),
    : `---- This expression is not Promise-like
 75 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/terminology/general.ts:35:13]
 34 |             ).topView("terminology", user.system.associatedUserId),
 35 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 36 | |             await ctx.userTranslations(),
 37 | |             getSystemFeatures(user.system)?.preferAccessiblity,
 38 | |->         ).terminologySettings(user.system)),
    : `---- This expression is not Promise-like
 39 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/config/terminology/terminology-template.ts:51:5]
 50 |          terminologyMemoryCache[ctx.author.id] = newObj;
 51 | ,-->     ctx.client.cache.terminology.set(CacheFrom.Gateway, ctx.author.id, {
 52 | ||         terms: newObj,
 53 | |-->     });
    : `----- This unhandled promise-like value has type `Awaitable<void>`.
 54 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(await-thenable): Unexpected `await` of a non-Promise (non-"Thenable") value.
    ,-[src/components/systems/config/terminology/terminology-template.ts:61:13]
 60 |             ).topView("terminology", system.associatedUserId),
 61 | ,->         ...(await new SystemSettingsView(
    : |               ^^^^^
 62 | |             await ctx.userTranslations(),
 63 | |             getSystemFeatures(system)?.preferAccessiblity,
 64 | |->         ).terminologySettings(system)),
    : `---- This expression is not Promise-like
 65 |           ],
    `----
  help: Remove `await` if the value is synchronous, or change the expression to return a Promise or Thenable before awaiting it.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/components/systems/tags/create-new-tag-form.ts:97:5]
  96 |          await tagCollection.insertOne(tag.data);
  97 | ,-->     writeBack({
  98 | ||         type: "create-tag",
  99 | ||         id: String(tag.data.tagId),
 100 | ||         change: { ...tag.data, userId: user.userId },
 101 | ||         syncConfig: user.syncConfiguration,
 102 | |-->     });
     : `----- This unhandled promise-like value has type `Promise<void>`.
 103 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/tags/config/set-color-component.ts:72:7]
 71 |          if (tag.fields["@/converter/pk"])
 72 | ,-->       writeBack({
 73 | ||           type: "tag",
 74 | ||           id: tag.fields["@/converter/pk"],
 75 | ||           change: {
 76 | ||             tagColor: newTagColor,
 77 | ||           },
 78 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 79 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 80 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/tags/config/set-description-form.ts:63:7]
 62 |          if (tag.fields["@/converter/pk"])
 63 | ,-->       writeBack({
 64 | ||           type: "tag",
 65 | ||           id: tag.fields["@/converter/pk"],
 66 | ||           change: {
 67 | ||             tagDescription: typeof tagDescription === "string" ? tagDescription : tagDescription[0],
 68 | ||           },
 69 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 70 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 71 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/tags/config/set-color-form.ts:64:7]
 63 |          if (tag.fields["@/converter/pk"])
 64 | ,-->       writeBack({
 65 | ||           type: "tag",
 66 | ||           id: tag.fields["@/converter/pk"],
 67 | ||           change: {
 68 | ||             tagColor: newTagColor,
 69 | ||           },
 70 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 71 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 72 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/tags/config/set-display-name-form.ts:63:7]
 62 |          if (tag.fields["@/converter/pk"])
 63 | ,-->       writeBack({
 64 | ||           type: "tag",
 65 | ||           id: tag.fields["@/converter/pk"],
 66 | ||           change: {
 67 | ||             tagFriendlyName: newTagUsername as string,
 68 | ||           },
 69 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 70 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 71 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/components/systems/tags/config/set-privacy-form.ts:85:7]
 84 |          if (tag.fields["@/converter/pk"])
 85 | ,-->       writeBack({
 86 | ||           type: "tag",
 87 | ||           id: tag.fields["@/converter/pk"],
 88 | ||           change: {
 89 | ||             public: privacyFlag,
 90 | ||           },
 91 | ||           syncConfig: (await ctx.retrievePUser()).syncConfiguration,
 92 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<void>`.
 93 |      
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/events/on-message-react.ts:54:11]
 53 |              .catch(() => {
 54 | ,-->           createError(reaction.guildId ?? "", {
 55 | ||               title: locale.REACTION_ERR,
 56 | ||               description: locale.SELF_REACTION_DESC,
 57 | ||               type: "FailedMessageReaction",
 58 | ||               responsibleChannelId: reaction.channelId,
 59 | ||               responsibleUserId: reaction.userId,
 60 | |-->           });
    : `----- This unhandled promise-like value has type `Promise<{ title: string; description: string; type: "BotPermissionsRequired" | "EnforcedGuildTagRegulation" | "EnforcedProxyModeRegulation" | "FailedLogging" | "FailedMessageReaction" | "UserPermissionsRequired" | "WebhookFailedCreation"; responsibleUserId?: string | undefined; responsibleChannelId?: string | undefi...`.
 61 |              });
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/events/on-message-react.ts:66:7]
 65 |          if (react === null) {
 66 | ,-->       createError(reaction.guildId ?? "", {
 67 | ||           title: locale.REACTION_ERR,
 68 | ||           description: locale.SELF_REACTION_DESC,
 69 | ||           type: "FailedMessageReaction",
 70 | ||           responsibleChannelId: reaction.channelId,
 71 | ||           responsibleUserId: reaction.userId,
 72 | |-->       });
    : `----- This unhandled promise-like value has type `Promise<{ title: string; description: string; type: "BotPermissionsRequired" | "EnforcedGuildTagRegulation" | "EnforcedProxyModeRegulation" | "FailedLogging" | "FailedMessageReaction" | "UserPermissionsRequired" | "WebhookFailedCreation"; responsibleUserId?: string | undefined; responsibleChannelId?: string | undefi...`.
 73 |          }
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
    ,-[src/events/on-message-react.ts:84:13]
 83 |                .catch(() => {
 84 | ,-->             createError(reaction.guildId ?? "", {
 85 | ||                 title: locale.SELF_REACTION_ERR,
 86 | ||                 description: locale.SELF_REACTION_DESC,
 87 | ||                 type: "FailedMessageReaction",
 88 | ||                 responsibleChannelId: reaction.channelId,
 89 | ||                 responsibleUserId: reaction.userId,
 90 | |-->             });
    : `----- This unhandled promise-like value has type `Promise<{ title: string; description: string; type: "BotPermissionsRequired" | "EnforcedGuildTagRegulation" | "EnforcedProxyModeRegulation" | "FailedLogging" | "FailedMessageReaction" | "UserPermissionsRequired" | "WebhookFailedCreation"; responsibleUserId?: string | undefined; responsibleChannelId?: string | undefi...`.
 91 |                });
    `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:157:11]
 156 |              ) {
 157 | ,-->           client.reactions.delete(
 158 | ||               reaction.messageId,
 159 | ||               reaction.channelId,
 160 | ||               emojis.loading,
 161 | ||               client.applicationId,
 162 | |-->           );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 163 |                return await nativeUser.write({
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:184:9]
 183 |            ) {
 184 | ,-->         client.reactions.delete(
 185 | ||             reaction.messageId,
 186 | ||             reaction.channelId,
 187 | ||             emojis.loading,
 188 | ||             client.applicationId,
 189 | |-->         );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 190 |              return await nativeUser.write({
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:195:7]
 194 |      
 195 | ,-->       client.reactions.delete(
 196 | ||           reaction.messageId,
 197 | ||           reaction.channelId,
 198 | ||           emojis.loading,
 199 | ||           client.applicationId,
 200 | |-->       );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 201 |            return await client.messages.write(reaction.channelId, {
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:230:9]
 229 |            ) {
 230 | ,-->         client.reactions.delete(
 231 | ||             reaction.messageId,
 232 | ||             reaction.channelId,
 233 | ||             emojis.loading,
 234 | ||             client.applicationId,
 235 | |-->         );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 236 |              return await nativeUser.write({
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:250:7]
 249 |      
 250 | ,-->       client.reactions.delete(
 251 | ||           reaction.messageId,
 252 | ||           reaction.channelId,
 253 | ||           emojis.loading,
 254 | ||           client.applicationId,
 255 | |-->       );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 256 |            return await nativeUser.write({
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:294:9]
 293 |            ) {
 294 | ,-->         client.reactions.delete(
 295 | ||             reaction.messageId,
 296 | ||             reaction.channelId,
 297 | ||             emojis.loading,
 298 | ||             client.applicationId,
 299 | |-->         );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 300 |              return await nativeUser.write({
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

  ! typescript(no-floating-promises): Promises must be awaited, add void operator to ignore.
     ,-[src/events/on-message-react.ts:316:7]
 315 |      
 316 | ,-->       client.reactions.delete(
 317 | ||           reaction.messageId,
 318 | ||           reaction.channelId,
 319 | ||           emojis.loading,
 320 | ||           client.applicationId,
 321 | |-->       );
     : `----- This unhandled promise-like value has type `Promise<void>`.
 322 |      
     `----
  help: The promise must end with a call to .catch, or end with a call to .then with a rejection handler, or be explicitly marked as ignored with the `void` operator.

Found 973 warnings and 0 errors.
Finished in 1.7s on 450 files with 125 rules using 10 threads.
