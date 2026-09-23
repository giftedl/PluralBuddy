"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "react";

const cardVariants = cva("text-sm", {
	variants: {
		elevation: {
			flat: "",
			low: "shadow-2xs",
			medium: "shadow-xs",
			high: "shadow-md",
			xhigh: "shadow-lg",
			max: "shadow-xl",
		},
		padding: {
			none: "p-0",
			sm: "p-2",
			md: "p-4",
			lg: "p-5",
			xl: "p-6",
		},
		rounding: {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			"2xl": "rounded-2xl",
			full: "rounded-full",
		},
		color: {
			default:
				"bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700",
			distinct:
				"bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700",
			transparent:
				"border border-slate-200 dark:border-zinc-900 border-b-slate-300 dark:border-t-zinc-800",
			none: "",
		},
	},
	defaultVariants: {
		elevation: "flat",
		padding: "md",
		rounding: "lg",
		color: "default",
	},
});

export interface MaterialProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
		VariantProps<typeof cardVariants> {}

const Material = forwardRef<HTMLDivElement, MaterialProps>(
	({ className, elevation, padding, rounding, color, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cardVariants({
					elevation,
					padding,
					rounding,
					color,
					className,
				})}
				{...props}
			/>
		);
	},
);

Material.displayName = "Material";

export { Material };
