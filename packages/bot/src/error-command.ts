/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { MessageFlags } from "seyfert/lib/types";
import { posthogClient } from ".";
import { DiscordSnowflake } from "@sapphire/snowflake";
import type {
  CommandContext,
  MenuCommandContext,
  OnOptionsReturnObject,
  ComponentCommand,
  Command,
  ContextMenuCommand,
  UsingClient,
  PermissionStrings,
  ComponentContext,
  ModalContext,
} from "seyfert";
import { AlertView } from "./views/alert";
import {
  PluralBuddyErrorCommandImpl,
  PluralBuddyErrorComponentCommandImpl,
  PluralBuddyErrorModalCommandImpl,
} from "./error-command-impl";
import type { SubCommand } from "seyfert/lib/commands";

function capturePostHogException(
  error: unknown,
  {
    interactionId,
    guildId,
    channelId,
    user,
  }: {
    interactionId?: string | undefined;
    guildId?: string | undefined;
    channelId?: string | undefined;
    // I don't set users for the Posthog exceptions since I want exceptions to be anonymous
    user?: { username: string; id: string } | undefined;
  }
): string {
  const requiredInteractionId =
    interactionId ?? `c${DiscordSnowflake.generate()}`;

  if (posthogClient)
    posthogClient.captureException(error, user?.id ?? undefined, {
      $set: user !== undefined ? { username: user.username } : {},

      interactionId: requiredInteractionId,
      guildId,
      channelId,
    });

  return requiredInteractionId;
}

export class PluralBuddyErrorCommand extends PluralBuddyErrorCommandImpl {
  override async onOptionsError(
    context: CommandContext,
    metadata: OnOptionsReturnObject
  ) {
    if (context.author.bot === true) return;

    const errors = Object.entries(metadata)
      .filter((_) => _[1].failed)
      .map((error) => `${error[0]}: ${error[1].value}`)
      .join("\n");

    await context.editOrReply({
      components: [
        ...new AlertView(context.userTranslations()).errorViewCustom(
          context
            .userTranslations()
            .PLURALBUDDY_OPTIONS_ERROR.replace("%options_errors%", errors)
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: No other way to satisfy the expression.
  override async onRunError(
    context: CommandContext | MenuCommandContext<any, never>,
    error: unknown
  ) {
    context.client.logger.fatal(error);

    const interactionId = capturePostHogException(error, {
      interactionId: context.interaction?.id,
      guildId: context.guildId,
      channelId: context.channelId,
    });

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`RUN_ERROR\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }

  override onInternalError(
    client: UsingClient,
    command: Command | SubCommand | ContextMenuCommand,
    error?: unknown
  ) {
    capturePostHogException(error, {});

    client.logger.fatal(error);
  }

  override async onAfterRun(
    context: CommandContext | MenuCommandContext<any, never>,
    error: unknown
  ) {
    if (error) {
      context.client.logger.fatal(error);

      const interactionId = capturePostHogException(error, {
        interactionId: context.interaction?.id,
        guildId: context.guildId,
        channelId: context.channelId,
      });

      await context.editOrReply({
        components: [
          // @ts-ignore
          ...new AlertView(null).errorViewCustom(
            `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`AFTER_RUN\``
          ),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }
  }

  override async onBotPermissionsFail(
    context: MenuCommandContext<any, never> | CommandContext,
    permissions: PermissionStrings
  ) {
    const interactionId = capturePostHogException(
      new Error(`Bot is missing permissions ${permissions.join(", ")}`),
      {
        interactionId: context.interaction?.id,
        guildId: context.guildId,
        channelId: context.channelId,
      }
    );

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `The bot cannot do that action because it is **missing permissions**. (permissions are ${permissions
            .map((c) => `\`${c}\``)
            .join(
              ", "
            )})\n-# Interaction: \`${interactionId}\` • Error Type: \`BOT_PERMISSIONS\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }

  override async onPermissionsFail(
    context: CommandContext,
    permissions: PermissionStrings
  ) {
    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `You **do not** have permission to do that action. (permissions are ${permissions
            .map((c) => `\`${c}\``)
            .join(", ")})\n-# Error Type: \`USER_PERMISSIONS\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }

  override async onMiddlewaresError(
    context: CommandContext | MenuCommandContext<any, never>,
    error: string
  ) {
    context.client.logger.fatal(error);

    const interactionId = capturePostHogException(error, {
      interactionId: context.interaction?.id,
      guildId: context.guildId,
      channelId: context.channelId,
    });

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`MIDDLEWARE_FAIL\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
}

export class PluralBuddyComponentErrorCommand extends PluralBuddyErrorComponentCommandImpl {
  override async onAfterRun(
    context: ComponentContext,
    error: unknown | undefined
  ) {
    if (error) {
      context.client.logger.fatal(error);

      const interactionId = capturePostHogException(error, {
        interactionId: context.interaction?.id,
        guildId: context.guildId,
        channelId: context.channelId,
      });

      await context.editOrReply({
        components: [
          // @ts-ignore
          ...new AlertView(null).errorViewCustom(
            `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`COMPONENT/AFTER_RUN\``
          ),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }
  }

  override onInternalError(client: UsingClient, error?: unknown) {
    capturePostHogException(error, {});

    client.logger.fatal(error);
  }

  override async onRunError(context: ComponentContext, error: unknown) {
    context.client.logger.fatal(error);

    const interactionId = capturePostHogException(error, {
      interactionId: context.interaction?.id,
      guildId: context.guildId,
      channelId: context.channelId,
    });

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`COMPONENT/RUN_ERROR\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }

  override async onMiddlewaresError(context: ComponentContext, error: string) {
    context.client.logger.fatal(error);

    const interactionId = capturePostHogException(error, {
      interactionId: context.interaction?.id,
      guildId: context.guildId,
      channelId: context.channelId,

    });

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`COMPONENT/MIDDLEWARE_FAIL\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
}

export class PluralBuddyModalErrorCommand extends PluralBuddyErrorModalCommandImpl {
  override async onAfterRun(context: ModalContext, error: unknown | undefined) {
    if (error) {
      context.client.logger.fatal(error);

      const interactionId = capturePostHogException(error, {
        interactionId: context.interaction?.id,
        guildId: context.guildId,
        channelId: context.channelId,
      });

      await context.editOrReply({
        components: [
          // @ts-ignore
          ...new AlertView(null).errorViewCustom(
            `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`MODAL/AFTER_RUN\``
          ),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }
  }

  override onInternalError(client: UsingClient, error?: unknown) {
    capturePostHogException(error, {});

    client.logger.fatal(error);
  }

  override async onMiddlewaresError(context: ModalContext, error: string) {
    context.client.logger.fatal(error);

    const interactionId = capturePostHogException(error, {
      interactionId: context.interaction?.id,
      guildId: context.guildId,
      channelId: context.channelId,

    });

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`MODAL/MIDDLEWARE_FAIL\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
  override async onRunError(context: ModalContext, error: unknown) {
	
    context.client.logger.fatal(error);

    const interactionId = capturePostHogException(error, {
      interactionId: context.interaction?.id,
      guildId: context.guildId,
      channelId: context.channelId,

    });

    await context.editOrReply({
      components: [
        // @ts-ignore
        ...new AlertView(null).errorViewCustom(
          `There was an error while doing that action.\n-# Interaction: \`${interactionId}\` • Error Type: \`MODAL/RUN_ERROR\``
        ),
      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
}
