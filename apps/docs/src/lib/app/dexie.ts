import { Dexie, Table } from "dexie";
import {PSystem, PSystemObject, PPrivacyGroup, PPrivacyGroupObject} from "plurography";

class PluralBuddyLocalDB extends Dexie {
    systems: Dexie.Table<PSystem, string>;
    privacyGroups: Dexie.Table<PPrivacyGroup, string>

    constructor(databaseName: string) {
        super(databaseName);

        this.version(1).stores({
            systems: `++associatedUserId,${Object.keys(PSystemObject._zod.def.shape).filter(v => v !== "associatedUserId").join(",")}`,
            privacyGroups: `++id,${Object.keys(PPrivacyGroupObject._zod.def.shape).filter(v => v !== "id").join(",")}`
        });

        this.systems = this.table('systems');
        this.privacyGroups = this.table('privacyGroups');
    }
}

export const db = new PluralBuddyLocalDB("PluralBuddy")
