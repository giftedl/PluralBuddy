import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/shadcn-button";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PSystem } from "plurography";
import { useEffect, useState } from "react";
import { MarkdownEditor } from "./markdown-editor";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { findAndReplace } from "mdast-util-find-and-replace";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/cn";
import { db } from "@/lib/app/dexie";
import { Spinner } from "@/components/ui/spinner";

export function SystemSettingsCard({ data }: { data: PSystem }) {
	const t = useTranslations();

	const [currentDescription, setCurrentDescription] = useState(
		data.systemDescription ?? "",
	);
	const [currentName, setCurrentName] = useState(data.systemName ?? "");
	const [currentPronouns, setCurrentPronouns] = useState(
		data.systemPronouns ?? "",
	);

	const reload = async () => {
		const descChanged =
			currentDescription.replace(" ", "").replace("\n", "").replace("​", "") !==
			(data.systemDescription ?? "");
		const pnChanged = currentPronouns !== (data.systemPronouns ?? "");
		const nameChanged = currentName !== data.systemName;

		await db.systems.update("@me", {
			...(descChanged
				? {
						systemDescription: currentDescription,
					}
				: {}),
			...(nameChanged ? { systemName: currentName } : {}),
			...(pnChanged ? { systemPronouns: currentPronouns } : {}),
		});
	};

	useEffect(() => {
		reload();
	}, [currentDescription, currentName, currentPronouns]);

	return (
		<Card className="mb-3">
			<CardContent>
				<CardTitle>System Profile</CardTitle>
				<CardDescription>
					Configure preferences related to just your system profile.
				</CardDescription>
				<div className="md:flex pt-6 pb-10">
					<div className="rounded-xl md:min-w-89 max-w-89 h-full border p-4 grid gap-2">
						<div className="relative h-37.5">
							{data?.systemBanner ? (
								<img
									src={data?.systemBanner}
									className="w-[320px] h-[120px] rounded-xl z-0 object-cover"
									alt={t("alt_banner")}
								/>
							) : (
								<div className="bg-[#5865F2] w-full md:min-w-[320px] max-w-[320px] h-30 rounded-xl absolute" />
							)}

							<Avatar className="w-20 h-20 absolute bottom-0 left-2.5 border-6 border-card">
								<AvatarImage src={data?.systemAvatar ?? ""} />
								<AvatarFallback className="bg-[#5865F2] text-white text-2xl">
									{data.systemName[0]}
								</AvatarFallback>
							</Avatar>
						</div>

						<div className="bg-card-foreground/10 rounded-xl p-4 grid gap-2">
							<h1 className="text-[20px] font-bold text-wrap wrap-anywhere">
								{currentName ?? data.systemName}
							</h1>
							{(currentPronouns ?? data.systemPronouns) && (
								<span className="text-wrap wrap-anywhere">
									{currentPronouns ?? data.systemPronouns}
								</span>
							)}
							<Separator className="h-px my-1" />
							{(
								(currentDescription ?? data.systemDescription)
									.replace(" ", "")
									.replace("\n", "") !== ""
									? (currentDescription ?? data.systemDescription)
									: undefined
							) ? (
								<span className="text-wrap wrap-anywhere prose text-sm">
									<Markdown
										remarkPlugins={[
											remarkGfm,
											() => {
												return (tree: any) => {
													findAndReplace(tree, [
														/__(.*)__/g,
														(_, $1) => {
															return {
																type: "mdxJsxTextElement",
																value: <u>{$1}</u>,
																name: "underlined-text",
																attributes: [],
																children: [],
															};
														},
													]);
												};
											},
										]}
									>
										{(data.systemDescription ?? currentDescription).replaceAll(
											"\n",
											"\n\n",
										)}
									</Markdown>
								</span>
							) : (
								<Empty className="h-full bg-muted/30">
									<EmptyHeader>
										<EmptyTitle>It's empty here...</EmptyTitle>
										<EmptyDescription className="max-w-xs text-pretty">
											This system doesn't have a description!
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							)}
						</div>
					</div>
					<div className="px-4 max-md:py-4 max-w-full gap-3">
						<Field className="mb-6">
							<FieldLabel htmlFor="name">System Name</FieldLabel>

							<InputGroup>
								<InputGroupInput
									id="name"
									value={currentName}
									onChange={(e) => setCurrentName(e.target.value)}
								/>
								<InputGroupAddon align="block-end">
									<InputGroupText
										className={cn(
											"text-xs",
											currentName.length > 100
												? "text-red-400"
												: "text-muted-foreground",
										)}
									>
										{100 - currentName.length} characters left
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							<FieldDescription>
								The name of your system is how your system as a collective will
								be referred to.
							</FieldDescription>
							{currentName.length > 100 ? (
								<FieldError>
									Too many characters. System name can only be {"<100"}{" "}
									characters.
								</FieldError>
							) : (
								""
							)}
						</Field>
						<Field className="mb-6">
							<FieldLabel htmlFor="description">System Pronouns</FieldLabel>
							<InputGroup>
								<InputGroupInput
									id="pronouns"
									value={currentPronouns}
									onChange={(e) => setCurrentPronouns(e.target.value)}
								/>
								<InputGroupAddon align="block-end">
									<InputGroupText
										className={cn(
											"text-xs",
											currentPronouns.length > 100
												? "text-red-400"
												: "text-muted-foreground",
										)}
									>
										{100 - currentPronouns.length} characters left
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							<FieldDescription>
								Express your inner identity 🎀
							</FieldDescription>
							{currentPronouns.length > 100 ? (
								<FieldError>
									Too many characters. Pronouns can only be {"<100"} characters.
								</FieldError>
							) : (
								""
							)}
						</Field>
						<Field>
							<FieldLabel htmlFor="description">System Description</FieldLabel>
							<MarkdownEditor
								description={currentDescription}
								setDescription={setCurrentDescription}
							/>
							<FieldDescription>
								This appears in public environments in PluralBuddy.
							</FieldDescription>
							{currentDescription.length > 1000 ? (
								<FieldError>
									Too many characters. Descriptions can only be {"<1000"}{" "}
									characters.
								</FieldError>
							) : (
								""
							)}
						</Field>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
