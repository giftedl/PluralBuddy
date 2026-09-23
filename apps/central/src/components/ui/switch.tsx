"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "cn";

const Switch = React.forwardRef<
	React.ElementRef<typeof SwitchPrimitives.Root>,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			"peer inline-flex w-11 h-6 shrink-0 cursor-pointer items-center rounded-full border-2 data-[state=unchecked]:border-transparent data-[state=checked]:!border-shadcn-primary shadow-xs",
			"transition-colors focus-visible:outline-hidden ",
			"data-[state=unchecked]:bg-input data-[state=checked]:bg-shadcn-primary",
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				"box-border w-5 h-full bg-white dark:bg-black rounded-full shadow-xs",
				"transition data-[state=checked]:translate-x-5",
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
