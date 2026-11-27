import { OpenPluralConverter, OpenPluralExport } from "plurography";
import z from "zod";
import { ImportEntry, ImportOutput } from ".";
import { userCollection } from "../../mongodb";
import PluralBuddy from "./pluralbuddy";

const OpenPluralImportEntry = z.object({
	existing: ImportEntry,
	import: OpenPluralExport,
});
export type OPEntry = z.infer<typeof OpenPluralImportEntry>;

const converter = new OpenPluralConverter();

type NormalizedInput = Parameters<typeof PluralBuddy.add>[0];

function convert(input: OPEntry) {
	const { existing, import: openPlural } = OpenPluralImportEntry.parse(input);
	return {
		existing,
		import: converter.toImport(openPlural, existing.userId),
	};
}

async function run(
	input: OPEntry,
	action: (input: NormalizedInput) => Promise<z.infer<typeof ImportOutput>>,
) {
	const normalized = convert(input);
	const result = await action(normalized);
	const system = normalized.import.system;

	if (!system) throw new Error("OpenPlural export contains no system.");

	const update = await userCollection.updateOne(
		{ userId: normalized.existing.userId },
		{
			$set: {
				"system.systemName": system.systemName,
				"system.systemDescription": system.systemDescription ?? "",
				"system.systemDisplayTag": system.systemDisplayTag ?? null,
				"system.systemAvatar": system.systemAvatar ?? null,
				"system.systemBanner": system.systemBanner ?? null,
			},
		},
	);

	if (update.matchedCount === 0)
		throw new Error("System not found while importing OpenPlural data.");

	return result;
}

export async function add(input: OPEntry): Promise<z.infer<typeof ImportOutput>> {
	return run(input, PluralBuddy.add);
}

export async function replace(
	input: OPEntry,
): Promise<z.infer<typeof ImportOutput>> {
	return run(input, PluralBuddy.replace);
}

export async function both(
	input: OPEntry,
): Promise<z.infer<typeof ImportOutput>> {
	return run(input, PluralBuddy.both);
}

export async function deleteM(
	input: OPEntry,
): Promise<z.infer<typeof ImportOutput>> {
	return run(input, PluralBuddy.deleteM);
}

export default {
	add,
	replace,
	both,
	deleteM,
};
