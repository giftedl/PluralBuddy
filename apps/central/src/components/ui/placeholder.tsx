import { cn } from "cn";
import type { ReactNode } from "react";

function Placeholder({
	icon,
	title,
	description,
	children,
	className,
}: {
	icon?: ReactNode;
	title?: ReactNode | string;
	description?: ReactNode | string;
	className?: string;
	children?: ReactNode;
}) {
	return (
		<div
			className={cn(
				"text-slate-700 dark:text-zinc-300 flex flex-col justify-center items-center gap-2",
				className,
			)}
		>
			{icon && (
				<div className="border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 p-3 rounded-full">
					{icon}
				</div>
			)}
			<div className="flex flex-col gap-1 text-center">
				<h1 className="text-slate-900 dark:text-zinc-100 text-lg font-medium">
					{title}
				</h1>
				{description && (
					<p className="text-sm text-center font-normal">{description}</p>
				)}
			</div>
			{children}
		</div>
	);
}

export { Placeholder };
