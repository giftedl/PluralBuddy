/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PSystemObject, type PSystem } from "../types/system";
import { PAlterObject } from "../types/alter";
import { alterCollection, tagCollection } from "../mongodb";
import { PTagObject } from "@/types/tag";

export { ImportNotation } from "plurography";

export async function buildExportPayload(system: PSystem) {
	const alters = await alterCollection
		.find({ systemId: system.associatedUserId })
		.toArray();
	const tags = await tagCollection
		.find({ systemId: system.associatedUserId })
		.toArray();

	return JSON.stringify({
		system,
		alters,
		tags,
	});
}
