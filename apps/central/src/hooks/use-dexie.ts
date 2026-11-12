import { createDexie, db, profileCacheDexieCollection } from "#/logic/dexie";

export function useDexie() {
  if (!db) createDexie();

  return { db, profileCache: profileCacheDexieCollection };
}
