"use client";

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
import { Check, Copy, LayoutGrid } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../ui/empty";
import { OAuthClient } from "@better-auth/oauth-provider";
import { Button } from "../ui/shadcn-button";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function ScopesForm({ application }: { application: OAuthClient }) {
	const [scopes, setScopes] = useState<string[]>(
		(application.scope ?? "").split(" "),
	);
	const [redirectUri, setRedirectUri] = useState<string | undefined>(
		application.redirect_uris[0],
	);
	const pathname = process.env.NEXT_PUBLIC_HOST;
	const { copyToClipboard, isCopied } = useCopyToClipboard();

	return (
		<div>
			<FieldSet>
				<FieldGroup className="grid grid-cols-2 gap-2">
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
				<Button onClick={async () => {
					toast.promise(
						authClient.oauth2.updateClient({
							client_id: application.client_id,
							update: {
								scope: scopes.join(" ")
							}
						}), {
							success: "Updated scopes!",
							error: "Failed to update scopes!",
							loading: "Updating scopes...	"
						})
				}}>Update Client</Button>
			</FieldSet>
		</div>
	);
}
