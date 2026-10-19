"use client";
import { useTheme } from "next-themes";
import { Fragment, JSX, useEffect, useLayoutEffect, useState } from "react";
import { highlight } from "./shared-shiki";

export function CodeBlock({
	initial,
	children,
	className,
}: {
	initial?: JSX.Element;
	children: string;
	className?: string;
}) {
	const [nodes, setNodes] = useState(initial);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		console.log(resolvedTheme);
		void highlight(
			children,
			"ts",
			resolvedTheme === "dark" ? "catppuccin-mocha" : "catppuccin-latte",
		).then(setNodes);
	}, [children, resolvedTheme]);

	return nodes ? <div className={className}>{nodes}</div> : <p>Loading...</p>;
}
