import z from "zod";
import { OpenPluralAsset } from "./asset";
import { OpenPluralCustomField } from "./custom-field";
import { OpenPluralCustomFieldValue } from "./custom-field-value";
import { OpenPluralGroup } from "./group";
import { OpenPluralGroupMembership } from "./group-membership";
import { OpenPluralMember } from "./member";
import { OpenPluralNote } from "./note";
import { OpenPluralPrivacy } from "./privacy";
import { OpenPluralSourceRef } from "./source-ref";
import { OpenPluralSystem } from "./system";
import { OpenPluralTaxonomyAssignment } from "./taxonomy-assignment";
import { OpenPluralTaxonomyTerm } from "./taxonomy-term";
import { OpenPluralWarning } from "./warning";

export const OpenPluralExport = z.object({
	openplural_version: z.literal("0.1"),
	exported_at: z.coerce.date(),
	producer: z.object({
		app: z.string(),
		app_version: z.string().default(""),
		app_id: z.string().default(""),
		exporter_version: z.string().default(""),
	}),
	capabilities: z.object({
		modules: z
			.enum([
				"systems",
				"members",
				"groups",
				"taxonomy",
				"custom_fields",
				"front_periods",
				"front_events",
				"front_comments",
				"notes",
				"assets",
				"chat",
				"boards",
				"relationships",
				"polls",
				"reminders",
				"habits",
				"proxy",
				"sharing",
				"safety",
			])
			.array(),
	}),
	systems: OpenPluralSystem.array(),
	members: OpenPluralMember.array(),
	groups: OpenPluralGroup.array(),
	group_memberships: OpenPluralGroupMembership.array(),
	taxonomy_terms: OpenPluralTaxonomyTerm.array(),
	taxonomy_assignments: OpenPluralTaxonomyAssignment.array(),
	custom_fields: OpenPluralCustomField.array(),
	custom_field_values: OpenPluralCustomFieldValue.array(),
    
	front_periods: z.unknown(),
    front_events: z.unknown(),
    front_comments: z.unknown(),

	notes: OpenPluralNote.array(),
    assets: OpenPluralAsset.array(),
    extensions: z.record(z.string(), z.unknown()),
    warnings: OpenPluralWarning.array(),
    source_refs: OpenPluralSourceRef.array(),
    privacy: OpenPluralPrivacy,
});