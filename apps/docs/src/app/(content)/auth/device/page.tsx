"use client";

import { AuthorizationCardContent } from "@/components/auth/authorization-card-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/shadcn-button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { OAuthClient } from "@better-auth/oauth-provider";
import { Dithering } from "@paper-design/shaders-react";
import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { MouseEvent, useState } from "react";

export default function DeviceAuthorizationPage() {
  const { data: session, isPending } = authClient.useSession();
  const searchParams = useSearchParams();
  const [userCode, setUserCode] = useState(searchParams.get("user_code") || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [successModal, setSuccessModal] = useState(false);
  const [openClient, setOpenClient] = useState<
    { client: OAuthClient; scopes: string[]; approvalCode: string } | undefined
  >();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement, MouseEvent> | null) => {
    setLoading(true);
    if (e) e.preventDefault();

    try {
      const formattedCode = userCode.trim().replace(/-/g, "").toUpperCase();

      if (!session?.user) {
        const verificationPath = `/auth/device?user_code=${encodeURIComponent(formattedCode)}`;
        window.location.href = `/auth/sign-in?redirect=${encodeURIComponent(verificationPath)}`;
        return;
      }

      // Check if the code is valid using GET /device endpoint
      const response = await authClient.device({
        query: { user_code: formattedCode },
      });

      if (response.data && response.data.client_id && response.data.status === "pending") {
        const application = await authClient.oauth2.publicClient({
          query: { client_id: response.data.client_id },
        });

        if (!application.data) throw new Error("Cannot find application");

        setOpenClient({
          client: application.data,
          scopes: response.data.scope?.split(" ") ?? [],
          approvalCode: formattedCode,
        });
      } else throw new Error("Not a valid code");
    } catch (err) {
      setLoading(false);
      setError(m["ConsentPage.invalid_code"]());
    }
  };

  return (
    <div className="grid w-full flex-grow relative items-center justify-center px-4">
      <Dialog
        open={openClient !== undefined}
        onOpenChange={(v) =>
          v === false &&
          !successModal &&
          (() => {
            setOpenClient(undefined);
            setLoading(false);
          })()
        }
      >
        <DialogContent showCloseButton={!successModal}>
          {openClient &&
            (!successModal ? (
              <AuthorizationCardContent
                data={{ data: openClient.client }}
                scopes={openClient.scopes}
                handlerResponse={{
                  type: "device-flow",
                  userCode: openClient.approvalCode,
                  setSuccess: () => {
                    setSuccessModal(true);
                    setTimeout(() => {
                      setOpenClient(undefined);
                      setSuccessModal(false);
                      setLoading(false)
                    }, 1500);
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full">
                <Check />
              </div>
            ))}
        </DialogContent>
      </Dialog>

      <Card className="w-full space-y-5 z-10 flex justify-center rounded-2xl p-8 sm:w-100">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <div>
              <div className="flex items-center justify-center">
                <div className="relative flex items-center">
                  <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-primary shadow-lg">
                    <Avatar className="w-full h-full">
                      <AvatarImage src="/image/pfp.png" alt="Solar" />
                      <AvatarFallback>PluralBuddy</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <header className="text-center flex flex-col gap-1.5">
                <h1 className="mt-6 text-xl font-medium tracking-tight">
                  {m["ConsentPage.device_auth"]()}
                </h1>
                <span className="text-sm text-muted-foreground">
                  {m["ConsentPage.device_auth_desc"]()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {m["ConsentPage.signed_in_as"]({
                    username: `@${session?.user.name}`,
                  })}
                </span>
              </header>
            </div>
            <div className="flex items-center justify-center">
              <div className="border text-center flex flex-col gap-2 rounded-lg p-4 px-3 max-w-[320px]">
                <InputOTP
                  maxLength={12}
                  containerClassName="gap-1.5"
                  onChange={(v) => {
                    setUserCode(v.toLocaleUpperCase());
                    if (v.length === 6) handleSubmit(null);
                  }}
                  value={userCode}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={i} />
                    </InputOTPGroup>
                  ))}
                </InputOTP>
                <span className="text-red-400 text-xs">{error}</span>
              </div>
            </div>

            <div className="text-center flex flex-col gap-4">
              <Button
                type="button"
                className={cn("gap-1 w-full")}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Spinner /> : m["ConsentPage.continue"]()}
              </Button>
            </div>
          </>
        )}
      </Card>
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

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <input
  //       type="text"
  //       value={userCode}
  //       onChange={(e) => setUserCode(e.target.value)}
  //       placeholder="Enter device code (e.g., ABCD-1234)"
  //       maxLength={12}
  //     />
  //     <button type="submit">Continue</button>
  //     {error && <p>{error}</p>}
  //   </form>
  // );
}
