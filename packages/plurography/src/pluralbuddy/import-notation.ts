import z from "zod";
import { PSystemObject } from "./system";
import { PAlterObject } from "./alter";
import { PTagObject } from "./tag";

export const ImportNotation = z
	.object({
		system: PSystemObject,
		alters: PAlterObject.array(),
		tags: PTagObject.array(),
	})
	.refine(
		(data) => {
			// Check that all alters have unique names
			const alterNames = data.alters.map(
				(alter) => alter.username?.toLowerCase?.().trim?.() ?? "",
			);
			const uniqueAlterNames = new Set(alterNames);

			return alterNames.length === uniqueAlterNames.size;
		},
		{ error: "All alters must be unique" },
	)
	.refine(
		(data) => {
			// Check that all tags have unique names
			const tagNames = data.tags.map(
				(tag) => tag.tagFriendlyName?.toLowerCase?.().trim?.() ?? "",
			);
			const uniqueTagNames = new Set(tagNames);

			return tagNames.length === uniqueTagNames.size;
		},
		{ error: "All tags must be unique" },
	);
