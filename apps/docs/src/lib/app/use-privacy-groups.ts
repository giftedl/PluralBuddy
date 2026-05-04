import {db} from "@/lib/app/dexie";
import { useLiveQuery } from "dexie-react-hooks"

export function usePrivacyGroups() {
    const data = useLiveQuery(async () => {
        return db.privacyGroups
            .where("system")
            .equals("@me")
            .toArray();
    });

    return {data, isPending: false, isLoading: false};
}