import { useQuery } from "@tanstack/react-query";
import { DynamicPageTitle } from "../../dynamic-title";
import { db } from "@/lib/app/dexie";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/shadcn-button";
import { SystemSettingsCard } from "./system-settings-card";
import { NumberStats } from "./number-stats";

export default function SystemIndexPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["system/@me"],
		queryFn: async () => await db.systems.get("@me"),
	});

	if (isLoading) return <Spinner />;

	if (data)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<DynamicPageTitle title="System • PluralBuddy App" />
				<div className="max-md:space-y-3 items-center gap-6 w-full">
					<h1 className="text-2xl font-bold">{data?.systemName}</h1>
					<Separator className="h-px my-4" />
					<NumberStats data={data} />
                    <SystemSettingsCard data={data} />
				</div>
			</main>
		);

	return null;
}
