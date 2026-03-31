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
				<Separator className="mb-4" />
			</div>
		</main>
	);
}
