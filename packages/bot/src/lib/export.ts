/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PSystemObject, type PSystem } from "../types/system";
import { PAlterObject } from "../types/alter";
import { alterCollection, tagCollection } from "../mongodb";
import { PTagObject } from "@/types/tag";

export const ImportNotation = z.object({
    system: PSystemObject,
    alters: PAlterObject.array(),
    tags: PTagObject.array()
}).refine((data) => {
    // Check that all alters have unique names
    const alterNames = data.alters.map(alter => alter.username?.toLowerCase?.().trim?.() ?? "");
    const uniqueAlterNames = new Set(alterNames);

    return alterNames.length === uniqueAlterNames.size;
}, { error: "All alters must be unique" }).refine((data) => {
    // Check that all tags have unique names
    const tagNames = data.tags.map(tag => tag.tagFriendlyName?.toLowerCase?.().trim?.() ?? "");
    const uniqueTagNames = new Set(tagNames);

    return tagNames.length === uniqueTagNames.size;
}, { error: "All tags must be unique" })

export async function buildExportPayload(system: PSystem) {
    const alters = await alterCollection.find({ systemId: system.associatedUserId }).toArray()
    const tags = await tagCollection.find({ systemId: system.associatedUserId }).toArray()

    return JSON.stringify(
        {
            system,
            alters,
            tags
        }
    )
}