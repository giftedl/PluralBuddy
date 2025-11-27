import { authClient } from "@/lib/auth-client";
import type { ReactNode } from "react";

export function SignedIn({ children }: { children: ReactNode }) {
    const session = authClient.useSession()
    
    if (session.data?.user !== undefined)
        return children;

    return null;
}

export function SignedOut({ children }: { children: ReactNode }) {
    const session = authClient.useSession()
    
    if (session.data?.user === undefined)
        return children;

    return null;
}