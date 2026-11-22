import { Dexie, type Table } from "dexie";
import { PSystemObject, type PSystem } from "plurography";

export type OwnedEntry<V> = { sessionOwned: boolean } & V

export let profileCacheDexieCollection: Table<ProfileCacheEntry>;
export let systemDexieCollection: Table<PSystem>;
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
    system: "++associatedUserId, " + Object.keys(PSystemObject.shape).join(", ")
  });

  profileCacheDexieCollection = db.table("profileCache");
  systemDexieCollection = db.table("system");
}
