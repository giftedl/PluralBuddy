import { parseArgs } from "node:util";
import { possibleConverters } from "plurography";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        path: {
            type: "string",
        },
    },
    strict: true,
    allowPositionals: true,
});

const [initial, newPath] = (values.path ?? "").split("-")

if (!initial || !newPath)
    throw new Error("Invalid arguments - you need both an initial and new path separated by a dash")

const possiblePaths = Object.values(possibleConverters);