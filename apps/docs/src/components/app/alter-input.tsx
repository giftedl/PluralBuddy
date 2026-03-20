import { getAvailableAlters } from "@/app/(app)/app/actions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardTitle } from "../ui/card";

export function AlterInput({
	selectedAlter,
	setSelectedAlter,
}: {
	selectedAlter: string | null;
	setSelectedAlter: (newVal: string | null) => void;
}) {
	const { data, isPending } = useQuery({
		queryKey: ["alters"],
		queryFn: async () => getAvailableAlters({ skip: 0 }),
	});

	if (isPending)
		return (
			<div className="fixed block top-[50%] right-[50%]">
				<Spinner />
			</div>
		);

	return (
		<div className="grid grid-cols-4 gap-2">
			{(data ?? []).map((v) => (
				<Card key={v.alterId}>
					<CardContent>
						<CardTitle className="text-sm">@{v.displayName}</CardTitle>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
