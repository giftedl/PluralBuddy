import { cn } from "cn";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { get3rdPartyIntegrations } from "@/server/get-3rd-party-integrations";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/shadcn-button";
import { SearchAndContents } from "./search";

export async function ThirdPartyIntegrationViewer() {
	const integrations = await get3rdPartyIntegrations();

	return (
		<div className="flex flex-col gap-3">
            <SearchAndContents integrations={integrations} />
		</div>
	);
}
