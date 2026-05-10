import { MongoClient } from "mongodb";
import ora from "ora";
import { type PUser, type PGuild } from "plurography";
import { parseArgs } from "util";

const { values } = parseArgs({
    args: Bun.argv,
    options: {
        dbName: {
            type: "string",
        },
    },
    strict: true,
    allowPositionals: true,
});

if (!values.dbName) throw new Error("no db name")

const mongodb = new MongoClient(process.env.MONGO as string);
const canaryDb = mongodb.db(values.dbName);

await canaryDb.collection<PGuild>("guilds")
    .updateMany({ $or: [{ blacklistedCategories: { $exists: true } }, { blacklistedRoles: { $exists: true } }, { blacklistedChannels: { $exists: true } }] }, {
        $rename: {
            "blacklistedCategories": "blockedCategories",
            "blacklistedRoles": "blockedRoles",
            "blacklistedChannels": "blockedChannels",
        }
    })
await canaryDb.collection<PUser>("users")
    .updateMany({ $or: [{ blacklisted: { $exists: true } }]}, {
        $rename: {
            "blacklisted": "blocked"
        }
    })

await mongodb.close()