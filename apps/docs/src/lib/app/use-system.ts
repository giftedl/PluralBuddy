import {useQuery} from "@tanstack/react-query";
import {db} from "@/lib/app/dexie";
import { useLiveQuery } from "dexie-react-hooks"

export function useSystem() {
    const data = useLiveQuery(async () => {
        return await db.systems.get("@me");
    });

    return {data, isPending: false, isLoading: false};
}