import { m } from "@/paraglide/messages";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { OAuthClient } from "@better-auth/oauth-provider";
import { Separator } from "../ui/separator";
import { scopeList } from "../devs/create-new-app-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "cn";
import { CircleAlert } from "lucide-react";
import { Button } from "../ui/shadcn-button";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function AuthorizationCardContent({
  data,
  scopes,
  handlerResponse,
}: {
  data: { data: OAuthClient };
  scopes: string[];
  handlerResponse:
    | { type: "oauth2" }
    | { type: "device-flow"; userCode: string; setSuccess: (r: boolean) => void };
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = authClient.useSession();

  return (
    <>
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
            client_name: data.data.client_name ?? "?",
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
              client_name: data.data.client_name ?? "?",
            })}
          </span>
        </div>
        <Separator />
        {scopes
          ?.slice() // create shallow copy to avoid mutating original
          .sort(
            (a, b) =>
              scopeList.findIndex((s) => s.title === a) - scopeList.findIndex((s) => s.title === b),
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
                      This allows {data.data.client_name} to access not only your entire system, but
                      all access to your alters as well. Grant this permission with caution.
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
            let res = null;
            switch (handlerResponse.type) {
              case "oauth2":
                res = await authClient.oauth2.consent({
                  accept: false,
                  scope: (scopes ?? []).join(" "),
                });
              case "device-flow":
                res = await authClient.device.deny({
                  userCode: "userCode" in handlerResponse ? handlerResponse.userCode : "null",
                });
            }
            setLoading(false);

            if (res.error) toast.error(m["ConsentPage.error_denying_code"]());
            else {
              toast.success(m["ConsentPage.done"]());
              if ("redirect" in res.data) router.push((res.data as unknown as { uri: string }).uri)
              else if ("setSuccess" in handlerResponse) handlerResponse.setSuccess(true);
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
            let res = null;
            switch (handlerResponse.type) {
              case "oauth2":
                res = await authClient.oauth2.consent({
                  accept: false,
                  scope: (scopes ?? []).join(" "),
                });
              case "device-flow":
                res = await authClient.device.approve({
                  userCode: "userCode" in handlerResponse ? handlerResponse.userCode : "null",
                });
            }
            setLoading(false);

            if (res.error) toast.error(m["ConsentPage.error_accepting_code"]());
            else {
              toast.success(m["ConsentPage.done"]());
              if ("redirect" in res.data) router.push((res.data as unknown as { uri: string }).uri);
              else if ("setSuccess" in handlerResponse) handlerResponse.setSuccess(true);
            }
          }}
          disabled={loading}
        >
          {loading ? <Spinner /> : "Accept"}
        </Button>
      </div>
    </>
  );
}
