import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { DynamicPageTitle } from "../../dynamic-title";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useTRPCClient } from "@/server/client";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Cloud } from "lucide-react";
import { ProfileCard } from "./profile-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { AvatarCard } from "./avatar-card";
import { DestructiveCard } from "./destructive-card";
import { AccountLinksCard } from "./account-links-card";

export default function ProfilePage() {
	const trpcClient = useTRPCClient();
	const { data, isPending } = useQuery({
		queryKey: ["profile-data"],
		queryFn: async () => trpcClient.account.getAccountSettings.query(),
	});
	const sessionData = authClient.useSession();

	if (isPending || sessionData.isPending)
		return (
			<div className="grid grid-cols-1 my-7.5 border p-3 rounded-2xl relative">
				<div className="fixed block top-[50%] right-[50%] ">
					<Spinner />
				</div>
			</div>
		);

	return (
		<main className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-250 mb-3">
			<DynamicPageTitle title="Profile • PluralBuddy App" />
			<Card className="w-full">
				<CardContent>
					<Breadcrumb className="text-left">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink>Settings</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/app/settings/account">
									Profile
								</BreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</CardContent>
			</Card>

			{data?.noSystem !== undefined || data === undefined ? (
				<>
					<Empty className="border border-dashed">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Cloud />
							</EmptyMedia>
							<EmptyTitle>No System</EmptyTitle>
							<EmptyDescription>
								Create a system on Discord to manage your entire system.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
					<AccountLinksCard />
				</>
			) : (
				<div className="max-md:space-y-3 items-center gap-6 w-full">
					<Card className="w-full mb-4">
						<CardContent>
							<CardTitle>Profile</CardTitle>
							<CardDescription>
								Edit the settings of your PluralBuddy profile here.
							</CardDescription>
						</CardContent>
					</Card>
					<Separator className="mb-4" />
					<div className="space-y-4">
						<AccountLinksCard />
						<AvatarCard data={data} sessionData={sessionData} />
						<ProfileCard data={data} />
					</div>
				</div>
			)}
			<DestructiveCard sessionData={sessionData} />
		</main>
	);
}
