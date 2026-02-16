"use client";

import { Input } from "../ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";
import { authClient } from "@/lib/auth-client";
import { OAuthClient } from "@better-auth/oauth-provider";

export function ClientSecretInput({
	application,
}: {
	application: OAuthClient;
}) {
	const [secret, setSecret] = useState<string | undefined>(undefined);
    const { copyToClipboard, isCopied } = useCopyToClipboard()

	const generateSecret = async () => {
		const returnData = await authClient.oauth2.client.rotateSecret({
			client_id: application.client_id,
		});
		

		if (returnData.error)
			toast.error("Error while resetting secret");

		setSecret(returnData.data?.client_secret);
	};

	return (
		<InputGroup className="min-w-[245px]">
			<InputGroupInput
				id="client-secret"
				value={secret ?? "••••••••••••••"}
				readOnly
			/>
			<InputGroupAddon align="inline-end">
				{secret === undefined && (
					<InputGroupButton
						aria-label="Reset Secret"
						title="Reset Secret"
						variant="secondary"
						onClick={generateSecret}
					>
						Reset
					</InputGroupButton>
				)}
				{secret !== undefined && (
					<InputGroupButton
						aria-label="Copy"
						title="Copy"
						size="icon-xs"
						onClick={() => {
							copyToClipboard(secret);
						}}
					>
						{isCopied ? <Check /> : <Copy />}
					</InputGroupButton>
				)}
			</InputGroupAddon>
		</InputGroup>
	);
}
