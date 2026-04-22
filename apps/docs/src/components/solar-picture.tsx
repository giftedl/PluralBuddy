/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export function SolarPicture() {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Avatar>
					<AvatarImage src="/image/solar-centered.png" />
					<AvatarFallback>Solar</AvatarFallback>
				</Avatar>
			</HoverCardTrigger>
			<HoverCardContent className="text-center space-y-2 bg-card!">
				<Image
					src="/image/solar.png"
					width={256}
					height={256}
					alt="Solar"
					className="rounded-lg"
				/>
				<Link href="https://toyhou.se/21588437.solar#111133901" className="text-accent-foreground underline">
					Solar drawing by @raincloudzy
				</Link>
			</HoverCardContent>
		</HoverCard>
	);
}
