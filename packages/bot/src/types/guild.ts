/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { CacheFrom } from "seyfert";
import { client } from "..";
import { guildCollection } from "../mongodb";
import { PGuildObject, type PGuild } from "plurography";
export {
	defaultPrefixes,
	PGuildObject,
	defaultGuildStructure,
	type PGuild,
} from "plurography";

const defaultGuildStructure = (guildId: string) => {
	return PGuildObject.parse({ guildId });
};

export async function getGuildFromId(id: string): Promise<PGuild> {
	const guild =
		(await guildCollection.findOne({ guildId: id })) ??
		defaultGuildStructure(id);
	client.cache.pguild.set(CacheFrom.Gateway, guild.guildId, { g: guild });

	return PGuildObject.parse(guild);
}
