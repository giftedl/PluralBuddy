import { type UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { cache, useEffect, useState } from "react";
import { v4 } from "uuid";
import { type CentralProfile, getProfileData, serverUrl } from "#/logic/api";
import { type ProfileCacheEntry, profileCacheDexieCollection } from "#/logic/dexie";
import type { AnyValidPathname } from "#/types/router-utils";
import { useDexie } from "./use-dexie";
import { useAuthCtx } from "../logic/auth-ctx";

export function useAuth() {
  const router = useRouter();
  const { profile } = useAuthCtx();

  return {
    login: ({ redirectUri }: { redirectUri?: AnyValidPathname | undefined }) => {
      if (redirectUri) sessionStorage.setItem("central.redirect-uri", redirectUri);

      window.navigation.navigate(`${serverUrl}/api/v1/authentication/to-login`);
    },
    callback: () => {
      const sessionRedirect = sessionStorage.getItem("central.redirect-uri");

      if (!sessionRedirect) router.navigate({ to: "/" });

      sessionStorage.removeItem("central.redirect-uri");
      router.navigate({ to: sessionRedirect ?? undefined });
    },
    profile,
  };
}
