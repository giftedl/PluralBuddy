import { useAuthCtx } from "#/logic/auth-ctx";
import type { ReactNode } from "react";

export function LoadingProfileState({ children }: { children: ReactNode }) {
    const { profile } = useAuthCtx();

    if (profile === undefined)
        return children;

    return null;
}