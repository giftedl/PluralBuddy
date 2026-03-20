import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlterInput } from "./alter-input";

export function CreateExpressModal({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
    const [selectedAlter, setSelected] = useState<string | null>(null);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="min-w-[600px]! h-[600px]">
                <DialogTitle>Select an associated alter</DialogTitle>
                <AlterInput selectedAlter={selectedAlter} setSelectedAlter={setSelected} />
            </DialogContent>
		</Dialog>
	);
}
