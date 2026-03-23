/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PSystemObject, type PSystem } from "./system";
import { PAlterObject } from "./alter";

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

export const PAlterOperationObj = z.object({
  id: z.string(),
  changedAlterId: z.number(),
  oldAlter: PAlterObject.partial(),
  changedOperation: PAlterObject.partial(),
  changedOperationStrings: z.array(PAlterObject.keyof()),
  createdAt: z.date()
})

export type POperation = z.infer<typeof POperationObj>
export type PAlterOperation = z.infer<typeof PAlterOperationObj>
