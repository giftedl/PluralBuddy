import type { CentralProfile } from "#/logic/api";
import { useAuthCtx } from "#/logic/auth-ctx";
import type { ReactNode } from "react";

export function SignedIn({children}: { children: ReactNode | ((profile: CentralProfile) => ReactNode) }) {
    const { profile } = useAuthCtx();

    if (profile !== null && profile !== undefined)
        return typeof children === "function" ? children(profile) : children;

    return null;
}