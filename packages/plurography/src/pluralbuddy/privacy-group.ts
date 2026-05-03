import {PSystemObject} from "@/pluralbuddy/system.ts";
import z from "zod";
import {PField} from "@/pluralbuddy/field.ts";

export const PPrivacyGroupObject = z.object({
    id: z.string(),
    system: z.string(),

    name: z.string(),
    attachedUsers: z.string().array(),

    fields: PField.array()
})

export type PPrivacyGroup = z.infer<typeof PPrivacyGroupObject>