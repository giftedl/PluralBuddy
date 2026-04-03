import { getAvailableAlters } from "@/app/[lang]/(app)/app/actions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TimestampString } from "./timestamp-string";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Field } from "../ui/field";
import { Button } from "../ui/shadcn-button";
import { Search } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { PAlter } from "plurography";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AlterInput({
	selectedAlter,
	setSelectedAlter,
	disableExpressAlters,
}: {
	selectedAlter: string | null;
	setSelectedAlter: (newVal: string | null) => void;
	disableExpressAlters?: boolean | undefined;
}) {
	const [search, setSearch] = useState("");
	const [dynamicSearch, setDynamicSearch] = useState("");
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isPending,
		isFetchingNextPage,
		refetch,
		status,
	} = useInfiniteQuery({
		queryKey: [`alters/${search}`],
		queryFn: async ({ pageParam = 0 }) =>
			getAvailableAlters({
				skip: pageParam,
				max: 50,
				...(search === "" ? {} : { search }),
			}),
		getNextPageParam: (lastPage, pages, a, b) =>
			lastPage.length > 0 ? pages.length + 50 : undefined,
		initialPageParam: 0,
	});

	if (isPending)
		return (
			<div className="grid grid-cols-1 my-[30px] border p-3 rounded-2xl relative">
				<div className="fixed block top-[50%] right-[50%] ">
					<Spinner />
				</div>
			</div>
		);

	return (
		<div className="gap-2 grid grid-cols-1 my-[30px] border p-3 rounded-2xl">
			<Field orientation="horizontal">
				<Input
					type="search"
					placeholder="Search..."
					value={dynamicSearch}
					onChange={(e) => setDynamicSearch(e.target.value)}
				/>
				<Button
					onClick={() => {
						setSearch(dynamicSearch);
						refetch();
					}}
				>
					<Search />
				</Button>
			</Field>
			<div className=" max-h-[300px] overflow-y-auto">
				<div className="py-2 px-0.5 grid grid-cols-2 gap-2">
					{data?.pages.map((page, i) => (
						<React.Fragment key={i}>
							{page.map((v) =>
								disableExpressAlters && v.isExpressified ? (
									<Tooltip key={v.alterId}>
										<TooltipTrigger>
											<AlterCard
												v={v}
												disableExpressAlters={disableExpressAlters ?? false}
												selectedAlter={selectedAlter}
												setSelectedAlter={setSelectedAlter}
											/>
										</TooltipTrigger>
										<TooltipContent>
											This alter already has an express application attached to it.
										</TooltipContent>
									</Tooltip>
								) : (
									<AlterCard
										v={v}
										key={v.alterId}
										disableExpressAlters={disableExpressAlters ?? false}
										selectedAlter={selectedAlter}
										setSelectedAlter={setSelectedAlter}
									/>
								),
							)}
						</React.Fragment>
					))}
				</div>

				{hasNextPage && (
					<Button
						onClick={() => fetchNextPage()}
						className="w-full"
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage && <Spinner />} Fetch More
					</Button>
				)}
			</div>
		</div>
	);
}

function AlterCard({
	v,
	disableExpressAlters,
	selectedAlter,
	setSelectedAlter,
}: {
	v: PAlter & { isExpressified: boolean };
	disableExpressAlters: boolean;
	selectedAlter: string | null;
	setSelectedAlter: (newVal: string | null) => void;
}) {
	return (
		<Card
			key={v.alterId}
			className={cn(
				"min-h-[92px] min-w-[267px] cursor-pointer",
				disableExpressAlters && v.isExpressified
					? "cursor-not-allowed bg-card/20"
					: "cursor-pointer",
				Number(selectedAlter) === v.alterId
					? "transition-all bg-primary/30 border-primary border"
					: "",
			)}
			onClick={() =>
				(!v.isExpressified || !disableExpressAlters) &&
				setSelectedAlter(String(v.alterId))
			}
		>
			<CardContent className="gap-4 flex items-center">
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
			</CardContent>
		</Card>
	);
}
