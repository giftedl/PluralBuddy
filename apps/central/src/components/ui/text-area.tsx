"use client";

import type React from "react";
import { useRef } from "react";
import { Label } from "./label"; // Adjust the import path as necessary
import { generateID } from "../../lib/form-helper";

export type Size = "sm" | "md" | "lg";

const sizeClass = {
	sm: "p-3",
	md: "p-4",
	lg: "p-5",
};

interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	required?: boolean;
	size?: Size;
	rows?: number;
	className?: string;
	id?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
	label,
	value,
	placeholder = "",
	disabled = false,
	required = false,
	size = "md",
	rows = 4,
	id = generateID(),
	className = "",
	onChange,
	...restProps
}) => {
	const elementRef = useRef<HTMLTextAreaElement | null>(null);

	const borderClass = "border border-slate-200 dark:border-zinc-800";

	return (
		<div className={`flex flex-col gap-1 ${className}`}>
			{label && (
				<Label
					htmlFor={id}
					className={`peer-invalid:text-red-500 ${
						required ? "after:content-['*'] after:text-red-500 after:ml-1" : ""
					}`}
				>
					{label}
				</Label>
			)}
			<div
				className={`rounded-xl flex flex-col items-center text-sm bg-white dark:bg-zinc-950 ${className}`}
			>
				<textarea
					id={id}
					placeholder={placeholder}
					disabled={disabled}
					rows={rows}
					value={value}
					onChange={onChange}
					ref={elementRef}
					className={`${sizeClass[size]} ${borderClass} focus:border-slate-800 dark:focus:border-zinc-200 bg-white dark:bg-zinc-950 focus:outline-hidden focus:ring-2 ring-slate-800/50 rounded-xl dark:ring-zinc-200/50 transition-all text-sm w-full disabled:bg-slate-100 disabled:cursor-not-allowed invalid:border-red-500! peer invalid:text-red-500 z-10 ${className}`}
				/>
			</div>
			{restProps.children}
		</div>
	);
};

export { TextArea };
