import { Dexie, Table } from "dexie";
import { PSystem, PSystemObject } from "plurography";


class PluralBuddyLocalDB extends Dexie {
    systems: Dexie.Table<PSystem, string>;

    constructor(databaseName: string) {
        super(databaseName);

        this.version(1).stores({
            systems: `++associatedUserId,${Object.keys(PSystemObject._zod.def.shape).filter(v => v !== "associatedUserId").join(",")}`
        });

        this.systems = this.table('systems');
    }
}

export const db = new PluralBuddyLocalDB("PluralBuddy")
