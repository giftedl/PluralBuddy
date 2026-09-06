import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TranscriptStat({
	icon,
	variant,
	className,
	value,
	description,
}: {
	icon: ({ className }: { className: string }) => ReactNode;
	variant: "add" | "update" | "remove";
	className?: string;
	value: ReactNode;
	description: ReactNode;
}) {
	const x = { icon };
	const color = cn(
		variant === "add" && "text-green-400",
		variant === "remove" && "text-red-400",
		variant === "update" && "text-yellow-400",
	);

	return (
		<div className={cn("text-center justify-center", className)}>
			<div className="w-min mx-auto">
				<div className="p-1.5 border bg-muted rounded-lg">
					<x.icon className={color} />
				</div>
			</div>
			<span className={cn("block text-xl font-bold pt-3", color)}>{value}</span>
			<span className={color}>{description}</span>
		</div>
	);
}