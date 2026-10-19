"use client";

import { cn } from "cn";
import { ExternalLink, SearchIcon } from "lucide-react";
import { WithId } from "mongodb";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { DocsThirdPartyIntegration } from "@/server/get-3rd-party-integrations";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "../ui/input-group";
import { Separator } from "../ui/separator";
import { Button } from "../ui/shadcn-button";

export function SearchAndContents({integrations}: { integrations: WithId<DocsThirdPartyIntegration>[]}) {
	const [searchQuery, setSearchQuery] = useQueryState("s", { defaultValue: "" });

	return (
		<>
			<InputGroup className="w-full gap-2">
				<InputGroupInput
					id="search"
					placeholder="Search..."
					defaultValue={searchQuery ?? ""}
					onChange={(c) => setSearchQuery(c.target.value)}
				/>
				<InputGroupAddon>
					<SearchIcon />
				</InputGroupAddon>
			</InputGroup>
			<Separator />
			<div className="flex flex-col gap-2">
				{integrations.filter(v => v.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())).map((v, i) => (
					<div
						key={String(v._id)}
						className={cn(
							"w-full min-h-[100px] flex flex-col transition-all hover:bg-secondary p-4 rounded-lg",
							i !== integrations.length - 1 && "border-b",
						)}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								<Avatar className="size-15">
									<AvatarImage src={v.iconUrl} alt={v.name} className="m-0!" />
								</Avatar>
								<div className="flex flex-col gap-0">
									<Link
										href={v.link ?? "#"}
										className="no-underline! text-primary hover:underline! m-0! w-min"
									>
										<strong className="m-0!">{v.name}</strong>
									</Link>
									<p className="m-0! text-muted-foreground text-sm">
										{v.description}
									</p>
								</div>
							</div>
							{v.button && (
								<Link href={v.button.link}>
									<Button className="flex items-center gap-2">
										<ExternalLink /> {v.button.label}
									</Button>
								</Link>
							)}
						</div>
					</div>
				))}
			</div>
		</>
	);
}
