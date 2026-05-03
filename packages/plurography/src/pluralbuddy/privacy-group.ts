import {PSystemObject} from "@/pluralbuddy/system.ts";
import z from "zod";
import {PField} from "./field.ts";

export const PPrivacyGroupObject = z.object({
    id: z.string(),
    system: z.string(),

    name: z.string(),
    attachedUsers: z.string().array(),

    permissions: z.object({
        alter: z.number().nonnegative(),
        tag: z.number().nonnegative(),
        system: z.number().nonnegative(),
    }),
    color: z.string(),

    fields: PField.array()
})

export type PPrivacyGroup = z.infer<typeof PPrivacyGroupObject>