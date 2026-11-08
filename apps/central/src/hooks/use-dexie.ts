import { createDexie, db, profileCacheDexieCollection } from "#/logic/dexie";

export function useDexie() {
    console.log(db)
	if (!db) createDexie();

	return { db, profileCache: profileCacheDexieCollection };
}
