/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { cn } from "@/lib/utils";
import { EllipsisIcon, LayoutGrid, Pencil, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreateNewAppForm } from "@/components/devs/create-new-app-form";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { DeleteAppForm } from "@/components/devs/delete-app-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { DynamicPageTitle } from "../../dynamic-title";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DeveloperApplications() {
  const { isPending, data: applications } = useQuery({
    queryKey: ["applications"],
    queryFn: () => authClient.oauth2.getClients(),
  });

  if (isPending || !applications || applications.error !== null)
    return (
      <div className="grid grid-cols-1 my-[30px] p-3 rounded-2xl relative">
        <div className="fixed block top-[50%] right-[50%] ">
          <Spinner />
        </div>
      </div>
    );

  return (
    <main className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
      <DynamicPageTitle title="Connections • PluralBuddy App" />
      <Card className="w-full">
        <CardContent>
          <Breadcrumb className="text-left">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/app/settings/authorized-apps">
                  OAuth Applications
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
      <div className="max-md:space-y-3 items-center gap-6 w-full">
        <Card className="w-full mb-2">
          <CardContent className="flex items-start">
            <div>
              <CardTitle>OAuth Applications</CardTitle>
              <CardDescription>
                Use PluralBuddy's OAuth API to get data about system and alters dynamically without
                over-exposing details about other users.
              </CardDescription>
            </div>

            <CreateNewAppForm>
              <Button type="button" className={cn("inline-flex items-center gap-1")}>
                <Plus size={20} />
                <span>New Application</span>
              </Button>
            </CreateNewAppForm>
          </CardContent>
        </Card>
      </div>
      <Separator />

      {applications.data?.length === 0 && (
        <Empty className="border border-dashed w-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutGrid />
            </EmptyMedia>
            <EmptyTitle>No applications</EmptyTitle>
            <EmptyDescription>You don't have any applications</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      <div className="grid grid-cols-3 gap-2 w-full">
        {applications.data.map((application) => (
          <Card key={application.client_id}>
            <CardContent className="flex justify-between items-center">
              {application.client_name}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn("inline-flex items-center gap-1")}
                  >
                    <EllipsisIcon size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href={`/developers/application/${application.client_id}`}>
                    <DropdownMenuItem>
                      <Pencil /> Edit Application
                    </DropdownMenuItem>
                  </Link>
                  <DeleteAppForm application={application}>
                    <Trash className="text-red-400" /> Delete Application
                  </DeleteAppForm>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
