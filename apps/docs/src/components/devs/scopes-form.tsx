"use client";

import { OAuthApplication } from "@/app/(home)/developers/applications/actions";
import { useState } from "react";
import { scopeList } from "./create-new-app-form";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { Check, Copy } from "lucide-react";

export function ScopesForm({ application }: { application: OAuthApplication }) {
	const [scopes, setScopes] = useState<string[]>(
		JSON.parse(application.metadata ?? '{"scopes":""}').scopes.split(" "),
	);
	const [redirectUri, setRedirectUri] = useState<string | undefined>(
		application.redirectUrls === ""
			? undefined
			: application.redirectUrls.split(",")[0],
	);
	const pathname = process.env.NEXT_PUBLIC_HOST;
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	return (
		<div>
			<FieldSet>
				<FieldGroup className="grid grid-cols-2 gap-2">
					<FieldLabel className="col-span-2">1. Scopes</FieldLabel>
					{scopeList.map((scope) => (
						<div key={scope.title} className="space-y-1">
							<Field orientation="horizontal">
								<Checkbox
									id={`form-tanstack-checkbox-${scope.title}`}
									name={scope.title}
									checked={scopes.includes(scope.title)}
									disabled={scope.title === "profile"}
									className="cursor-pointer"
									onCheckedChange={(checked) => {
										if (checked) {
											setScopes((array) => [...array, scope.title]);
										} else {
											const index = scopes.indexOf(scope.title);
											if (index > -1) {
												const newScopes = [...scopes];
												newScopes.splice(index, 1);
												setScopes(newScopes);
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
				<FieldGroup>
					<Field>
						<FieldLabel>2. Redirect URI</FieldLabel>

						<Select value={redirectUri} onValueChange={setRedirectUri}>
							<SelectTrigger>
								<SelectValue placeholder="Choose Redirect URI" />
							</SelectTrigger>
							<SelectContent>
								{application.redirectUrls.split(",").map((uri) => (
									<SelectItem value={uri} key={uri}>
										{uri}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
				</FieldGroup>
				<FieldGroup>
					<Field>
						<FieldLabel>3. Resulting URL</FieldLabel>

						<InputGroup className="min-w-[245px]">
							<InputGroupInput
								id="client-secret"
								readOnly
								value={`${pathname}/api/auth/oauth2/authorize?client_id=${application.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri ?? "")}&scope=${encodeURIComponent(scopes.join(" "))}`}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									aria-label="Copy"
									title="Copy"
									size="icon-xs"
									onClick={() => {
										copyToClipboard(
											`${pathname}/api/auth/oauth2/authorize?client_id=${application.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri ?? "")}&scope=${encodeURIComponent(scopes.join(" "))}`,
										);
									}}
								>
									{isCopied ? <Check /> : <Copy />}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</Field>
				</FieldGroup>
			</FieldSet>
		</div>
	);
}
