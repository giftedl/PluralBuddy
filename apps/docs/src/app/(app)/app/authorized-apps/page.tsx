import { ImportDataForm } from "@/components/app/import-data-form";
import { DiscordLoginComponent } from "@/components/discord-login";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { getImportDataById } from "@/lib/get-import";
import { ArrowUpRightIcon, CloudDownload } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthorizedAppsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session === null) {
		return <DiscordLoginComponent />;
	}

	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				
			</div>
		</main>
	);
}
