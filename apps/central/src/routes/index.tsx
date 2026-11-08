import { createFileRoute } from "@tanstack/react-router";
import { Button } from "#/components/ui/button.tsx";
import { Material } from "#/components/ui/material";
import { Placeholder } from "#/components/ui/placeholder";
import { ChevronLeft, ChevronRight, Frown } from "lucide-react";
import { Discord } from "#/components/ui/discord";
import { useAuth } from "#/hooks/use-auth";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { login } = useAuth();

	return (
		<main className="w-full">
			<Material
				rounding="none"
				className="h-full min-h-[calc(100vh-57px)] w-full border-t-0 flex flex-col gap-2 text-center justify-center"
			>
				<Placeholder
					icon={<Frown />}
					title="Login Required"
					description="You must login to Discord to see your system."
				>
					<Button className="flex items-center gap-2 mt-2 bg-[#5865F2]! text-white!" onClick={() => login({ redirectUri: "/" })}>
						<Discord className="size-4 fill-white" />
						Login with Discord
					</Button>
				</Placeholder>
			
			</Material>
		</main>
		);
}
