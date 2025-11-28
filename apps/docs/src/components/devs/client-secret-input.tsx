"use client";

import { OAuthApplication } from "@/app/(home)/developers/applications/actions";
import { Input } from "../ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "../ui/input-group";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { generateNewSecret } from "@/app/(home)/developers/application/[application]/actions";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/lib/use-copy-to-clipboard";

export function ClientSecretInput({
	application,
}: {
	application: OAuthApplication;
}) {
	const [secret, setSecret] = useState<string | undefined>(undefined);
    const { copyToClipboard, isCopied } = useCopyToClipboard()

	const generateSecret = async () => {
		const returnData = await generateNewSecret(application.clientId);

		if (returnData.message !== undefined)
			toast.error("Error while resetting secret");

		setSecret(returnData.clientSecret);
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
