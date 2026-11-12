import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useDexie } from "../hooks/use-dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { getProfileData, type CentralProfile } from "#/logic/api";
import { v4 } from "uuid";
import { useQuery } from "@tanstack/react-query";

type AuthCtx = {
  profile: CentralProfile | null | undefined;
};

export const AuthenticationContext = createContext<AuthCtx>({
  profile: undefined,
});

export function useAuthCtx() {
  const ctx = useContext(AuthenticationContext);
  return ctx;
}

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const { profileCache } = useDexie();
  const { data: profile } = useQuery({
    queryFn: async () => {
      const cacheArray = await profileCache.toArray();
      const existingCache = (cacheArray ?? []).length;

      if (existingCache === 0) {
        const profile = await getProfileData().catch(_ => null);
        if (profile === null)
          return null;
        profileCache.add({ id: v4(), ...profile, date: new Date() });
        return profile;
      } else return ((cacheArray ?? [])[0] as CentralProfile) ?? null;
    },
    queryKey: ["profile"],
  });

  return (
    <AuthenticationContext value={{ profile }}>{children}</AuthenticationContext>
  );
}
