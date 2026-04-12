import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { CloudDownload } from "lucide-react";

export default function ImportStagingDonePage() {
	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card className="flex w-full items-center justify-center h-[calc(100vh-100px)]">
					<CardContent className="text-sm flex items-center justify-center h-full">
						<Empty className="h-full w-full flex items-center justify-center">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<CloudDownload />
								</EmptyMedia>
								<EmptyTitle>Data Sent Back to PluralBuddy</EmptyTitle>
								<EmptyDescription>You can close this tab now.</EmptyDescription>
							</EmptyHeader>
						</Empty>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
