/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { operationCollection } from "../mongodb";
import type { POperation } from "plurography";
export { operationStringGeneration, assetStringGeneration, POperationObj, type POperation } from "plurography";

export async function getOperationById(id: string): Promise<POperation | null> { 
    return await operationCollection.findOne({ id });
}