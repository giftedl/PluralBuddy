import { useRouter } from "@tanstack/react-router";
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
import type React from "react";
import { GitHub } from "./icons/github";
import { Button } from "./ui/button";
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
	return (
		<nav className="w-full h-10 fixed bg-background border-b px-3 py-1 xl:px-30 flex justify-between">
			<PluralBuddyCentralContext>
				<strong className="text-sm">PluralBuddy Central</strong>
			</PluralBuddyCentralContext>

			<SettingsPopup>
				<Button
					size="square-md"
					rounding="pill"
					variant="elevated"
					className="flex items-center"
				>
					<Menu className="size-4" />
				</Button>
			</SettingsPopup>
		</nav>
	);
}

export function PluralBuddyCentralContext({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<button
					type="button"
					className="hover:bg-secondary data-[state=open]:bg-secondary px-2 rounded-lg py-0.5 transition-all cursor-pointer"
				>
					{children}
				</button>
			</DropdownMenuTrigger>
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

export function SettingsPopup({ children }: { children: React.ReactNode }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>{children}</DropdownMenuTrigger>
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
                        <DropdownMenuItem className="flex items-center gap-1.5">
                            <Monitor className="size-4 stroke-muted-foreground" /> System
                        </DropdownMenuItem>
						<DropdownMenuItem className="flex items-center gap-1.5">
							<Moon className="size-4 stroke-muted-foreground" /> Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-1.5">
                            <Sun className="size-4 stroke-muted-foreground" /> Light
                        </DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
