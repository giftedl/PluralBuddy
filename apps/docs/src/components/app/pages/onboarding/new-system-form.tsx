"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/shadcn-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { PAlterObject, PSystemObject } from "plurography";
import { Kbd } from "@/components/ui/kbd";
import Link from "next/link";
import { db } from "@/lib/app/dexie";
import { useQuickSync } from "@/lib/app/use-sync";

const formSchema = z.object({
	title: PSystemObject._zod.def.shape.systemName,
});

export function NewSystemForm({finished}: { finished: () => void}) {
	const sync = useQuickSync();
	const form = useForm({
		defaultValues: {
			title: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await db.systems.add(PSystemObject.parse({
				associatedUserId: "@me",

				alterIds: [],
				tagIds: [],
				createdAt: new Date(),

				systemAutoproxy: [],
				public: 0,
				disabled: false,
				systemName: value.title,
				subAccounts: []
			}))
			
			finished()
        	await sync();
		},
	});

	return (
		<form
			id="bug-report-form"
			className="py-3"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field
					name="title"
					children={(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>System Name</FieldLabel>
								<FieldDescription>
									What do you want your system to be called?
								</FieldDescription>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder="Blehh :3"
									autoComplete="off"
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
			</FieldGroup>
			<span className="pt-3 block text-xs text-muted-foreground">
				By hitting "Submit", you agree to PluralBuddy's{" "}
				<Link
					href="/en/docs/policies/terms"
					target="_blank"
					className="underline"
				>
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link
					href="/en/docs/policies/privacy"
					target="_blank"
					className="underline"
				>
					Privacy Policy
				</Link>
			</span>
			<Field orientation="horizontal" className="pt-3">
				<Button type="submit" form="bug-report-form" variant="outline" taptic>
					Submit
					<Kbd data-icon="inline-end" className="translate-x-0.5">
						⏎
					</Kbd>
				</Button>
			</Field>
		</form>
	);
}
