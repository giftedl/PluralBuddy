"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { cn } from "cn";
import { Material } from "./material";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			// Select Specific
			"appearance-none transition-colors rounded-lg text-sm w-full cursor-pointer px-3",
			"flex items-center h-9 justify-between",
			// Secondary Button Props
			"border border-slate-200 border-b-slate-300 dark:border-zinc-800 dark:border-t-zinc-700/50 bg-white dark:bg-zinc-900",
			"hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-700  dark:active:bg-zinc-900 active:bg-slate-200",
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronsUpDown className="h-4 w-4" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				"backdrop-blur-xl w-max max-w-[280px] origin-top-left shadow-xl rounded-xl relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className,
			)}
			position={position}
			{...props}
		>
			<div className="animate-scale-in">
				<Material
					className="flex flex-col py-2 list-none bg-white/80 dark:bg-zinc-900/80 px-2"
					color="distinct"
					padding="none"
					rounding="xl"
				>
					<SelectScrollUpButton />
					<SelectPrimitive.Viewport
						className={cn(
							"p-1",
							position === "popper" &&
								"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
						)}
					>
						{children}
					</SelectPrimitive.Viewport>
					<SelectScrollDownButton />
				</Material>
			</div>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, disabled, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		{...props}
		className={cn(
			"relative flex w-full select-none items-center data-[state=checked]:bg-slate-100! dark:data-[state=checked]:bg-zinc-800! rounded-lg py-1.5 pl-2 pr-8 text-sm outline-hidden focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
			"w-full px-2 rounded-lg cursor-pointer min-h-[36px] font-normal flex items-center dark:hover:bg-zinc-800/70 hover:bg-slate-100",
			disabled ? "opacity-70 pointer-events-none cursor-not-allowed" : "",
			"duration-100",
			className,
		)}
	>
		<SelectPrimitive.ItemIndicator />
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectScrollUpButton,
	SelectScrollDownButton,
};
