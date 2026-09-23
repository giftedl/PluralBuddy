"use client";

import type React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	forID?: string;
	text?: string;
}

const Label: React.FC<LabelProps> = ({
	forID,
	text,
	className,
	children,
	...rest
}) => {
	const Tag = forID ? "label" : "span";

	return (
		<Tag
			{...rest}
			htmlFor={forID}
			className={`text-sm text-slate-800 dark:text-zinc-200 font-medium w-full ${
				className || ""
			}`}
		>
			{text || (children && <>{children}</>)}
		</Tag>
	);
};

export { Label };
