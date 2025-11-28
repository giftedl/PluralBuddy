/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
"use client";

import { getUserApp } from "@/app/(home)/developers/applications/actions";
import { scopeList } from "@/components/devs/create-new-app-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";
import { Dithering } from "@paper-design/shaders-react";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, FileExclamationPoint } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ConsentPage() {
	const params = useSearchParams();
    const router = useRouter();

	const { resolvedTheme } = useTheme();
	const { data, status } = useQuery({
		queryKey: [`application-${params.get("client_id")}`],
		queryFn: async () => getUserApp(params.get("client_id") ?? "", true),
	});

	// Submit consent with the code in the request body
	const consentCode = params.get("consent_code");
	const scopes = params.get("scope")?.split(" ");

    if (consentCode === null) return <>Requires consent code</>

	if (data !== undefined && "message" in data) return <>Invalid application</>
	if (data !== undefined && !("data" in data)) return <>Invalid application</>

	return (
		<div className="grid w-full flex-grow relative items-center justify-center px-4">
			{status === "success" && (
				<Card className="w-full space-y-6 z-10 justify-center rounded-2xl p-8 sm:w-96">
					<header className="text-center">
						<h1 className="mt-4 text-xl font-medium tracking-tight">
							{data.data?.name}
						</h1>
						<span className="text-sm text-muted-foreground">
							is attempting to access data from your system
						</span>
					</header>
					<div className="border rounded-lg">
						<div className="w-full p-4 bg-fd-secondary rounded-t-lg text-center">
							<span>{data.data?.name} is requesting access to:</span>
						</div>
						<Separator />
						{scopes
							?.slice() // create shallow copy to avoid mutating original
							.sort(
								(a, b) =>
									scopeList.findIndex((s) => s.title === a) -
									scopeList.findIndex((s) => s.title === b),
							)
							.map((scope, i) => (
								<>
									<div
										className={cn(
											"w-full p-4 text-sm",
											scope === "system:admin"
												? "text-red-400 flex items-center gap-4"
												: "",
										)}
									>
										{scope === "system:admin" && (
											<Tooltip>
												<TooltipTrigger>
													<CircleAlert size={20} />
												</TooltipTrigger>
												<TooltipContent className="max-w-[300px] word-wrap text-center">
													This allows {data.data?.name} to access not only your
													entire system, but all access to your alters as well.
													Grant this permission with caution.
												</TooltipContent>
											</Tooltip>
										)}
										{scopeList.find((v) => v.title === scope)?.description}
									</div>
									{i + 1 !== scopes.length && <Separator />}
								</>
							))}
					</div>

					<div className="flex items-center w-full gap-2">
						<button
							type="button"
							className={cn(
								buttonVariants({ variant: "outline" }),
								"gap-1 w-full",
							)}
							onClick={async () => {
								const res = await authClient.oauth2.consent({
									accept: false,
									consent_code: consentCode,
								});


                                if (res.error)
                                    toast.error("Error while denying consent code")
                                else {
                                    toast.success("Okay, done!");
                                    router.push(res.data.redirectURI)
                                }
							}}
						>
							Deny
						</button>
						<button
							type="button"
							className={cn(
								buttonVariants({ variant: "primary" }),
								"gap-1 w-full",
							)}
							onClick={async () => {
								const res = await authClient.oauth2.consent({
									accept: true,
									consent_code: consentCode,
								});

                                if (res.error)
                                    toast.error("Error while accepting consent code")
                                else {
                                    toast.success("Okay, done!");
                                    router.push(res.data.redirectURI)
                                }
							}}
						>
							Accept
						</button>
					</div>
				</Card>
			)}
			<Dithering
				className="w-screen h-screen absolute"
				colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
				colorFront="#fccee8"
				shape="warp"
				type="4x4"
				size={2}
				speed={1}
				scale={0.6}
			/>
		</div>
	);
}
