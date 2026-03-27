/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
"use client";

import { scopeList } from "@/components/devs/create-new-app-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
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
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ConsentPage() {
	const params = useSearchParams();
	const t = useTranslations("ConsentPage");
	const router = useRouter();
	const session = authClient.useSession();

	const [loading, setLoading] = useState(false);

	const { resolvedTheme } = useTheme();
	const { data, status } = useQuery({
		queryKey: [`application-${params.get("client_id")}`],
		queryFn: async () =>
			authClient.oauth2.publicClient({
				query: { client_id: params.get("client_id") ?? "" },
			}),
	});

	// Submit consent with the code in the request body
	const scopes = params.get("scope")?.split(" ");

	if (data !== undefined && "message" in data) return <>{t("invalid_app")}</>;
	if (data !== undefined && !("data" in data)) return <>{t("invalid_app")}</>;

	return (
		<div className="grid w-full flex-grow relative items-center justify-center px-4">
			{status === "success" && (
				<Card className="w-full space-y-5 z-10 justify-center rounded-2xl p-8 sm:w-96">
					<header className="text-center">
						<div className="flex items-center justify-center">
							<div className="relative flex items-center">
								<div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-primary shadow-lg ring-4 ring-card">
									<Avatar className="w-full h-full">
										<AvatarImage src="/image/solar-centered.png" alt="Solar" />
										<AvatarFallback>PluralBuddy</AvatarFallback>
									</Avatar>
								</div>
							</div>
						</div>
						<h1 className="mt-6 text-xl font-medium tracking-tight">
							{t("title", {
								client_name: data.data?.client_name ?? "?",
							})}
						</h1>
						<span className="text-sm text-muted-foreground">
							{t("signed_in_as", {
								username: `@${session.data?.user.name}`
							})}
						</span>
					</header>
					<div className="border rounded-lg">
						<div className="w-full p-4 bg-fd-secondary rounded-t-lg text-center">
							<span>{t("allowed_to", {
								client_name: data.data?.client_name ?? "?"
							})}</span>
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
													This allows {data.data?.client_name} to access not
													only your entire system, but all access to your alters
													as well. Grant this permission with caution.
												</TooltipContent>
											</Tooltip>
										)}
										{t(`scopes.${scopeList.find((v) => v.title === scope)?.title}`)}
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
								setLoading(false)
								const res = await authClient.oauth2.consent({
									accept: false,
									scope: (scopes ?? []).join(" "),
								});

								if (res.error) toast.error("Error while denying consent code");
								else {
									toast.success("Okay, done!");
									if (res.data.redirect)
										router.push((res.data as unknown as { uri: string }).uri);
								}
							}}
							disabled={loading}
						>
							{loading ? <Spinner /> : "Deny"}
						</button>
						<button
							type="button"
							className={cn(
								buttonVariants({ variant: "primary" }),
								"gap-1 w-full",
							)}
							onClick={async () => {
								setLoading(true)
								const res = await authClient.oauth2.consent({
									accept: true,
									scope: (scopes ?? []).join(" "),
								});

								if (res.error)
									toast.error("Error while accepting consent code");
								else {
									toast.success("Okay, done!");
									if (res.data.redirect)
										router.push((res.data as unknown as { uri: string }).uri);
								}
							}}
							disabled={loading}
						>
							{loading ? <Spinner /> : "Accept"}
						</button>
					</div>
				</Card>
			)}
			<Dithering
				className="w-screen h-screen absolute"
				colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
				colorFront="#f2ea57"
				shape="warp"
				type="4x4"
				size={2}
				speed={1}
				scale={0.6}
			/>
		</div>
	);
}
