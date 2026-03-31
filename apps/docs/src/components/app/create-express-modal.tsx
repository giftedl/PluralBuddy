import { ReactNode, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { AlterInput } from "./alter-input";
import { Button } from "../ui/shadcn-button";
import { Separator } from "../ui/separator";

export function CreateExpressModal({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [selectedAlter, setSelected] = useState<string | null>(null);

	useEffect(() => {
		setSelected(null);
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="block min-w-[700px]">
				<DialogTitle className="pb-3">Select an associated alter</DialogTitle>
				<DialogDescription>PluralBuddy associates an alter that already exists with the new Express application you create. Choose an alter you'd like to represent your new Express application.</DialogDescription>
				<Separator />
				<AlterInput
					selectedAlter={selectedAlter}
					setSelectedAlter={setSelected}
				/>
				<DialogFooter>
					<Button disabled={selectedAlter === null}>
						Create Express Alter
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
