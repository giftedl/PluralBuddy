/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { alterCollection } from "../mongodb";
import type { PAlter } from "plurography";
export { AlterProtectionFlags, PAlterObject, type PAlter } from "plurography";

export async function getAlterById(id: string): Promise<PAlter | null> {
  return await alterCollection.findOne({ userId: id });
}
