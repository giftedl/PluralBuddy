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
import { SimplexNoise } from "@paper-design/shaders-react";
import { motion } from "motion/react";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Link } from "react-router";
import { Boxes, ChevronRightIcon, Monitor, Settings, Tags } from "lucide-react";

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
					<motion.h1
						className="text-2xl font-bold"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 100, y: 0 }}
						transition={{ type: "tween" }}
					>
						{data?.systemName}
					</motion.h1>
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 100, y: 0 }}
						transition={{ type: "tween" }}
					>
						<Separator className="h-px my-4" />
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 100, y: 0 }}
						transition={{ type: "tween", delay: 0.2 }}
					>
						<Card className="mb-3">
							<CardContent>
								<CardTitle className="pb-3">Welcome to PluralBuddy</CardTitle>

								<SimplexNoise
									width={1000}
									height={720}
									colors={["#4449cf", "#ffd1e0", "#f94346"]}
									stepsPerColor={2}
									softness={0}
									speed={0.5}
									scale={0.6}
									className="rounded-2xl block max-h-50 py-4 max-w-full"
								/>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 100, y: 0 }}
						transition={{ type: "tween", delay: 0.4 }}
					>
						<NumberStats data={data} />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 100, y: 0 }}
						transition={{ type: "tween", delay: 0.6 }}
						className="grid gap-3"
					>
						<Item variant="outline" size="sm" asChild>
							<Link to="/app/system/system">
								<ItemMedia>
									<Monitor className="size-5" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>System</ItemTitle>
								</ItemContent>
								<ItemActions>
									<ChevronRightIcon className="size-4" />
								</ItemActions>
							</Link>
						</Item>
						<Item variant="outline" size="sm" asChild>
							<Link to="/app/system/alters">
								<ItemMedia>
									<Boxes className="size-5" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Alters</ItemTitle>
								</ItemContent>
								<ItemActions>
									<ChevronRightIcon className="size-4" />
								</ItemActions>
							</Link>
						</Item>
						<Item variant="outline" size="sm" asChild>
							<Link to="/app/system/tags">
								<ItemMedia>
									<Tags className="size-5" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Tags</ItemTitle>
								</ItemContent>
								<ItemActions>
									<ChevronRightIcon className="size-4" />
								</ItemActions>
							</Link>
						</Item>
						<Item variant="outline" size="sm" asChild>
							<Link to="/app/settings">
								<ItemMedia>
									<Settings className="size-5" />
								</ItemMedia>
								<ItemContent>
									<ItemTitle>Settings</ItemTitle>
								</ItemContent>
								<ItemActions>
									<ChevronRightIcon className="size-4" />
								</ItemActions>
							</Link>
						</Item>
					</motion.div>
				</div>
			</main>
		);

	return null;
}
