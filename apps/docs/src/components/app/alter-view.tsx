import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { useTRPCClient } from '@/server/client';
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { JSX } from "react";

export function AlterView({
	selectedAlter,
	children,
}: {
	selectedAlter: string;
	children?: JSX.Element;
}) {
	const trpc = useTRPCClient()
	const { data: v, isPending } = useQuery({
		queryKey: [`alter/${selectedAlter}`],
		queryFn: async () => trpc.AlterRouter.getAlter.query({ id: selectedAlter }),
	});

	if (isPending || !v) return <Spinner />;

	return (
		<Card key={selectedAlter} className={cn("min-h-[92px] min-w-[267px]")}>
			<CardContent className="flex justify-between">
				<div className="gap-4 flex items-center">
					<div
						style={{
							backgroundColor: (v.color as `#${string}`) ?? `#808080`,
						}}
						className=" h-[60px] w-[5px] rounded-xl"
					/>
					<Avatar>
						<AvatarImage src={v.avatarUrl ?? ""} />
						<AvatarFallback>
							{v.displayName[0].toLocaleUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle className="text-sm">
							@{v.username}{" "}
							<span className="text-muted-foreground">{v.displayName}</span>
						</CardTitle>
						<CardDescription className="pt-1">
							{v.description?.substring(0, 60)}
						</CardDescription>
					</div>
				</div>
				{children}
			</CardContent>
		</Card>
	);
}
