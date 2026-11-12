"use client";

import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { useMutation } from "@tanstack/react-query";
import { APIApplication, APIUser } from "discord-api-types/v10";
import {
  AppWindow,
  Code,
  Cog,
  Copy,
  Ellipse,
  Ellipsis,
  ExternalLink,
  RefreshCcw,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { PAlter, PExpressApplication } from "plurography";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { haptic } from "@/lib/haptic/haptic";
import { m } from "@/paraglide/messages";
import { SettingsSidebar } from "../../../settings-sidebar";
import { Avatar, AvatarImage } from "../../../ui/avatar";
import { Card, CardContent, CardDescription, CardTitle } from "../../../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../../ui/empty";
import { Field, FieldLabel } from "../../../ui/field";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Select } from "../../../ui/select";
import { Separator } from "../../../ui/separator";
import { Button } from "../../../ui/shadcn-button";
import { Spinner } from "../../../ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import { AlterView } from "../../alter-view";
import { DeleteConfirmationModal } from "../../delete-confirmation-modal";
import { JSONModal } from "../../json-modal";
import { PreferencesModal } from "../../preferences-modal";

export function ExpressAlterPage({
  alter,
}: {
  alter: PAlter & {
    express: PExpressApplication | null;
    user: APIUser | undefined;
    application: APIApplication | undefined;
  };
}) {
  const refreshMutation = useMutation({
    mutationFn: async (appId: string) => {
      return await fetch(`/api/v1/express/${appId}`, {
        method: "PUT",
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (appId: string) => {
      return await fetch(`/api/v1/express/${appId}`, {
        method: "DELETE",
      });
    },
  });

  const [authorizeLoading, setAuthorizeLoading] = useState(false);
  const [jsonModalOpen, setJsonModalOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useNavigate();

  return (
    <main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
      <Card className="w-full">
        <CardContent>
          <Breadcrumb className="text-left">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/app/settings/express">Express</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/app/settings/express/alter/${alter.alterId}`}>
                  @{alter.username}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
      <div className="max-md:space-y-3 items-center gap-6 w-full">
        <JSONModal data={alter} open={jsonModalOpen} rootName="alter" setOpen={setJsonModalOpen} />
        <PreferencesModal alter={alter} open={preferencesOpen} setOpen={setPreferencesOpen} />
        <DeleteConfirmationModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          requiredDeletionText={alter.username}
          title={m["ExpressPage.delete_title"]({
            alter: alter.username,
          })}
          description={
            <ParaglideMessage
              message={m["ExpressPage.delete_desc"]}
              inputs={{
                alter: alter.username,
              }}
              markup={{
                b: ({ children }) => <b>{children}</b>,
                br: () => <br></br>,
              }}
            />
          }
          onDelete={async () => {
            await deleteMutation.mutateAsync(alter.express?.application ?? "");

            router("/app/settings/express");
          }}
        />

        <AlterView selectedAlter={String(alter.alterId)}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" onClick={() => haptic()}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuItem
                disabled={alter.express === null}
                onClick={() => setPreferencesOpen(true)}
              >
                <Cog />
                {m["ExpressPage.nav_menu_pref"]()}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={authorizeLoading || alter.express === null}
                onClick={async () => {
                  setAuthorizeLoading(true);
                  await refreshMutation.mutateAsync(alter.express?.application ?? "");
                  setAuthorizeLoading(false);
                }}
              >
                {authorizeLoading ? <Spinner /> : <RefreshCcw size={9} />}
                {m["ExpressPage.nav_menu_sync_prof"]()}
              </DropdownMenuItem>
              <Link
                to={`https://discord.com/oauth2/authorize?client_id=${alter.express?.application}`}
                target="_blank"
              >
                <DropdownMenuItem disabled={alter.express === null}>
                  <ExternalLink size={9} />
                  {m["ExpressPage.nav_menu_auth"]()}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(String(alter?.alterId))}
              >
                <Copy size={9} />
                {m["ExpressPage.nav_menu_copy_alter"]()}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={alter.express === null}
                onClick={() => navigator.clipboard.writeText(String(alter?.express?.alterId))}
              >
                <Copy size={9} />
                {m["ExpressPage.nav_menu_copy_app"]()}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setJsonModalOpen(true)}>
                <Code size={9} />
                {m["ExpressPage.nav_menu_json"]()}
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-400" onClick={() => setDeleteModalOpen(true)}>
                <Trash size={9} /> {m["ExpressPage.nav_menu_delete"]()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlterView>
      </div>

      {alter.express === null ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AppWindow />
            </EmptyMedia>
            <EmptyTitle>{m["ExpressPage.empty_title"]()}</EmptyTitle>
            <EmptyDescription>{m["ExpressPage.empty_desc"]()}</EmptyDescription>
            <EmptyContent className="flex-row justify-center gap-2">
              <Button disabled>{m["ExpressPage.empty_btn"]()}</Button>
            </EmptyContent>
          </EmptyHeader>
        </Empty>
      ) : (
        <React.Fragment>
          <Card className="w-full">
            <CardContent>
              <CardTitle>{m["ExpressPage.add_app_title"]()}</CardTitle>
              <CardDescription>
                {m["ExpressPage.add_app_description"]({
                  alterName: alter.username,
                })}
              </CardDescription>
              <Separator className="h-px my-3" />
              <Button
                className="w-full"
                disabled={authorizeLoading}
                onClick={async () => {
                  setAuthorizeLoading(true);
                  await refreshMutation.mutateAsync(alter.express?.application ?? "");
                  setAuthorizeLoading(false);

                  window.open(
                    `https://discord.com/oauth2/authorize?client_id=${alter.express?.application}`,
                    "_newtab",
                  );
                }}
              >
                {authorizeLoading && <Spinner />}
                {m["ExpressPage.auth_link"]()} <ExternalLink />
              </Button>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <CardTitle>{m["ExpressPage.app_info_title"]()}</CardTitle>

              <Separator className="h-px my-3" />

              <Field>
                <FieldLabel htmlFor="public-id">{m["ExpressPage.app_pk"]()}</FieldLabel>
                <Input id="public-id" value={alter.express?.publicKey} disabled />
              </Field>
              <Field className="mt-3">
                <FieldLabel htmlFor="public-id">{m["ExpressPage.app_id"]()}</FieldLabel>
                <Input id="public-id" value={alter.express?.application} disabled />
              </Field>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <CardTitle>{m["ExpressPage.profile_title"]()}</CardTitle>

              <Separator className="h-px my-3" />

              <div className="md:flex">
                <div className="rounded-xl md:min-w-[356px] max-w-[356px] border p-4 grid gap-2">
                  <div className="relative h-[150px]">
                    {alter.banner ? (
                      <img
                        src={alter.banner}
                        className="w-[320px] h-[120px] rounded-xl z-0 object-cover"
                        alt={m["ExpressPage.alt_banner"]()}
                      />
                    ) : (
                      <div className="bg-[#5865F2] w-full md:min-w-[320px] max-w-[320px] h-[120px] rounded-xl absolute" />
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="right-[6px] top-[6px] z-10 absolute"
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(alter.application?.id ?? "");
                          }}
                        >
                          <Copy />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{m["ExpressPage.profile_user_id"]()}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="right-[36px] top-[6px] z-10 absolute"
                          size="icon"
                          variant="ghost"
                          disabled={authorizeLoading}
                          onClick={async () => {
                            setAuthorizeLoading(true);
                            await refreshMutation.mutateAsync(alter.express?.application ?? "");
                            setAuthorizeLoading(false);
                          }}
                        >
                          {authorizeLoading ? <Spinner /> : <RefreshCcw />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{m["ExpressPage.profile_resync_prfs"]()}</TooltipContent>
                    </Tooltip>

                    <Avatar className="w-[80px] h-[80px] absolute bottom-0 left-[10px] border-6 border-card">
                      <AvatarImage
                        src={alter.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}
                      />
                    </Avatar>
                  </div>

                  <div className="bg-card-foreground/10 rounded-xl p-4 grid gap-2">
                    <h1 className="text-[20px] font-bold text-wrap wrap-anywhere">
                      {alter.username}
                    </h1>
                    <span className="text-wrap wrap-anywhere">{alter.user?.username}</span>
                    <Separator className="h-px my-3" />
                    <span className="text-wrap wrap-anywhere">
                      {alter.application?.description}
                    </span>
                  </div>
                </div>
                <div className="px-4 max-md:py-4">{m["ExpressPage.profile_desc"]()}</div>
              </div>
            </CardContent>
          </Card>
        </React.Fragment>
      )}
    </main>
  );
}
