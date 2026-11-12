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
          <AvatarImage src="/image/pfp.png" />
          <AvatarFallback>pfp</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
    </HoverCard>
  );
}
