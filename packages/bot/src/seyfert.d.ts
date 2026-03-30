/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { ParseGlobalMiddlewares, ParseMiddlewares, ParseClient, Client, ParseLocales } from "seyfert";
import type { extendedContext } from "./extended-context";
import type { middlewares } from "./middleware";
import type { StatisticResource } from "./cache/statistics";
import type { ProxyResource } from "./cache/system-proxy-tags";
import type { SimilarWebhookResource } from "./cache/similar-webhooks";
import type { PGuildCache } from "./cache/plural-guild";
import type { Pi18nCache } from "./cache/i18n";
import type English from './i18n/en';


declare module "seyfert" {
	interface ExtendContext extends ReturnType<typeof extendedContext> {}
	interface Cache {
		statistic: StatisticResource;
		alterProxy: ProxyResource;
		similarWebhookResource: SimilarWebhookResource;
		pguild: PGuildCache;
		i18n: Pi18nCache;
	}

	interface UsingClient extends ParseClient<Client<true>> {}

	// Register the middlewares on seyfert types
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof middlewares> {}
	interface GlobalMetadata extends ParseGlobalMiddlewares<typeof middlewares> {}

	interface DefaultLocale extends ParseLocales<typeof English> { }
}
