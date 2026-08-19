import z from "zod";
import { OpenPluralSourceRef } from "../source-ref";
import { OpenPluralFrontAssignment } from "./front-assignment";

export const OpenPluralFrontPeriod = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	started_at: z.coerce.date(),
	ended_at: z.coerce.date(),
	assignments: OpenPluralFrontAssignment.array(),
	status: z.string().nullable(),
	note: z.string().nullable(),
	source_kind: z.enum([
		"interval",
		"event_pair",
		"tiered",
		"grouped",
		"unknown",
	]),
	source_refs: OpenPluralSourceRef.array(),
	extensions: z.record(z.string(), z.unknown()),
});
