/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use client";

import { Highlighter } from "@/components/ui/highlighter";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { Dithering, GrainGradient } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { SVGProps } from "react";

export function Hero() {
	const { resolvedTheme } = useTheme();

	return (
		<GrainGradient
			colors={
				resolvedTheme === "dark"
					? ["#2e0066", "#8200a9", "#004c66", "#110066"]
					: ["#7300ff", "#eba8ff", "#00bfff", "#2b00ff"]
			}
			colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
			softness={1}
			intensity={0.9}
			noise={0.5}
			speed={1}
			shape="corners"
			minPixelRatio={1}
			maxPixelCount={1920 * 1080}
			className="absolute w-full h-full inset-0 animate-fd-fade-in duration-3000 fade-in"
		/>
	);
}

export function GithubLogo(props: SVGProps<SVGSVGElement>) {
	const { resolvedTheme } = useTheme();

	return resolvedTheme === "dark" ? (
		<GithubDark {...props} />
	) : (
		<GithubLight {...props} />
	);
}

export function DynamicHighligher({ children }: { children: string }) {
	const { resolvedTheme } = useTheme();

	return (
		<Highlighter
			action="highlight"
			color={resolvedTheme === "dark" ? "#841B50" : "#E1C2D2"}
		>
			{children}
		</Highlighter>
	);
}
