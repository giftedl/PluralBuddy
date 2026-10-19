"use client";

import { OAuthClient } from "@better-auth/oauth-provider";
import { Check, Copy, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../ui/empty";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/shadcn-button";
import { scopeList } from "./create-new-app-form";

export function ScopesForm({ application }: { application: OAuthClient }) {
	const [scopes, setScopes] = useState<string[]>(
		(application.scope ?? "").split(" "),
	);

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Scopes</CardTitle>
			</CardHeader>
			<CardContent>
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
					</FieldSet>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={async () => {
						toast.promise(
							authClient.oauth2.updateClient({
								client_id: application.client_id,
								update: {
									scope: scopes.join(" "),
								},
							}),
							{
								success: "Updated scopes!",
								error: "Failed to update scopes!",
								loading: "Updating scopes...	",
							},
						);
					}}
				>
					Update Client
				</Button>
			</CardFooter>
		</Card>
	);
}
