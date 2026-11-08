import { Dexie, type Table } from "dexie";

export let profileCacheDexieCollection: Table;
export let db: Dexie;

export function createDexie() {
	db = new Dexie("central");

	db.version(1).stores({
		profileCache: "id, sub, name, picture, date",
	});

	profileCacheDexieCollection = db.table("profileCache")
}
