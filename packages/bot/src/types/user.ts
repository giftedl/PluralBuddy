/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { userCollection } from "../mongodb";
import { defaultUserStructure, type PUser } from "plurography";
export { PUserObject, defaultUserStructure, type PUser } from "plurography";

export async function getUserById(id: string): Promise<PUser> {
    return await userCollection.findOne({ userId: id }) ?? defaultUserStructure(id);
}

export async function writeUserById(id: string, userObj: PUser) {
    return await userCollection.findOneAndReplace({ userId: id }, userObj, { upsert: true });
}