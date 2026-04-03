"use client";

import { getAllExpressApplications } from "@/app/[lang]/(app)/app/express/actions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/shadcn-button";
import { Separator } from "../ui/separator";
import { SettingsSidebar } from "../settings-sidebar";
import { CreateExpressModal } from "../app/create-express-modal";
import { cn } from "@/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { AlterView } from "../app/alter-view";

export function ExpressList() {
	const { isPending, data } = useQuery({
		queryKey: ["express/list"],
		queryFn: async () => getAllExpressApplications(),
	});

	if (isPending)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<SettingsSidebar page="express" />
				<div className="fixed block top-[50%] right-[50%]">
					<Spinner />
				</div>
			</main>
		);

	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<SettingsSidebar page="express" />
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card className="w-full mb-4">
					<CardContent className="flex justify-between items-start gap-3">
						<div>
							<CardTitle>PluralBuddy Express</CardTitle>
							<CardDescription>
								Create user-proxies with PluralBuddy Express – assign your own
								alters to Discord applications and use native Discord slash
								commands to proxy as an alter. Works in direct messages, or any
								server with Use External Apps granted.
							</CardDescription>
						</div>
						<CreateExpressModal>
							<Button>Create Express Application</Button>
						</CreateExpressModal>
					</CardContent>
				</Card>
				<Separator orientation="horizontal" className="h-px mb-3" />
				{data?.map((v) => (
					<Link href={`/app/express/alter/${v.alterId}`} key={v.alterId}>
						<Card className={cn("min-h-[92px] min-w-[267px] cursor-pointer")}>
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
		</main>
	);
}
