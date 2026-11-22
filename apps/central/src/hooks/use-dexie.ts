import { createDexie, db, profileCacheDexieCollection, systemDexieCollection } from "#/logic/dexie";

export function useDexie() {
  if (!db) createDexie();

  return { db, profileCache: profileCacheDexieCollection, systems: systemDexieCollection };
}
