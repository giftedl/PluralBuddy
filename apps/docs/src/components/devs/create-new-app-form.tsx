"use client";

import { useState, type ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { useForm } from "@tanstack/react-form";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import z from "zod";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/shadcn-button";
import { Checkbox } from "../ui/checkbox";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { registerOAuthApplication } from "@/app/(home)/developers/applications/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMediaQuery } from "fumadocs-core/utils/use-media-query";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";

export const scopeList = [
	{ title: "profile", description: "Access to your profile data – required." },
	{ title: "openid", description: "Access to your Discord user ID" },
	{ title: "email", description: "Access to your email address" },
	{ title: "alter:read", description: "Access to read alter data" },
	{ title: "alter:write", description: "Access to change alter settings" },
	{ title: "tags:read", description: "Access to read tag data" },
	{ title: "tags:write", description: "Access to change tag data" },
	{ title: "tags:alters", description: "Access to assign tags to alters" },
	{ title: "system:read", description: "Access to system data" },
	{ title: "system:write", description: "Access to change system settings" },
	{
		title: "system:admin",
		description: "Access to read and write to systems AND alters.",
	},
] as const;

export const urlRegex =
	/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const formSchema = z.object({
	applicationName: z.string().max(90).min(3),
	redirectUris: z.string().max(300).array().max(10),
	scopes: z.enum(scopeList.map((c) => c.title)).array(),
});

export function CreateNewAppForm({ children }: { children: ReactNode }) {
	const router = useRouter();
	const form = useForm({
		defaultValues: {
			applicationName: "",
			redirectUris: [] as string[],
			scopes: ["profile"] as string[],
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log("creating new dev app ->", value);

			// @ts-ignore
			const result = await registerOAuthApplication(value);

			if (!("message" in result))
				router.push(`/developers/application/${result.clientId}`);
			else toast.error("Validation error while creating application.");
		},
		validators: {
			onSubmit: formSchema,
		},
	});
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const FormContents = () => (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<FieldSet>
				<FieldGroup>
					<form.Field name="applicationName">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid} aria-required>
									<FieldLabel htmlFor="street">Application Name</FieldLabel>
									<FieldDescription>
										This is what shows up when the user is in the consent screen
										checkpoint.
									</FieldDescription>
									<Input
										type="text"
										placeholder="Acme Inc."
										aria-invalid={isInvalid}
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
					<form.Field name="redirectUris" mode="array">
						{(field) => <RedirectURI field={field} />}
					</form.Field>
					<form.Field name="scopes" mode="array">
						{(field) => {
							const isInvalid =
								field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<FieldSet>
									<FieldLegend variant="label">Scopes</FieldLegend>
									<FieldGroup
										data-slot="checkbox-group"
										className="grid grid-cols-2"
									>
										{scopeList.map((scope) => (
											<div key={scope.title} className="space-y-1">
												<Field
													orientation="horizontal"
													data-invalid={isInvalid}
												>
													<Checkbox
														id={`form-tanstack-checkbox-${scope.title}`}
														name={field.name}
														aria-invalid={isInvalid}
														checked={field.state.value.includes(scope.title)}
														disabled={scope.title === "profile"}
														onCheckedChange={(checked) => {
															if (checked) {
																field.pushValue(scope.title);
															} else {
																const index = field.state.value.indexOf(
																	scope.title,
																);
																if (index > -1) {
																	field.removeValue(index);
																}
															}
														}}
													/>
													<FieldLabel
														htmlFor={`form-tanstack-checkbox-${scope}`}
														className="font-mono"
													>
														{scope.title}
													</FieldLabel>
												</Field>
												<FieldDescription>{scope.description}</FieldDescription>
											</div>
										))}
									</FieldGroup>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</FieldSet>
							);
						}}
					</form.Field>
				</FieldGroup>
			</FieldSet>
			<Field orientation="horizontal" className="mt-6">
				<button
					type="submit"
					className={cn(buttonVariants({ variant: "primary" }), "w-full")}
				>
					Submit
				</button>
			</Field>
		</form>
	);

	if (isDesktop)
		return (
			<Dialog>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create OAuth Application</DialogTitle>
					</DialogHeader>

					<FormContents />
				</DialogContent>
			</Dialog>
		);

	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create OAuth Application</DrawerTitle>
				</DrawerHeader>

				<div className="p-8 overflow-y-auto h-full">
					<FormContents />
				</div>
			</DrawerContent>
		</Drawer>
	);

	function RedirectURI({ field }: { field: any }) {
		const [value, setValue] = useState("");
		const [error, setError] = useState(false);
		const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

		return (
			<Field data-invalid={error || isInvalid}>
				<FieldLabel>Redirect URI(s)</FieldLabel>
				<FieldDescription>
					This is the allowed redirect URI's for the application.
				</FieldDescription>
				<InputGroup>
					<InputGroupInput
						placeholder="https://acme.com/api/callback"
						value={value}
						onChange={(e) => {
							setError(false);
							setValue(e.target.value);
						}}
						aria-invalid={error || isInvalid}
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							variant="secondary"
							onClick={() => {
								if (!urlRegex.test(value)) {
									setError(true);
									return;
								}
								if (value !== "") field.pushValue(value);
								setValue("");
							}}
						>
							Add
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
				<FieldError
					errors={[
						...(error ? [{ message: "Must be a valid URL" }] : []),
						...field.state.meta.errors,
					]}
				/>

				<div className="flex items-center gap-1">
					{field.state.value.map((_: unknown, index: number) => (
						<form.Field
							name={`redirectUris[${index}]`}
							key={`${Math.random()}-${index}`}
						>
							{(subField) => {
								return (
									<Badge className="w-min">
										{subField.state.value}{" "}
										<Button
											onClick={() => field.removeValue(index)}
											aria-label={`Remove redirect URI ${index + 1}`}
											className="size-4"
										>
											<X />
										</Button>
									</Badge>
								);
							}}
						</form.Field>
					))}
				</div>
			</Field>
		);
	}
}
