"use client";

import { ReactNode, useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Field, FieldDescription, FieldLabel, FieldTitle } from "../ui/field";
import { deleteUserApp, type OAuthApplication } from "@/app/(home)/developers/applications/actions";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function DeleteAppForm({
	children,
	application,
}: {
	children: ReactNode;
	application: OAuthApplication;
}) {
	const [confirmationValue, setConfirmationValue] = useState("");
	const [confirmationError, setConfirmationError] = useState(false);
    const router = useRouter();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onSelect={() => setOpen(true)}>
				<DropdownMenuItem
					className="text-red-400"
					onSelect={(e) => {
						e.preventDefault();
					}}
				>
					{children}
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Deleting Application</DialogTitle>
					<DialogDescription>
						Deleting an application deletes all users and user data associated
						with the application. Are you sure you would like to proceed?
					</DialogDescription>
				</DialogHeader>
				<Field data-invalid={confirmationError}>
					<FieldLabel>Confirmation</FieldLabel>
					<FieldDescription>
						Type "{application.name}" below to continue
					</FieldDescription>
					<Input
						type="text"
						placeholder={application.name}
						aria-invalid={confirmationError}
						id="confirmation"
						name="confirmation"
						value={confirmationValue}
						onChange={(e) => setConfirmationValue(e.target.value)}
					/>
				</Field>
				<DialogFooter>
					<button
						type="button"
						className={cn(buttonVariants({ variant: "primary" }), "w-full gap-2")}
                        onClick={async () => {
                            if (application.name.toLowerCase() === confirmationValue.toLowerCase()) {
                                await deleteUserApp(application.clientId);
                                router.push("/developers/applications")
                            }
                        }}
					>
						<Trash size={16} /> Delete
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
