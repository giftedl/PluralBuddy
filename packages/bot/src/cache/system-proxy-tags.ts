import { BaseResource, type CacheFrom } from "seyfert";
import type { MakeDeepPartial } from "seyfert/lib/common";

type ProxyObject = {
    pt: { p: string, s: string }[],
    lastDrip: Date
}

export class ProxyResource extends BaseResource<ProxyObject> {

    override namespace = 'pb-system-tag';

    override set(from: CacheFrom, id: string, data: MakeDeepPartial<ProxyObject, 'lastDrip'>) {
        return super.set(from, id, { ...data, lastDrip: data.lastDrip ?? Date.now() });
    }
}