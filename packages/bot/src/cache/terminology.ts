import type { PGuild } from "plurography";
import { BaseResource, CacheFrom } from "seyfert";
import type { MakeDeepPartial } from "seyfert/lib/common";

type PluralTerminologyObject = {
    // JSON-encoded string w/ all terminology
    terms: string;
    lastDrip: Date;
};

export class PTerminologyCache extends BaseResource<PluralTerminologyObject> {
    override namespace = "pb-terminology";

    override set(
        from: CacheFrom,
        id: string,
        data: MakeDeepPartial<PluralTerminologyObject, "lastDrip">,
    ) {
        return super.set(from, id, {
            ...data,
            lastDrip: data.lastDrip ?? Date.now(),
        });
    }
}
