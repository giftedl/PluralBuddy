/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { EllipsisIcon, LayoutGrid, Pencil, Plus, Trash } from "lucide-react";
import { getUserApps } from "./actions";
import { Separator } from "@/components/ui/separator";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { CreateNewAppForm } from "@/components/devs/create-new-app-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteAppForm } from "@/components/devs/delete-app-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata: Metadata = {
	title: 'Developer Applications',
	description: 'Use PluralBuddy\'s OAuth API to get data about system and alters dynamically without over-exposing details about your users.',
	applicationName: 'PluralBuddy',
  }

export default async function DeveloperApplications() {
	const applications = await auth.api.getOAuthClients({
		// This endpoint requires session cookies.
		headers: await headers(),
	});

	if (applications === null) redirect("/");

	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-12 items-center mx-auto max-w-[1000px] max-xl:pt-26 mb-3">
			<div className="md:flex max-md:space-y-3 justify-between items-center gap-6 w-full">
				<div className=" gap-3 flex-1 min-w-0">
					<strong className="text-lg whitespace-nowrap mr-3">
						OAuth Applications
					</strong>{" "}
					<br />
					<span className="min-w-0">
						Use PluralBuddy's OAuth API to get data about system and alters
						dynamically without over-exposing details about your users.
					</span>
				</div>
				<CreateNewAppForm>
					<button
						type="button"
						className={cn(
							buttonVariants({ variant: "primary" }),
							"inline-flex items-center gap-1",
						)}
					>
						<Plus size={20} />
						<span>New Application</span>
					</button>
				</CreateNewAppForm>
			</div>
			<Separator />

			{applications?.length === 0 && (
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
				{applications.map((application) => (
					<Card key={application.client_id}>
						<CardContent className="flex justify-between items-center">
							{application.client_name}

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className={cn(
											buttonVariants({ variant: "ghost" }),
											"inline-flex items-center gap-1",
										)}
									>
										<EllipsisIcon size={16} />
									</button>
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
