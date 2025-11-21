/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { BaseResource, type CacheFrom } from 'seyfert/lib/cache';
import type { MakeDeepPartial } from 'seyfert/lib/common';

type StatisticObject = {
    guildCount: number,
    userCount: number,
    lastDrip: Date
}

export class StatisticResource extends BaseResource<StatisticObject> {
    // The namespace is the base that separates each resource
    override namespace = 'pb-statistic';
 
    // We override set to apply the typing and format we want
    override set(from: CacheFrom, id: string, data: MakeDeepPartial<StatisticObject, 'lastDrip'>) {
        return super.set(from, id, { ...data, lastDrip: data.lastDrip ?? Date.now() });
    }
}