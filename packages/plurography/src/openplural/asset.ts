import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralAsset = z.object({
	id: z.uuid(),
	kind: z.enum([
		"avatar",
		"banner",
		"image",
		"audio",
		"video",
		"file",
		"thumbnail",
		"unknown",
	]),
	mime_type: z.string().nullable(),
	file_name: z.string().nullable(),
	uri: z.string().nullable(),
	data_base64: z.string().nullable(),
	data_uri: z.string().nullable(),
	size_bytes: z.number().nullable(),
	sha256: z.string().nullable(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    duration_ms: z.number().nullable(),
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
});
