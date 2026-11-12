import { Dexie, type Table } from "dexie";

export let profileCacheDexieCollection: Table<ProfileCacheEntry>;
export let db: Dexie;

export type ProfileCacheEntry = {
  id: string;
  sub: string;
  name?: string;
  picture?: string;
  date: Date;
};

export function createDexie() {
  db = new Dexie("central");

  db.version(1).stores({
    profileCache: "++id, sub, name, picture, date",
  });

  profileCacheDexieCollection = db.table("profileCache");
}
