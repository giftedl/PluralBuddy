/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { ParseGlobalMiddlewares, ParseMiddlewares } from "seyfert";
import type { extendedContext } from "./extended-context";
import type { middlewares } from "./middleware";
import type { StatisticResource } from "./cache/statistics";
import type { ProxyResource } from "./cache/system-proxy-tags"
import type { SimilarWebhookResource } from "./cache/similar-webhooks";

declare module "seyfert" {
	interface ExtendContext extends ReturnType<typeof extendedContext> {}
	interface Cache {
		statistic: StatisticResource;
		alterProxy: ProxyResource;
		similarWebhookResource: SimilarWebhookResource;
	}

	// Register the middlewares on seyfert types
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof middlewares> {}
	interface GlobalMetadata extends ParseGlobalMiddlewares<typeof middlewares> {}
}
