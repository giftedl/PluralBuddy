import { fixDiscordHeaders } from "@/lib/fix-discord-headers";
import { useEffect } from "react";

export function CorrectHeaderFixer() {
    useEffect(() => {
        fixDiscordHeaders()
    })

    return null;
}