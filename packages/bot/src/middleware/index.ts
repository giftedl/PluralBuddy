/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { administrativeGuildPermissions } from "./administrative-guild-permissions.middleware";
import { blacklistUserMiddleware } from "./blocked.middleware";
import { ensureGuildPermissions } from "./ensure-guild-permissions.middleware";
import { latency } from "./latency.middleware";
import { noWebhookMiddleware } from "./no-webhook.middleware";
import { serverBlock } from "./server-blacklist.middleware";

export const middlewares = {
    latency,
    blacklistUserMiddleware,
    noWebhookMiddleware,
    ensureGuildPermissions,
    administrativeGuildPermissions,
    serverBlock
}