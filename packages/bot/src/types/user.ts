/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { defaultUserStructure, type PUser } from "plurography";
import { userCollection } from "../mongodb";

export { defaultUserStructure, type PUser, PUserObject } from "plurography";

export const terminologyMemoryCache: Record<string, string> = {};

export async function getUserById(id: string): Promise<PUser> {
    return await userCollection.findOne({ userId: id }) ?? defaultUserStructure(id);
}

export async function writeUserById(id: string, userObj: PUser) {
    return await userCollection.findOneAndReplace({ userId: id }, userObj, { upsert: true });
}