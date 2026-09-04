import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useTRPCClient } from "@/server/client";

export default function ImportTranscriptsPage() {
	const { id } = useParams();
    const trpc = useTRPCClient();

	const { data: alterObj, isPending: altersPending } = useQuery({
		queryKey: [`import-transcript/${id}`],
		queryFn: async () =>
			trpc.alters.getAlter.query({ id: alter ?? "", with_app_data: true }),
	});

	if (altersPending)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<DynamicPageTitle title="PluralBuddy Express • PluralBuddy App" />
				<div className="fixed block top-[50%] right-[50%]">
					<Spinner />
				</div>
			</main>
		);

	return <></>;
}
