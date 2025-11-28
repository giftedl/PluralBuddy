/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { redirect } from "next/navigation";
import { getUserApp } from "../../applications/actions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { EllipsisIcon, Pencil, Trash, X } from "lucide-react";
import Link from "next/link";
import { DeleteAppForm } from "@/components/devs/delete-app-form";
import { Separator } from "@/components/ui/separator";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ClientSecretInput } from "@/components/devs/client-secret-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScopesForm } from "@/components/devs/scopes-form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { RedirectURLs } from "@/components/devs/redirect-urls";

export default async function ApplicationPage({
	params,
}: {
	params: Promise<{ application: string }>;
}) {
	const { application } = await params;
	const app = await getUserApp(application);

	if ("message" in app) redirect("/developers/applications");
	if (!("data" in app)) redirect("/developers/applications");

    const { data } = app;
	const { userId, _id, ...safeData } = data;

	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-12 items-center mx-auto max-w-[1000px] max-xl:pt-26 mb-3">
			<div className="flex justify-between items-center gap-6 w-full">
				<div className=" gap-3 flex-1 min-w-0">
					<strong className="text-lg whitespace-nowrap mr-3">
						{data.name}
					</strong>
					<br />
					<span className="min-w-0">
						<Link href="/developers/applications" className="text-fd-primary">
							Back to applications
						</Link>
					</span>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className={cn(
								buttonVariants({ variant: "outline" }),
								"inline-flex items-center gap-1",
							)}
						>
							<EllipsisIcon size={16} />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DeleteAppForm application={safeData}>
							<Trash className="text-red-400" /> Delete Application
						</DeleteAppForm>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Separator />

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Basic Information</CardTitle>
				</CardHeader>
				<CardContent>
					<FieldGroup>
						<Field orientation="responsive">
							<FieldContent>
								<FieldLabel htmlFor="client-id">Client ID</FieldLabel>
							</FieldContent>
							<Input
								id="client-id"
								readOnly
								value={data.clientId}
								className="!w-[245px]"
							/>
						</Field>
						<Field orientation="responsive">
							<FieldContent>
								<FieldLabel htmlFor="client-secret">Client Secret</FieldLabel>
								<FieldDescription>
									If you reset the client secret, you will not see it again.
								</FieldDescription>
							</FieldContent>
							<ClientSecretInput application={safeData} />
						</Field>
					</FieldGroup>
				</CardContent>
			</Card>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Redirect URI(s)</CardTitle>
				</CardHeader>
				<CardContent>
                    <RedirectURLs application={safeData} />
				</CardContent>
			</Card>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Authorization URL</CardTitle>
				</CardHeader>
				<CardContent>
					<ScopesForm application={safeData} />
				</CardContent>
			</Card>
		</main>
	);
}
