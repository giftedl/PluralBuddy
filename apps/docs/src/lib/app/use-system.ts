import {useQuery} from "@tanstack/react-query";
import {db} from "@/lib/app/dexie";

export function useSystem() {
    const data = useQuery({
        queryKey: ["system/@me"],
        queryFn: async () => await db.systems.get("@me"),
    });

    return data;
}