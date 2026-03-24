import type { PGuild } from "plurography";
import { BaseResource, CacheFrom } from "seyfert";
import type { MakeDeepPartial } from "seyfert/lib/common";

type Plurali18nObject = {
	l: string;
	lastDrip: Date;
};

export class Pi18nCache extends BaseResource<Plurali18nObject> {
	override namespace = "pb-i18n";

	override set(
		from: CacheFrom,
		id: string,
		data: MakeDeepPartial<Plurali18nObject, "lastDrip">,
	) {
		return super.set(from, id, {
			...data,
			lastDrip: data.lastDrip ?? Date.now(),
		});
	}
}
