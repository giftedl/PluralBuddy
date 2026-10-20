import { Menu as BMenu } from "@base-ui/react";
import {
	Book,
	LucideLogIn,
	Menu,
	Monitor,
	Moon,
	Settings,
	Sun,
	SwatchBook,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { GitHub } from "./icons/github";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu-v2";

export function AppTopbar() {
	const [expandedLabel, setExpandedLabel] = useState(false);

	const central = BMenu.createHandle();
	const menu = BMenu.createHandle();

	return (
		<nav className="w-full h-[57px] items-center fixed bg-background border-b px-3 py-1 flex justify-between">
			<PluralBuddyCentralContext central={central} />
			<DropdownMenuTrigger
				handle={central}
				type="button"
				onMouseOver={() => setExpandedLabel(true)}
				onMouseLeave={() => setExpandedLabel(false)}
				className="hover:bg-secondary data-[state=open]:bg-secondary transition-all px-2 py-0.5 rounded-lg h-min transition-all cursor-pointer"
			>
				<strong className="flex items-center gap-2">
					<div className="bg-[#3490FF] size-4 rounded-xl" />{" "}
					<span className="flex items-center gap-1">
						<AnimatePresence>
							{expandedLabel && (
								<motion.span
									initial={{
										translateY: 5,
										opacity: 0,
										width: 0,
										filter: "blur(4px)",
									}}
									animate={{
										translateY: 0,
										opacity: 100,
										width: "100%",
										filter: "blur(0px)",
									}}
									exit={{
										translateY: 5,
										opacity: 0,
										width: 0,
										filter: "blur(4px)",
									}}
									transition={{
										duration: 0.2,
									}}
								>
									PluralBuddy
								</motion.span>
							)}
						</AnimatePresence>
						Central
					</span>
				</strong>
			</DropdownMenuTrigger>

			<SettingsPopup menu={menu} />
			<DropdownMenuTrigger
				handle={menu}
				className={buttonVariants({
					variant: "ghost",
					size: "square-lg",
					className: "flex items-center",
					rounding: "pill",
				})}
			>
				<Menu className="size-4" />
			</DropdownMenuTrigger>
		</nav>
	);
}

export function PluralBuddyCentralContext({
	central,
}: {
	central: BMenu.Handle<unknown>;
}) {
	return (
		<DropdownMenu handle={central}>
			<DropdownMenuContent>
				<a href="https://pluralbuddy.app">
					<DropdownMenuItem className="flex items-center gap-1.5">
						<div className="bg-[#3490FF] size-4 rounded-xl" />
						PluralBuddy
					</DropdownMenuItem>
				</a>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex items-center gap-1.5">
					<Book className="size-4 stroke-muted-foreground" /> Documentation
				</DropdownMenuItem>
				<DropdownMenuItem className="flex items-center gap-1.5">
					<GitHub className="size-4 fill-muted-foreground" />
					GitHub
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function SettingsPopup({ menu }: { menu: BMenu.Handle<unknown> }) {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu handle={menu}>
			<DropdownMenuContent>
				<DropdownMenuItem className="flex items-center gap-1.5">
					<LucideLogIn className="size-4 stroke-muted-foreground" /> Log in
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex items-center gap-1.5">
					<Settings className="size-4 stroke-muted-foreground" /> Settings
				</DropdownMenuItem>

				<DropdownMenuSub>
					<DropdownMenuSubTrigger
						openOnHover={false}
						className="flex items-center gap-1.5"
					>
						<SwatchBook className="size-4 stroke-muted-foreground" /> Color
						schemes
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent
						side="bottom"
						sideOffset={0}
						alignOffset={-10}
					>
						<DropdownMenuItem
							className="flex items-center gap-1.5"
							onClick={() => setTheme("system")}
						>
							<Monitor className="size-4 stroke-muted-foreground" /> System
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex items-center gap-1.5"
							onClick={() => setTheme("dark")}
						>
							<Moon className="size-4 stroke-muted-foreground" /> Dark
						</DropdownMenuItem>
						<DropdownMenuItem
							className="flex items-center gap-1.5"
							onClick={() => setTheme("light")}
						>
							<Sun className="size-4 stroke-muted-foreground" /> Light
						</DropdownMenuItem>
					</DropdownMenuSubContent>
					<DropdownMenuSeparator />
					<div className="flex items-center justify-between p-2">
						<Badge variant="purple-subtle">1.0.0</Badge>
					</div>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
