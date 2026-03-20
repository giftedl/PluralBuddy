import { DiscordLoginComponent } from "@/components/discord-login";
import { ExpressList } from "@/components/pages/express-page.client";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
	title: "PluralBuddy Express - PluralBuddy App",
	description: "Add userproxies to PluralBuddy",
	applicationName: "PluralBuddy",
};

export default async function ExpressPage() {

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session === null) {
		return <DiscordLoginComponent />;
	}

    return <ExpressList />
}
