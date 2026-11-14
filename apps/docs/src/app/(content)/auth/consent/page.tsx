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

export default function ConsentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const session = authClient.useSession();

  const [loading, setLoading] = useState(false);

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
          <header className="text-center">
            <div className="flex items-center justify-center">
              <div className="relative flex items-center">
                <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-primary shadow-lg ring-4 ring-card">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="/image/pfp.png" alt="Solar" />
                    <AvatarFallback>PluralBuddy</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <h1 className="mt-6 text-xl font-medium tracking-tight">
              {m["ConsentPage.title"]({
                client_name: data.data?.client_name ?? "?",
              })}
            </h1>
            <span className="text-sm text-muted-foreground">
              {m["ConsentPage.signed_in_as"]({
                username: `@${session.data?.user.name}`,
              })}
            </span>
          </header>
          <div className="border rounded-lg">
            <div className="w-full p-4 bg-fd-secondary rounded-t-lg text-center">
              <span>
                {m["ConsentPage.allowed_to"]({
                  client_name: data.data?.client_name ?? "?",
                })}
              </span>
            </div>
            <Separator />
            {scopes
              ?.slice() // create shallow copy to avoid mutating original
              .sort(
                (a, b) =>
                  scopeList.findIndex((s) => s.title === a) -
                  scopeList.findIndex((s) => s.title === b),
              )
              .map((scope, i) => (
                <React.Fragment key={scope}>
                  <div
                    className={cn(
                      "w-full p-4 text-sm",
                      scope === "system:admin" ? "text-red-400 flex items-center gap-4" : "",
                    )}
                  >
                    {scope === "system:admin" && (
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleAlert size={20} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] word-wrap text-center">
                          This allows {data.data?.client_name} to access not only your entire
                          system, but all access to your alters as well. Grant this permission with
                          caution.
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {m[
                      `ConsentPage.scopes.${scopeList.find((v) => v.title === scope)?.title ?? "profile"}`
                    ]()}
                  </div>
                  {i + 1 !== scopes.length && <Separator />}
                </React.Fragment>
              ))}
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              className={cn("gap-1 w-full")}
              onClick={async () => {
                setLoading(false);
                const res = await authClient.oauth2.consent({
                  accept: false,
                  scope: (scopes ?? []).join(" "),
                });

                if (res.error) toast.error(m["ConsentPage.error_denying_code"]());
                else {
                  toast.success(m["ConsentPage.done"]());
                  if (res.data.redirect) router.push((res.data as unknown as { uri: string }).uri);
                }
              }}
              disabled={loading}
            >
              Deny
            </Button>
            <Button
              type="button"
              className={cn("gap-1 w-full")}
              onClick={async () => {
                setLoading(true);
                const res = await authClient.oauth2.consent({
                  accept: true,
                  scope: (scopes ?? []).join(" "),
                });

                if (res.error) toast.error(m["ConsentPage.error_denying_code"]());
                else {
                  toast.success(m["ConsentPage.done"]());
                  if (res.data.redirect) router.push((res.data as unknown as { uri: string }).uri);
                }
              }}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Accept"}
            </Button>
          </div>
        </Card>
      )}
      <Dithering
        className="w-screen h-screen absolute"
        colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
        colorFront="#f2ea57"
        shape="warp"
        type="4x4"
        size={2}
        speed={1}
        scale={0.6}
      />
    </div>
  );
}
