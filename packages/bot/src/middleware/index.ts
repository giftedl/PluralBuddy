/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { administrativeGuildPermissions } from "./administrative-guild-permissions.middleware";
import { blacklistUserMiddleware } from "./blacklist.middleware";
import { ensureGuildPermissions } from "./ensure-guild-permissions.middleware";
import { noWebhookMiddleware } from "./no-webhook.middleware";
import { serverBlacklist } from "./server-blacklist.middleware";

export const middlewares = {
    blacklistUserMiddleware,
    noWebhookMiddleware,
    ensureGuildPermissions,
    administrativeGuildPermissions,
    serverBlacklist
}