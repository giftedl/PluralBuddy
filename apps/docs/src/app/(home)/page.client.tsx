/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use client";

import { Dithering, GrainGradient } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";

export function Hero() {
	const { resolvedTheme } = useTheme();

	return (
		<GrainGradient
			colors={resolvedTheme === "dark" ? ["#2e0066", "#8200a9", "#004c66", "#110066"] : ["#7300ff", "#eba8ff", "#00bfff", "#2b00ff"]}
			colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
			softness={1}
			intensity={0.9}
			noise={0.5}
			speed={1}
			shape="corners"
			minPixelRatio={1}
			maxPixelCount={1920 * 1080}
			className="absolute w-full h-full"
		/>
	);
}
