/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { Client, ParseClient, ParseGlobalMiddlewares, ParseLocales, SeyfertRegistry } from "seyfert";
import type { Pi18nCache } from "./cache/i18n";
import type { PGuildCache } from "./cache/plural-guild";
import type { SimilarWebhookResource } from "./cache/similar-webhooks";
import type { StatisticResource } from "./cache/statistics";
import type { ProxyResource } from "./cache/system-proxy-tags";
import type { PTerminologyCache } from "./cache/terminology";
import type { extendedContext } from "./extended-context";
import type English from './i18n/en';
import type { middlewares } from "./middleware";


declare module "seyfert" {
	interface SeyfertRegistry {
		client: ParseClient<Client<true>>;
		middlewares: typeof middlewares;
		langs: ParseLocales<typeof English>;
	} 


	interface ExtendContext extends ReturnType<typeof extendedContext> {}
	interface Cache {
		statistic: StatisticResource;
		alterProxy: ProxyResource;
		similarWebhookResource: SimilarWebhookResource;
		pguild: PGuildCache;
		terminology: PTerminologyCache;
		i18n: Pi18nCache;
	}
	interface GlobalMetadata extends ParseGlobalMiddlewares<typeof middlewares> {}
}
