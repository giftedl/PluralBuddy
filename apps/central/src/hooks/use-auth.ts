import { useQuery } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { getProfileData, serverUrl } from "#/logic/api";
import { profileCacheDexieCollection } from "#/logic/dexie";
import type { AnyValidPathname } from "#/types/router-utils";
import { useDexie } from "./use-dexie";

export function useAuth() {
    const router = useRouter();
    const { profileCache } = useDexie();
    const profileCacheExists = useLiveQuery(
        () => profileCache.toArray()
    );
    const profile = useQuery({
        enabled: (profileCacheExists ?? []).length === 0,
        queryKey: ["profile"],
        queryFn: async () => await getProfileData()
    })

    return {
        login: ({ redirectUri }: { redirectUri?: AnyValidPathname | undefined }) => {
            if (redirectUri)
                sessionStorage.setItem("central.redirect-uri", redirectUri)

            window.navigation.navigate(`${serverUrl}/api/v1/authentication/to-login`)
        },
        callback: () => {
            const sessionRedirect = sessionStorage.getItem("central.redirect-uri")
        

            if (!sessionRedirect)
                router.navigate({ to: "/" })

            sessionStorage.removeItem("central.redirect-uri");
            router.navigate({ to: sessionRedirect ?? undefined })
        },
        profile: () => {
            return profile.data;
        }
    }
}