import { parseArgs } from "node:util";
import { possibleConverters } from "plurography/dist/converters";
import { getPipedContentsAsPromise } from "./pipe-contents";

const { values } = parseArgs({
	args: Bun.argv,
	options: {
		path: {
			type: "string",
			short: "p",
		},
	},
	strict: true,
	allowPositionals: true,
});

const [initial, newPath] = (values.path ?? "").split("-");

if (!initial || !newPath)
	throw new Error(
		"Invalid arguments - you need both an initial and new path separated by a dash",
	);

const possiblePaths = [...Object.keys(possibleConverters)];

if (!possiblePaths.includes(initial) || !possiblePaths.includes(newPath))
	throw new Error("Not a valid export path.");

const data = await getPipedContentsAsPromise();
const parsed = await (async () => JSON.parse(data))().catch(v => {
    throw new Error("Couldn't parse input.")
});

const input = possibleConverters[initial];
const output = possibleConverters[newPath];

if (!input || !output)
	throw new Error("Not a valid export path.");

const parsedSystem = input.parserZod.parse(parsed)

// convert to pluralbuddy
const pluralbuddySystem = (new input.converter()).toImport(parsedSystem);
const convertedSystem = (new output.converter()).fromImport(pluralbuddySystem)

process.stdout.write(JSON.stringify(convertedSystem))