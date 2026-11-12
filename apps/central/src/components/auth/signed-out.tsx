import { useAuthCtx } from "#/logic/auth-ctx";
import type { ReactNode } from "react";

export function SignedOut({ children }: { children: ReactNode }) {
    const { profile } = useAuthCtx();

    if (profile !== null)
        return null;

    return children;
}