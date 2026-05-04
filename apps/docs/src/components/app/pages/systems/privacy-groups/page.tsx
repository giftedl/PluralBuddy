import { useSystem } from "@/lib/app/use-system";
import { Spinner } from "@/components/ui/spinner";
import { DynamicPageTitle } from "@/components/app/dynamic-title";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { usePrivacyGroups } from "@/lib/app/use-privacy-groups";
import { Button } from "@/components/ui/shadcn-button";
import { Plus, SquarePlus } from "lucide-react";
import { useQueryState } from "nuqs";
import { CreateNewGroupPopover } from "@/components/app/pages/systems/privacy-groups/create-new-group-popover";
import { ColorSwatch } from "@/components/ui/color-swatch";
import { parseColor } from "@react-stately/color";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import { PrivacyGroupSettings } from "./privacy-group-settings";

export function PrivacyGroupsSettingsAppPage() {
	const { data } = useSystem();
	const { data: privacyGroups } = usePrivacyGroups();
	const [selected, setSelected] = useQueryState("g");

	const selectedGroup = privacyGroups?.find((v) => selected === v.id);

	if (data)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<DynamicPageTitle title="Privacy Groups • PluralBuddy App" />
				<div className="max-md:space-y-3 items-center gap-6 w-full">
					<motion.h1
						className="text-2xl font-bold"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 100, y: 0 }}
						transition={{ type: "tween" }}
					>
						Privacy Groups - {data?.systemName}
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
						<Card className="mt-3">
							<CardContent>
								<CardTitle>Privacy Groups</CardTitle>
								<CardDescription>
									Privacy groups allows you to make only certain people access
									certain things about applicable systems, alters & tags.
								</CardDescription>

								<motion.div
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 100, y: 0 }}
									transition={{ type: "tween", delay: 0.4 }}
								>
									<ResizablePanelGroup
										orientation="horizontal"
										className="h-max w-full mt-4 border rounded-lg"
									>
										<ResizablePanel
											className="p-4 grid gap-2"
											minSize={300}
											defaultSize={300}
											maxSize={400}
										>
											{privacyGroups?.map((c) => (
												<Button
													variant={c.id === selected ? "outline" : "ghost"}
													className="w-full text-left flex items-center justify-start!"
													key={c.id}
													onClick={() => setSelected(c.id)}
												>
													<ColorSwatch
														className="max-w-5 max-h-5"
														color={parseColor(`${c.color}`)}
													/>
													<p className="truncate max-w-50">{c.name}</p>
												</Button>
											))}
											<CreateNewGroupPopover>
												<Button
													variant="ghost"
													className="w-full text-left flex items-center justify-start!"
												>
													<SquarePlus /> Create Privacy Group
												</Button>
											</CreateNewGroupPopover>
										</ResizablePanel>
										<ResizableHandle />
										<ResizablePanel className="p-4">
											{selectedGroup && (
												<PrivacyGroupSettings data={selectedGroup} />
											)}
										</ResizablePanel>
									</ResizablePanelGroup>
								</motion.div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</main>
		);

	return null;
}
