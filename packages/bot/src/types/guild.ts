/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { guildCollection } from "../mongodb";
import { PGuildObject, type PGuild } from "plurography";
export { defaultPrefixes, PGuildObject, defaultGuildStructure, type PGuild } from "plurography";

const defaultGuildStructure = (guildId: string) => {
    return PGuildObject.parse({ guildId })
}

export async function getGuildFromId(id: string): Promise<PGuild> {
    return PGuildObject.parse(await guildCollection.findOne({ guildId: id }) ?? defaultGuildStructure(id))  ;
}