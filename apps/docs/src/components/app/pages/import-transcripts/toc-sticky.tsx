import { TOCItemType } from "fumadocs-core/toc";
import { ReactNode, useEffect, useState } from "react";
import { TOC, TOCProvider } from "@/components/layouts/docs/page/slots/toc";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TOCSticky({
	toc,
	destructive,
	setDestructive,
	children,
}: {
	toc: TOCItemType[];
	destructive: boolean;
	setDestructive: (bool: boolean) => void;
	children: ReactNode;
}) {
	const [scrollPosition, setScrollPosition] = useState(0);
	const handleScroll = () => {
		const scrollable = document.getElementById("scrollable") as HTMLElement;
		const toc = document.getElementById("nd-toc") as HTMLElement;
		const position = scrollable.scrollTop - toc.getBoundingClientRect().y * 3;
		setScrollPosition(position);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Errors are circular
	useEffect(() => {
		const scrollable = document.getElementById("scrollable") as HTMLElement;

		scrollable.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			scrollable.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<span className="text-left w-full">
			<h2 className="text-xl font-bold">Changes</h2>
			<div className="flex items-start">
				<div
					className={cn(
						"min-w-62.5",
						scrollPosition > 520 && "fixed top-20 max-w-10",
					)}
				>
					<TOCProvider toc={toc}>
						<TOC style="normal" noHide />
					</TOCProvider>
					<Tooltip>
						<TooltipTrigger>
							<div className="text-sm font-bold pb-0.5 underline decoration-dashed hover:no-underline">
								Diff Inclusion
							</div>
						</TooltipTrigger>
						<TooltipContent className=" max-w-[350px]">
							<span className="inline">
								If you push this sync operation destructively, alters & tags
								will be deleted, and they will not be included in the{" "}
								<code>alterIds</code> / <code>tagIds</code> fields on the
								system.
							</span>
						</TooltipContent>
					</Tooltip>
					<div className="flex items-center gap-1">
						<button
							type="button"
							className={cn(
								"text-xs p-1 rounded-sm transition-all",
								destructive && "bg-muted",
							)}
							onClick={() => setDestructive(true)}
						>
							Destructive
						</button>
						<button
							type="button"
							className={cn(
								"text-xs p-1 rounded-sm transition-all",
								!destructive && "bg-muted",
							)}
							onClick={() => setDestructive(false)}
						>
							Non-destructive
						</button>
					</div>
				</div>
				<div
					className={cn(
						"w-full grid gap-4",
						scrollPosition > 520 && "pl-65.25",
					)}
				>
					{children}
				</div>
			</div>
		</span>
	);
}

