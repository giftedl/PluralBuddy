import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { DynamicPageTitle } from "../../dynamic-title";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTRPC, useTRPCClient } from "@/server/client";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Cloud } from "lucide-react";
import { SocialNudgingCard } from "./social-nudging-card";
import { SystemFlags } from "./system-flags";

export type SocialSettings = {
  nudging: {
    blockedUsers: string[];
    currentlyEnabled: boolean;
    dmReply: boolean;
  };
  systemPrivacy: number;
};

export default function SocialPage() {
  const trpc = useTRPCClient();
  const { data, isPending } = useQuery({
    queryKey: ["social-settings"],
    queryFn: async () => trpc.social.getSocialSettings.query(),
  });

  if (isPending)
    return (
      <div className="grid grid-cols-1 my-[30px] border p-3 rounded-2xl relative">
        <div className="fixed block top-[50%] right-[50%] ">
          <Spinner />
        </div>
      </div>
    );

  return (
    <main className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
      <DynamicPageTitle title="Social • PluralBuddy App" />
      <Card className="w-full">
        <CardContent>
          <Breadcrumb className="text-left">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/app/settings/social">Social</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
      {data?.noSystem !== undefined || data === undefined ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Cloud />
            </EmptyMedia>
            <EmptyTitle>No System</EmptyTitle>
            <EmptyDescription>
              Create a system on Discord to manage your entire system.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="max-md:space-y-3 items-center gap-6 w-full">
          <Card className="w-full mb-4">
            <CardContent>
              <CardTitle>Social</CardTitle>
              <CardDescription>
                Manage the social interactions that are inhibited on PluralBuddy here.
              </CardDescription>
            </CardContent>
          </Card>
          <Separator className="mb-4" />
          <div className="space-y-3">
            <SocialNudgingCard data={data} />
            <SystemFlags publicNum={data.systemPrivacy} />
          </div>
        </div>
      )}
    </main>
  );
}
