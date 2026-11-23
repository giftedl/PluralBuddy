/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, FileExclamationPoint } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { toast } from "sonner";
import { scopeList } from "@/components/devs/create-new-app-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/shadcn-button";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";
import { m } from "@/paraglide/messages";
import { AuthorizationCardContent } from "@/components/auth/authorization-card-content";

export default function ConsentPage() {
  const params = useSearchParams();

  const { resolvedTheme } = useTheme();
  const { data, status } = useQuery({
    queryKey: [`application-${params.get("client_id")}`],
    queryFn: async () =>
      authClient.oauth2.publicClient({
        query: { client_id: params.get("client_id") ?? "" },
      }),
  });

  // Submit consent with the code in the request body
  const scopes = params.get("scope")?.split(" ");

  if (data !== undefined && "message" in data) return <>{m["ConsentPage.invalid_app"]()}</>;
  if (data !== undefined && !("data" in data)) return <>{m["ConsentPage.invalid_app"]()}</>;

  return (
    <div className="grid w-full flex-grow relative items-center justify-center px-4">
      {status === "success" && (
        <Card className="w-full space-y-5 z-10 justify-center rounded-2xl p-8 sm:w-96">
          {data.data && (
            <AuthorizationCardContent
              data={data}
              scopes={scopes ?? []}
              handlerResponse={{ type: "oauth2" }}
            />
          )}
        </Card>
      )}
      <Dithering
        className="w-screen h-screen absolute"
        colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
        colorFront="#7287fd"
        shape="warp"
        type="4x4"
        size={2}
        speed={1}
        scale={0.6}
      />
    </div>
  );
}
