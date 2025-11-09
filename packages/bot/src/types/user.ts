/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { userCollection } from "../mongodb";
import { PSystemObject, type PSystem } from "./system";

export const PUserObject = z.object({
    userId: z.string(),

    system: PSystemObject.optional(),
    blacklisted: z.boolean().default(false)
})

export type PUser = z.infer<typeof PUserObject>

const defaultUserStructure = (userId: string) => {
    return {
        userId,
        blacklisted: false
    } satisfies PUser
}

export async function getUserById(id: string): Promise<PUser> {
    return await userCollection.findOne({ userId: id }) ?? defaultUserStructure(id);
}

export async function writeUserById(id: string, userObj: PUser) {
    return await userCollection.findOneAndReplace({ userId: id }, userObj, { upsert: true });
}