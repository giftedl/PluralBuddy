/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

"use client";

import { ChevronRight } from "lucide-react";
import { SolarPicture } from "./solar-picture";
import { FlickeringGrid } from "./ui/flickering-grid";
import { Separator } from "./ui/separator";
import { JSX } from "react";
import Link from "next/link";
import { m } from "@/paraglide/messages";

export function Footer() {
	return (
		<footer className="w-full pb-0 flex flex-col md:flex-row md:items-center md:justify-between p-10">
			<div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0">
				<span className="flex items-center gap-2">
					<SolarPicture />
					PluralBuddy
				</span>
				<span className="tracking-tight text-muted-foreground text-left">
					{m["FooterComponent.lgbt_lives_matter"]()}
				</span>
			</div>
			<div className="pt-5 md:w-1/2">
				<div className="flex flex-col justify-start md:flex-row md:items-start md:justify-between gap-y-5 lg:pl-10">
					<div className="flex flex-col gap-y-2 list-none">
						<li className="inline-flex mb-2 text-sm font-semibold text-primary tracking-widest">
							{m["FooterComponent.heading_1"]()}
						</li>
						<FooterItem link="https://github.com/giftedl/PluralBuddy">
							GitHub
						</FooterItem>
						<FooterItem link="https://gftl.fyi/invite">
							{m["FooterComponent.invite"]()}
						</FooterItem>
						<FooterItem link="https://gftl.fyi/discord">
							{m["FooterComponent.join_support_server"]()}
						</FooterItem>
						<FooterItem link="https://gftl.fyi/docs">
							{m["FooterComponent.docs"]()}
						</FooterItem>
					</div>
					<div className="flex flex-col gap-y-2 list-none">
						<li className="inline-flex mb-2 text-sm font-semibold text-primary tracking-widest">
							{m["FooterComponent.docs"]()}
						</li>
						<FooterItem link="/docs/pluralbuddy/get-started">
							{m["FooterComponent.getting_started"]()}
						</FooterItem>
						<FooterItem link="/docs/pluralbuddy/">
							{m["FooterComponent.intro"]()}
						</FooterItem>
						<FooterItem link="/docs/pluralbuddy/get-started">
							{m["FooterComponent.ctx_menu_actions"]()}
						</FooterItem>
					</div>
				</div>
			</div>
		</footer>
	);
}

function FooterItem({ children, link }: { children: JSX.Element | string; link: string }) {
  return (
    <li className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-muted-foreground">
      <a href={link}>{children}</a>
      <div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
        <ChevronRight />
      </div>
    </li>
  );
}
