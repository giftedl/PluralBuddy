"use client";

import {
	ImportNotation,
	PluralKitConfiguration,
	PluralKitSystem,
	PSystemObject,
	TupperBoxSystem,
	type ImportStage,
} from "plurography";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
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
	InputGroupButton,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Upload } from "lucide-react";
import { Button } from "../ui/shadcn-button";
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
import { Label } from "../ui/label";
import { Callout } from "../callout";

const formSchema = z.object({
	from: z.enum(["PluralBuddy", "PluralKit", "TupperBox"], {
		error: "You must select a valid option.",
	}),
	data: z
		.string()
		.min(20, "Import must be at least 20 characters.")
		.refine(
			(val) => {
				try {
					JSON.parse(val);
				} catch {
					return false;
				}
				return true;
			},
			{ error: "Must be valid JSON." },
		),
});

export function ImportDataForm({ importData }: { importData: ImportStage }) {
	const [open, setOpen] = useState(false);
	const [alterCount, setAlterCount] = useState(0);
	const [tagCount, setTagCount] = useState(0);
	const [type, setType] = useState("");
	const [data, setData] = useState("");

	const form = useForm({
		defaultValues: {
			from: "",
			data: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setType(value.from);
			switch (value.from) {
				case "PluralKit": {
					const parsedData = PluralKitSystem.safeParse(JSON.parse(value.data));

					if (parsedData.error) {
						toast.error("This is not a valid PluralKit configuration.");
						return;
					}

					setAlterCount(parsedData.data.members.length);
					setTagCount(parsedData.data.groups.length);

					break;
				}
				case "TupperBox": {
					const parsedData = TupperBoxSystem.safeParse(JSON.parse(value.data));

					if (parsedData.error) {
						toast.error("This is not a valid PluralKit configuration.");
						return;
					}

					setAlterCount(parsedData.data.tuppers.length);
					setTagCount(parsedData.data.groups.length);

					break;
				}
				case "PluralBuddy": {
					const parsedData = ImportNotation.safeParse(JSON.parse(value.data));

					if (parsedData.error) {
						toast.error("This is not a valid PluralBuddy configuration.");
						return;
					}

					setAlterCount(parsedData.data.alters.length);
					setTagCount(parsedData.data.tags.length);

					break;
				}
			}

			setData(value.data);
			setOpen(true);
		},
	});

	return (
		<form
			id="bug-report-form"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="from">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>Import From</FieldLabel>

								<Select
									name={field.name}
									value={field.state.value}
									onValueChange={field.handleChange}
								>
									<SelectTrigger
										id="form-tanstack-select-language"
										aria-invalid={isInvalid}
										className="min-w-[120px]"
									>
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent position="item-aligned">
										<SelectItem value="PluralBuddy">PluralBuddy</SelectItem>
										<SelectSeparator />
										<SelectItem value="PluralKit">PluralKit</SelectItem>
										<SelectItem value="TupperBox">TupperBox</SelectItem>
									</SelectContent>
								</Select>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
				<form.Field name="data">
					{(field) => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel htmlFor={field.name}>JSON Data</FieldLabel>
								<InputGroup>
									<InputGroupTextarea
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										rows={6}
										className="min-h-24 max-h-24 resize-none z-0"
										aria-invalid={isInvalid}
									/>
									<InputGroupAddon align="block-end">
										<label className="flex items-center cursor-pointer">
											<input
												id={`${field.name}-file-input`}
												type="file"
												accept=".json,application/json"
												className="sr-only"
												onChange={async (e) => {
													const file = e.currentTarget.files?.[0];
													if (!file) return;
													try {
														const text = await file.text();
														try {
															JSON.parse(text);
															field.handleChange(text);
														} catch (err) {
															toast.error(
																"This file is not a valid JSON file – please try again.",
															);
														}
													} catch (err) {
														console.log(err);
														toast.error("Failed to read file");
													}
												}}
											/>
											<InputGroupButton
												type="button"
												onClick={() => {
													const el = document.getElementById(
														`${field.name}-file-input`,
													) as HTMLInputElement | null;
													el?.click();
												}}
											>
												<Upload /> Upload File
											</InputGroupButton>
										</label>
									</InputGroupAddon>
								</InputGroup>
								<FieldDescription>
									Input the data exported from the plurality bot you selected
									above.
								</FieldDescription>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>
			<Button type="submit" className="absolute bottom-0 w-[calc(100%-32px)]">
				Send Data
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-sm overflow-y-auto max-lg:max-h-[calc(100vh-150px)] z-1000">
					<DialogHeader>
						<DialogTitle className="grid gap-2">
							<div className="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-full [&_svg:not([class*='size-'])]:size-4">
								<Upload />
							</div>{" "}
							<span>Finalizing Import...</span>
						</DialogTitle>
						<ul className="list-disc pl-5 mb-2">
							<li>
								<b>{alterCount} alter(s)</b> will be{" "}
								{importData.importMode === "replace"
									? "replaced"
									: importData.importMode === "add"
										? "added"
										: "replaced and added"}{" "}
								into your system.
							</li>
							<li>
								<b>{tagCount} tag(s)</b> will be{" "}
								{importData.importMode === "replace"
									? "replaced"
									: importData.importMode === "add"
										? "added"
										: "replaced and added"}{" "}
								into your system.
							</li>
						</ul>
						<DialogDescription>
							Are you sure you'd like to import this data into your PluralBuddy
							system?
							<Callout type="warning" className="*:*:*:mb-2">
								<p>
									There are numerous considerations you may run into while
									importing depending on the platform you are importing from.
								</p>
								{type === "PluralKit" && (
									<p>
										For example, in <b>PluralKit</b>, by default, usernames
										converted from PluralKit are just the members name, and
										removing special characters and such. This is because in
										PluralBuddy, usernames are required, and "names" are the
										only required PluralKit identification property.
									</p>
								)}
								<p>
									Please keep these differences in mind! This is why there are
									different modes (ie. replace and add) before changing an
									entire system! PluralBuddy Support may not be able to restore
									systems that are broken from importing!
								</p>
							</Callout>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
            <Button type="submit" onClick={() => {
              
						}}>
							Finalize & Import
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</form>
	);
}
