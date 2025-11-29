/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { blacklistUserMiddleware } from "./blacklist.middleware";
import { noWebhookMiddleware } from "./no-webhook.middleware";

export const middlewares = {
    blacklistUserMiddleware,
    noWebhookMiddleware
}