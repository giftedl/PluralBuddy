import { z } from "zod";

export const PTerminology = z.object({
	alters: z.string().max(15).default("alter"),
	alters_plural: z.string().max(15).default("alters"),
	tags: z.string().max(15).default("tag"),
	tags_plural: z.string().max(15).default("tags"),
	system: z.string().max(15).default("system"),
	system_plural: z.string().max(15).default("systems"),
}).optional();
export type PTerminology = z.infer<typeof PTerminology>;