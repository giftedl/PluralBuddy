/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";

export function SolarPicture() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Avatar>
					<AvatarImage src="/image/solar-centered.png" />
					<AvatarFallback>Solar</AvatarFallback>
				</Avatar>
			</TooltipTrigger>
			<TooltipContent className="text-center space-y-2 bg-card!" arrowClass="bg-card! fill-card!">
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
			</TooltipContent>
		</Tooltip>
	);
}
