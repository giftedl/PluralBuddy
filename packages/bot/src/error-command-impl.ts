/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
// biome-ignore-all lint/suspicious/noExplicitAny: Most explicit any's here are unavoidable.

import type { Command, CommandContext, ComponentContext, ContextMenuCommand, MenuCommandContext, ModalContext, OnOptionsReturnObject, PermissionStrings, SubCommand, UsingClient } from "seyfert";

export abstract class PluralBuddyErrorComponentCommandImpl {
    onBeforeMiddlewares?(context: ComponentContext): any;
    onAfterRun?(context: ComponentContext, error: unknown | undefined): any;
    onRunError?(context: ComponentContext, error: unknown): any;
    onMiddlewaresError?(context: ComponentContext, error: string): any;
    onInternalError?(client: UsingClient, error?: unknown): any;
}

export abstract class PluralBuddyErrorCommandImpl {
    onAfterRun?(context: CommandContext | MenuCommandContext<any, never>, error: unknown): any;
    onRunError?(context: MenuCommandContext<any, never> | CommandContext, error: unknown): any;
    onOptionsError?(context: CommandContext, metadata: OnOptionsReturnObject): any;
    onMiddlewaresError?(context: CommandContext | MenuCommandContext<any, never>, error: string): any;
    onBotPermissionsFail?(context: MenuCommandContext<any, never> | CommandContext, permissions: PermissionStrings): any;
    onPermissionsFail?(context: CommandContext, permissions: PermissionStrings): any;
    onBeforeOptions?(context: CommandContext): any;
    onInternalError?(client: UsingClient, command: Command | SubCommand | ContextMenuCommand, error?: unknown): any;
}

export abstract class PluralBuddyErrorModalCommandImpl {
    onBeforeMiddlewares?(context: ModalContext): any;
    onAfterRun?(context: ModalContext, error: unknown | undefined): any;
    onRunError?(context: ModalContext, error: unknown): any;
    onMiddlewaresError?(context: ModalContext, error: string): any;
    onInternalError?(client: UsingClient, error?: unknown): any;
}