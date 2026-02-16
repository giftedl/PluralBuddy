import type { PGuild } from "plurography";
import { BaseResource, CacheFrom } from "seyfert";
import type { MakeDeepPartial } from "seyfert/lib/common";

type PluralGuildObject = {
	g: PGuild;
	lastDrip: Date;
};

export class PGuildCache extends BaseResource<PluralGuildObject> {
	override namespace = "pb-guild";

	override set(
		from: CacheFrom,
		id: string,
		data: MakeDeepPartial<PluralGuildObject, "lastDrip">,
	) {
		return super.set(from, id, {
			...data,
			lastDrip: data.lastDrip ?? Date.now(),
		});
	}
}
