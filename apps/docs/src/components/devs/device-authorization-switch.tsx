"use client";

import { DEVICE_CODE_GRANT_TYPE, OAuthClient } from "@better-auth/oauth-provider";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export function DeviceAuthorizationSwitch({ application }: { application: OAuthClient }) {
  const [enabled, setEnabled] = useState<boolean>(
    application.grant_types?.includes(DEVICE_CODE_GRANT_TYPE) ?? false,
  );
  const changeDeviceAuthorizationStatus = useMutation({
    mutationFn: async () => {
      await authClient.oauth2.updateClient({
        client_id: application.client_id,
        update: {
          grant_types: [
            ...new Set([
              ...(enabled ? [DEVICE_CODE_GRANT_TYPE] : []),
              ...((application.grant_types ?? []).filter(v => v !== DEVICE_CODE_GRANT_TYPE)),
            ]),
          ],
        },
      });
    },
  });

  useEffect(() => changeDeviceAuthorizationStatus.mutate(), [enabled]);

  return <Switch checked={enabled} onCheckedChange={setEnabled} />;
}
