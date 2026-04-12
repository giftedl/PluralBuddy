"use client";

import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../../../ui/spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../../ui/card";
import { Button } from "../../../ui/shadcn-button";
import { Separator } from "../../../ui/separator";
import { SettingsSidebar } from "../../../settings-sidebar";
import { CreateExpressModal } from "../../create-express-modal";
import { cn } from "@/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Link } from "react-router";
import { AlterView } from "../../alter-view";
import { useTranslations } from "next-intl";
import { DynamicPageTitle } from "../../dynamic-title";
import { useTRPCClient } from "@/server/client";
import { haptic } from "@/lib/haptic/haptic";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function ExpressList() {
	const trpc = useTRPCClient();
	const { isPending, data } = useQuery({
		queryKey: ["express/list"],
		queryFn: async () => trpc.express.getAllExpressApplications.query({}),
	});
	const t = useTranslations("ExpressList");

	if (isPending)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<DynamicPageTitle title="PluralBuddy Express • PluralBuddy App" />
				<div className="fixed block top-[50%] right-[50%]">
					<Spinner />
				</div>
			</main>
		);

	return (
		<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<DynamicPageTitle title="PluralBuddy Express • PluralBuddy App" />
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
						</BreadcrumbList>
					</Breadcrumb>
				</CardContent>
			</Card>
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card className="w-full mb-4">
					<CardContent className="md:flex justify-between items-start gap-3">
						<div>
							<CardTitle>PluralBuddy Express</CardTitle>
							<CardDescription>{t("desc")}</CardDescription>
						</div>
						<CreateExpressModal>
							<Button className="max-md:mt-3" onClick={() => haptic()}>
								{t("btn")}
							</Button>
						</CreateExpressModal>
					</CardContent>
				</Card>
				<Separator orientation="horizontal" className="h-px mb-3" />
				<div className="gap-3 grid">
					{data?.map((v) => (
						<Link
							to={{ pathname: `/app/settings/express/alter/${v.alterId}` }}
							key={v.alterId}
						>
							<Card
								className={cn("min-h-[92px] min-w-[267px] cursor-pointer")}
								onClick={() => haptic()}
							>
								<CardContent className="gap-4 flex items-center">
									<div
										style={{
											backgroundColor:
												(v.alter?.color as `#${string}`) ?? `#808080`,
										}}
										className=" h-[60px] w-[5px] rounded-xl"
									/>
									<Avatar>
										<AvatarImage src={v.alter?.avatarUrl ?? ""} />
										<AvatarFallback>
											{v.alter?.displayName[0].toLocaleUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle className="text-sm">
											@{v.alter?.username}{" "}
											<span className="text-muted-foreground">
												{v.alter?.displayName}
											</span>
										</CardTitle>
										<CardDescription className="pt-1">
											{v.alter?.description?.substring(0, 60)}
										</CardDescription>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
