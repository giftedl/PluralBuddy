import type { PSystem } from "plurography";
import { useEffect, useState } from "react";
import { useDexie } from "./use-dexie";
import { useQuery } from "@tanstack/react-query";
import { getSystemData } from "#/logic/api";
import { useLiveQuery } from "dexie-react-hooks";

export function useSystem({ systemId }: { systemId: "@me" | string } = { systemId: "@me" }) {
  const { systems } = useDexie();
  const systemStored = useLiveQuery(() => systems.get(systemId))
  const { data: system, } = useQuery({
    queryFn: async () => getSystemData({ systemId }),
    queryKey: [`system/${systemId}`],
  });
  

  useEffect(() => {
    systems.upsert(systemId, {...system, associatedUserId: systemId});
  }, [system])

  return system ?? systemStored;
}
