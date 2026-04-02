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
import { AnimatePresence, motion } from "motion/react";
import { Stepper, StepperItem } from "../stepper";
import Link from "next/link";
import { Input } from "../ui/input";
import { AlterView } from "./alter-view";
import { Spinner } from "../ui/spinner";
import { createExpressApplication } from "@/app/[lang]/(app)/app/express/actions";
import { toast } from "sonner";

export function CreateExpressModal({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [selectedAlter, setSelected] = useState<string | null>(null);
	const [token, setToken] = useState<string>("");
	const [nextLoading, setNextLoading] = useState<boolean>(false);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (open === false) {
			setSelected(null);
			setPage(0);
		}
	}, [open]);

	useEffect(() => {
		if (page === 0) {
			setToken("");
		}
	}, [page]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="block min-w-[700px]">
				<AnimatePresence initial={false}>
					<AnimatePresence mode="wait" initial={false}>
						{page === 0 && (
							<motion.div
								key="page0"
								initial={{ opacity: 0, x: -40, scale: 0.97 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								exit={{ opacity: 0, x: 40, scale: 0.97 }}
								transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
							>
								<DialogTitle className="pb-3">
									Select an associated alter
								</DialogTitle>
								<DialogDescription>
									PluralBuddy associates an alter that already exists with the
									new Express application you create. Choose an alter you'd like
									to represent your new Express application.
								</DialogDescription>
								<Separator />
								<AlterInput
									selectedAlter={selectedAlter}
									setSelectedAlter={setSelected}
								/>
								<DialogFooter>
									<Button
										disabled={selectedAlter === null}
										onClick={() => setPage(1)}
									>
										Next
									</Button>
								</DialogFooter>
							</motion.div>
						)}
						{page === 1 && (
							<motion.div
								key="page1"
								initial={{ opacity: 0, x: 40, scale: 0.97 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								exit={{ opacity: 0, x: -40, scale: 0.97 }}
								transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
							>
								<DialogTitle className="pb-3">
									Create a Discord Application
								</DialogTitle>
								<DialogDescription>
									Due to how PluralBuddy Express works, you need to create an
									application for each alter that you want to assign with
									Express.
								</DialogDescription>
								<Separator />
								<div className="p-4">
									{selectedAlter && <AlterView selectedAlter={selectedAlter} />}
								</div>
								<Stepper className="p-4">
									<StepperItem
										title="Create an application"
										description="You must go to the Discord Developer Portal to create an application for PluralBuddy."
									>
										<Link
											href="https://discord.com/developers/applications"
											target="_blank"
										>
											<Button>Go to Discord Developer Portal</Button>
										</Link>
									</StepperItem>
									<StepperItem
										title="Input bot token"
										description="Hit the Bot Tab -> Reset token. Don't worry, this token is encrypted in our database."
									>
										<Input placeholder="Bot Token" value={token} onChange={e => setToken(e.target.value)} />
									</StepperItem>
								</Stepper>
								<DialogFooter>
									<Button variant="outline" onClick={() => setPage(0)} disabled={nextLoading}>
										Back
									</Button>
									<Button
										disabled={nextLoading || !token}
										onClick={async () => {
											setNextLoading(true)

											await createExpressApplication({ token, alterId: selectedAlter ?? "" }).catch((e) => {
												toast.error(<>Error while creating express application. <br/> Error: {e.message}</>);
												setNextLoading(false)
											});

											setNextLoading(false);
										}}
									>
										{nextLoading && <Spinner />} Next
									</Button>
								</DialogFooter>
							</motion.div>
						)}
					</AnimatePresence>
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
