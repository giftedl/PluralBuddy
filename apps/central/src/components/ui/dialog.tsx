"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "cn";
import { Button, type ButtonProps } from "./button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay ref={ref} asChild {...props}>
		<motion.div
			className={cn(
				"fixed bg-[#ffffff]/50 dark:bg-black/50 inset-0 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				className,
			)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.1 }}
		/>
	</DialogPrimitive.Overlay>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogAction = (props: ButtonProps) => {
	return <Button {...props} className="mt-2 w-full" size="lg" rounding="xl" />;
};

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPortal>
		<DialogOverlay />
		<motion.div
			style={{
				position: "fixed",
				top: "50%",
				left: "50%",
				width: "100%",
				maxWidth: "32rem",
				transformOrigin: "center center",
			}}
			initial={{ scale: 0.95, opacity: 0, x: "-50%", y: "-50%" }}
			animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
			transition={{
				type: "spring",
				stiffness: 200,
				damping: 20,
				duration: 0.3,
			}}
		>
			<DialogPrimitive.Content
				ref={ref}
				{...props}
				className={cn(
					"top-[50%] left-[50%] max-h-[85vh] translate-x-[-50%] translate-y-[-50%] focus:outline-none",
					"w-full border border-slate-200 border-b-slate-300",
					"dark:border-zinc-900 dark:border-t-zinc-800 dark:border-b-zinc-900",
					"rounded-2xl max-w-lg box-border mx-auto overscroll-contain shadow-lg overflow-auto",
					"p-5 flex flex-col gap-2 dark:bg-zinc-950 rounded-xl",
					"bg-white fixed z-100",
					className,
				)}
			>
				{children}
				<DialogPrimitive.Close asChild>
					<Button
						className="absolute top-0 right-0 m-2 text-slate-600 dark:text-zinc-400 flex items-center"
						variant="tertiary"
						size="square-sm"
					>
						<X size={16} />
					</Button>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</motion.div>
	</DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-1.5 text-center sm:text-left font-semibold text-xl max-w-full",
			className,
		)}
		{...props}
	/>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
			className,
		)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("font-semibold text-xl max-w-full", className)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
	DialogAction,
};
