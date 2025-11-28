"use client";

import { OAuthApplication } from "@/app/(home)/developers/applications/actions";
import { Field, FieldDescription } from "../ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { Badge } from "../ui/badge";
import { Button } from "../ui/shadcn-button";
import { X } from "lucide-react";
import { useState } from "react";
import { urlRegex } from "./create-new-app-form";
import { toast } from "sonner";
import { changeRedirectURIs } from "@/app/(home)/developers/application/[application]/actions";

export function RedirectURLs({
	application,
}: {
	application: OAuthApplication;
}) {
	const [existingURIs, setExistingURIs] = useState<string[]>(
		application.redirectUrls === "" ? [] : application.redirectUrls.split(","),
	);
	const [value, setValue] = useState<string>("");

	return (
		<Field>
			<FieldDescription>
				This is the allowed redirect URI's for the application.
			</FieldDescription>

			<InputGroup>
				<InputGroupInput
					placeholder="https://acme.com/api/callback"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupButton
						variant="secondary"
						disabled={existingURIs.length === 10}
						onClick={() => {
							if (!urlRegex.test(value)) toast.error("Value is not a URL");
							else {
								setExistingURIs((existing) => [...existing, value]);
								setValue("");
								changeRedirectURIs(application.clientId, existingURIs);
							}
						}}
					>
						Add
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>

			<div className="flex items-center gap-1">
				{existingURIs.map((name: string, i: number) => (
					<Badge className="w-min" key={name}>
						{name}{" "}
						{existingURIs.length !== 1 && (
							<Button
								aria-label={`Remove redirect URI ${i + 1}`}
								className="size-4"
								onClick={() => {
									const index = existingURIs.indexOf(name);
									if (index > -1) {
										const newScopes = [...existingURIs];
										newScopes.splice(index, 1);
										setExistingURIs(newScopes);

										changeRedirectURIs(application.clientId, newScopes);
									}
								}}
							>
								<X />
							</Button>
						)}
					</Badge>
				))}
			</div>
		</Field>
	);
}
