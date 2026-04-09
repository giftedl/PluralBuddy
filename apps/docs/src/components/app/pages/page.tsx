import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { DynamicPageTitle } from "../dynamic-title";
import { Card, CardContent } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Link } from "react-router";
import { BadgeCheckIcon, ChevronRightIcon, TrainFront } from "lucide-react";

export function IndexSettingsAppPage() {
	return (
		<main className="flex w-full flex-1 flex-col gap-3 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<DynamicPageTitle title="Settings • PluralBuddy App" />
			<Card className="w-full">
				<CardContent>
					<Breadcrumb className="text-left">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink>Settings</BreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</CardContent>
			</Card>
			<Item variant="outline" size="sm" asChild>
				<Link to="/app/settings/authorized-apps">
					<ItemMedia>
						<BadgeCheckIcon className="size-5" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>Authorized Applications</ItemTitle>
					</ItemContent>
					<ItemActions>
						<ChevronRightIcon className="size-4" />
					</ItemActions>
				</Link>
			</Item>
			<Item variant="outline" size="sm" asChild>
				<Link to="/app/settings/authorized-apps">
					<ItemMedia>
						<TrainFront className="size-5" />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>PluralBuddy Express</ItemTitle>
					</ItemContent>
					<ItemActions>
						<ChevronRightIcon className="size-4" />
					</ItemActions>
				</Link>
			</Item>
		</main>
	);
}
