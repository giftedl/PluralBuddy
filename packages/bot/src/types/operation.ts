/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { operationCollection } from "../mongodb";
import { PSystemObject, type PSystem } from "./system";

export function operationStringGeneration(len: number) {
    let text = "";
    
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    for (let i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}

export function assetStringGeneration(len: number) {
    let text = "";
    
    const charset = "abcdefghijklmnopqrstuvwxyz012345678901234567890123456789";
    
    for (let i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}

export const POperationObj = z.object({
    id: z.string(),

    oldSystem: PSystemObject.partial(),
    changedOperation: PSystemObject.partial(),
    changedOperationStrings: z.array(PSystemObject.keyof()),

    createdAt: z.date()
})

export type POperation = z.infer<typeof POperationObj>

export async function getOperationById(id: string): Promise<POperation | null> { 
    return await operationCollection.findOne({ id });
}