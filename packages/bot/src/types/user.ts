/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
  defaultNudgingStructure,
  defaultUserStructure,
  PUserObject,
  type PUser,
} from "plurography";
import { userCollection } from "../mongodb";

export { defaultUserStructure, type PUser, PUserObject } from "plurography";

export const terminologyMemoryCache: Record<string, string> = {};

export async function getUserById(id: string): Promise<PUser> {
  const user = await userCollection.findOne({ userId: id });

  return user
    ? { ...user, nudging: { ...defaultNudgingStructure(), ...user.nudging } }
    : defaultUserStructure(id);
}

export async function writeUserById(id: string, userObj: PUser) {
  return await userCollection.findOneAndReplace({ userId: id }, PUserObject.parse(userObj), {
    upsert: true,
  });
}
