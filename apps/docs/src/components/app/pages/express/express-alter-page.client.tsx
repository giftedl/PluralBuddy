"use client";

import { PAlter, PExpressApplication } from "plurography";
import { SettingsSidebar } from "../../../settings-sidebar";
import { AlterView } from "../../alter-view";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Field, FieldLabel } from "../../../ui/field";
import { Select } from "../../../ui/select";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../../../ui/empty";
import { Input } from "../../../ui/input";
import { Separator } from "../../../ui/separator";
import React, { useState } from "react";
import { Avatar, AvatarImage } from "../../../ui/avatar";
import Image from "next/image";
import { APIApplication, APIUser } from "discord-api-types/v10";
import { Button } from "../../../ui/shadcn-button";
import {
	AppWindow,
	Code,
	Copy,
	Ellipse,
	Ellipsis,
	ExternalLink,
	RefreshCcw,
	Trash,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import { CreateExpressModal } from "../../create-express-modal";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "../../../ui/spinner";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { JSONModal } from "../../json-modal";
import { useTranslations } from "next-intl";
import { DeleteConfirmationModal } from "../../delete-confirmation-modal";
import { haptic } from "@/lib/haptic/haptic";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
			return await fetch(`/api/exchange/express/${appId}`, {
				method: "PUT",
			});
		},
	});
	const deleteMutation = useMutation({
		mutationFn: async (appId: string) => {
			return await fetch(`/api/exchange/express/${appId}`, {
				method: "DELETE",
			});
		},
	});

	const t = useTranslations("ExpressPage");
	const [authorizeLoading, setAuthorizeLoading] = useState(false);
	const [jsonModalOpen, setJsonModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const router = useRouter();

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
								<BreadcrumbLink href="/app/settings/express">
									Express
								</BreadcrumbLink>
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
				<JSONModal
					data={alter}
					open={jsonModalOpen}
					rootName="alter"
					setOpen={setJsonModalOpen}
				/>
				<DeleteConfirmationModal
					open={deleteModalOpen}
					setOpen={setDeleteModalOpen}
					requiredDeletionText={alter.username}
					title={t("delete_title", {
						alter: alter.username,
					})}
					description={t.rich("delete_desc", {
						alter: alter.username,
						b: (children) => <b>{children}</b>,
						br: () => <br></br>,
					})}
					onDelete={async () => {
						await deleteMutation.mutateAsync(alter.express?.application ?? "");

						router.push("/app/settings/express");
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
								disabled={authorizeLoading || alter.express === null}
								onClick={async () => {
									setAuthorizeLoading(true);
									await refreshMutation.mutateAsync(
										alter.express?.application ?? "",
									);
									setAuthorizeLoading(false);
								}}
							>
								{authorizeLoading ? <Spinner /> : <RefreshCcw size={9} />}
								{t("nav_menu_sync_prof")}
							</DropdownMenuItem>
							<Link
								to={`https://discord.com/oauth2/authorize?client_id=${alter.express?.application}`}
								target="_blank"
							>
								<DropdownMenuItem disabled={alter.express === null}>
									<ExternalLink size={9} />
									{t("nav_menu_auth")}
								</DropdownMenuItem>
							</Link>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() =>
									navigator.clipboard.writeText(String(alter?.alterId))
								}
							>
								<Copy size={9} />
								{t("nav_menu_copy_alter")}
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={alter.express === null}
								onClick={() =>
									navigator.clipboard.writeText(String(alter?.express?.alterId))
								}
							>
								<Copy size={9} />
								{t("nav_menu_copy_app")}
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setJsonModalOpen(true)}>
								<Code size={9} />
								{t("nav_menu_json")}
							</DropdownMenuItem>
							<DropdownMenuSeparator />

							<DropdownMenuItem
								className="text-red-400"
								onClick={() => setDeleteModalOpen(true)}
							>
								<Trash size={9} /> {t("nav_menu_delete")}
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
						<EmptyTitle>{t("empty_title")}</EmptyTitle>
						<EmptyDescription>{t("empty_desc")}</EmptyDescription>
						<EmptyContent className="flex-row justify-center gap-2">
							<CreateExpressModal>
								<Button>{t("empty_btn")}</Button>
							</CreateExpressModal>
						</EmptyContent>
					</EmptyHeader>
				</Empty>
			) : (
				<React.Fragment>
					<Card className="w-full">
						<CardContent>
							<CardTitle>{t("add_app_title")}</CardTitle>
							<Separator className="h-px my-3" />
							<Button
								className="w-full"
								disabled={authorizeLoading}
								onClick={async () => {
									setAuthorizeLoading(true);
									await refreshMutation.mutateAsync(
										alter.express?.application ?? "",
									);
									setAuthorizeLoading(false);

									window.open(
										`https://discord.com/oauth2/authorize?client_id=${alter.express?.application}`,
										"_newtab",
									);
								}}
							>
								{authorizeLoading && <Spinner />}
								{t("auth_link")} <ExternalLink />
							</Button>
						</CardContent>
					</Card>
					<Card className="w-full">
						<CardContent>
							<CardTitle>{t("app_info_title")}</CardTitle>

							<Separator className="h-px my-3" />

							<Field>
								<FieldLabel htmlFor="public-id">{t("app_pk")}</FieldLabel>
								<Input
									id="public-id"
									value={alter.express?.publicKey}
									disabled
								/>
							</Field>
							<Field className="mt-3">
								<FieldLabel htmlFor="public-id">{t("app_id")}</FieldLabel>
								<Input
									id="public-id"
									value={alter.express?.application}
									disabled
								/>
							</Field>
						</CardContent>
					</Card>
					<Card className="w-full">
						<CardContent>
							<CardTitle>{t("profile_title")}</CardTitle>

							<Separator className="h-px my-3" />

							<div className="md:flex">
								<div className="rounded-xl md:min-w-[356px] max-w-[356px] border p-4 grid gap-2">
									<div className="relative h-[150px]">
										{alter.banner ? (
											<img
												src={alter.banner}
												className="w-[320px] h-[120px] rounded-xl z-0"
												alt={t("alt_banner")}
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
														navigator.clipboard.writeText(
															alter.application?.id ?? "",
														);
													}}
												>
													<Copy />
												</Button>
											</TooltipTrigger>
											<TooltipContent>{t("profile_user_id")}</TooltipContent>
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
														await refreshMutation.mutateAsync(
															alter.express?.application ?? "",
														);
														setAuthorizeLoading(false);
													}}
												>
													{authorizeLoading ? <Spinner /> : <RefreshCcw />}
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												{t("profile_resync_prfs")}
											</TooltipContent>
										</Tooltip>

										<Avatar className="w-[80px] h-[80px] absolute bottom-0 left-[10px] border-6 border-card">
											<AvatarImage
												src={
													alter.avatarUrl ??
													"https://cdn.discordapp.com/embed/avatars/0.png"
												}
											/>
										</Avatar>
									</div>

									<div className="bg-card-foreground/10 rounded-xl p-4 grid gap-2">
										<h1 className="text-[20px] font-bold text-wrap wrap-anywhere">
											{alter.username}
										</h1>
										<span className="text-wrap wrap-anywhere">
											{alter.user?.username}
										</span>
										<Separator className="h-px my-3" />
										<span className="text-wrap wrap-anywhere">
											{alter.application?.description}
										</span>
									</div>
								</div>
								<div className="px-4 max-md:py-4">{t("profile_desc")}</div>
							</div>
						</CardContent>
					</Card>
				</React.Fragment>
			)}
		</main>
	);
}
