import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PSystem } from "plurography";

export function NumberStats({ data }: { data: PSystem }) {
	return (
		<div className="grid grid-cols-2 gap-3 mb-3">
			<Card>
				<CardContent>
					<CardHeader className="text-center">
						<CardTitle>Total Alter Count</CardTitle>
						<h1 className="text-6xl font-extrabold my-4">
							{data?.alterIds.length}
						</h1>
					</CardHeader>
				</CardContent>
			</Card>
			<Card>
				<CardContent>
					<CardHeader className="text-center">
						<CardTitle>Total Tag Count</CardTitle>
						<h1 className="text-6xl font-extrabold my-4">
							{data?.tagIds.length}
						</h1>
					</CardHeader>
				</CardContent>
			</Card>
		</div>
	);
}
