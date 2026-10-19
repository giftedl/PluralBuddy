import { cn } from "cn";
import { Check } from "lucide-react";
import React from "react";
import { m } from "@/paraglide/messages";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export function MarketingHomeIntegrationSection() {
	return (
		<div className="py-5">
			<Card className="p-0">
				<CardContent className="lg:flex justify-between h-full px-0 pl-4 max-lg:pl-1">
					<div className="text-left h-full overflow-hidden w-full flex flex-col gap-5 p-8">
						<div>
							<h1 className="text-3xl text-primary font-bold">
								Integrations that
							</h1>
							<h1 className="tracking-tighter text-3xl font-light">
								finally are secure.
							</h1>
						</div>
						<p className="text-muted-foreground max-w-75">
							It has never been easier and more secure to get plurality data.
						</p>

						<ul className="flex flex-col gap-2">
							<li className="flex items-center gap-2">
								<Check size={20} /> Never copy & paste a token ever again.
							</li>
							<li className="flex items-center gap-2">
								<Check size={20} />
								See exactly what is being needed from an application.
							</li>
							<li className="flex items-center gap-2">
								<Check size={20} />
								Integrate a front tracker to take control of system alters.
							</li>
							<li className="flex items-center gap-2">
								<Check size={20} />
								Your data is yours, and that will never change.
							</li>
							<li className="flex items-center gap-2">
								<Check size={20} />
								Deauthorize an application thats misbehaving with your system data.
							</li>
						</ul>
					</div>
					<div className="relative bg-crust z-10 w-150">
						<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_90%)] w-full h-full absolute z-20" />

						<div className="bg-crust space-y-5 rounded-xl p-2 border-l text-left absolute">
							<header className="text-center pt-4">
								<div className="flex items-center justify-center">
									<div className="relative flex items-center">
										<div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-primary ring-card">
											<Avatar className="w-full h-full">
												<AvatarImage src="/image/pfp.png" alt="Solar" />
												<AvatarFallback>PluralBuddy</AvatarFallback>
											</Avatar>
										</div>
									</div>
								</div>
								<h1 className="mt-6 text-xl font-medium tracking-tight">
									{m["ConsentPage.title"]({
										client_name: "FrontBuddy",
									})}
								</h1>
								<span className="text-sm text-muted-foreground">
									{m["ConsentPage.signed_in_as"]({
										username: `@giftedly`,
									})}
								</span>
							</header>
							<div className="border rounded-lg">
								<div className="w-full p-4 bg-fd-secondary rounded-t-lg text-center">
									<span>
										{m["ConsentPage.allowed_to"]({
											client_name: "FrontBuddy",
										})}
									</span>
								</div>
								<Separator />
								<React.Fragment>
									<div className={cn("w-full p-4 text-sm")}>
										{m[`ConsentPage.scopes.profile`]()}
									</div>
								</React.Fragment>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
