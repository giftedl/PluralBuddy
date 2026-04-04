import { DiscordLoginComponent } from "@/components/discord-login";
import { ExpressAlterPage } from "@/components/pages/express-alter-page.client";
import { ExpressList } from "@/components/pages/express-page.client";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getAlter } from "../../../actions";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "PluralBuddy Express Alter - PluralBuddy App",
	description: "Add userproxies to PluralBuddy",
	applicationName: "PluralBuddy",
};

export default async function ExpressPage(props: PageProps<"/[lang]/app/express/alter/[alter]">) {

	const session = await auth.api.getSession({
		headers: await headers(),
	});
    const { alter } = await props.params;

	if (session === null) {
		return <DiscordLoginComponent />;
	}

    const alterObj = await getAlter(alter, true);
    
    if (!alterObj)
        return notFound();

    return <ExpressAlterPage alter={alterObj} />
}
