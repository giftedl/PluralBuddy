import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CircleSlash } from "lucide-react";

export default function NotFoundPage() {
	return (
		<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">

			<Card>
				<div className="align-center justify-center flex h-[calc(100vh-200px)] w-[100vh]">
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<CircleSlash />
							</EmptyMedia>
							<EmptyTitle>Page not found</EmptyTitle>
							<EmptyDescription>
                                Our hamster wheels spinned extra hard, and we couldn't quite find what page you were looking for. Maybe it's not in the PluralBuddy app?
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			</Card>
		</main>
	);
}
