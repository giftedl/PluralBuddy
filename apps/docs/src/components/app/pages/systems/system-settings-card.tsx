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
import { useState } from "react";
import { MarkdownEditor } from "./markdown-editor";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import {findAndReplace} from "mdast-util-find-and-replace";

export function SystemSettingsCard({ data }: { data: PSystem }) {
	const t = useTranslations();

	const [currentDescription, setCurrentDescription] = useState(
		data.systemDescription ?? "",
	);
	const [currentName, setCurrentName] = useState(data.systemName ?? "");

	return (
		<Card className="mb-3">
			<CardContent>
				<CardTitle>System Settings</CardTitle>
				<CardDescription>
					Configure preferences related to just your system.
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
							{data.systemPronouns && (
								<span className="text-wrap wrap-anywhere">
									{data.systemPronouns}
								</span>
							)}
							<Separator className="h-px my-1" />
							{(
								(currentDescription ?? data.systemDescription).replace(
									" ",
									"",
								) !== ""
									? (currentDescription ?? data.systemDescription)
									: undefined
							) ? (
								<span className="text-wrap wrap-anywhere prose text-sm">
									<Markdown remarkPlugins={[remarkGfm, () => {
										return (tree) => {
											findAndReplace(tree, [
												/__(.*)__/g,
												 (_, $1) => {
													return { type: "mdxJsxTextElement", value: <u>{$1}</u>, name: "underlined-text", attributes: [], children: []}
												}
											])
										}
									}]} disallowedElements={["hr"]}>
										{(data.systemDescription ?? currentDescription).replaceAll("\n", "\n\n")}
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
							<Input
								id="name"
								value={currentName}
								onChange={(e) => setCurrentName(e.target.value)}
							/>

							<FieldDescription>
								The name of your system is how your system as a collective will
								be referred to.
							</FieldDescription>
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
							{currentDescription.length > 1000 ? <FieldError>Too many characters. Descriptions can only be {"<1000"} characters.</FieldError> : ""}
						</Field>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					disabled={
						currentDescription.replace(" ", "").replace("\n", "").replace("​", "") ===
							(data.systemDescription ?? "") && currentName === data.systemName
					}
				>
					Submit
				</Button>
			</CardFooter>
		</Card>
	);
}
