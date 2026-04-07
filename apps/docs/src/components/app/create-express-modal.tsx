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
import { Link } from "react-router";
import { Input } from "../ui/input";
import { AlterView } from "./alter-view";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useTranslations } from "next-intl";
import { useTRPCClient } from "@/server/client";

export function CreateExpressModal({ children }: { children: ReactNode }) {
	const t = useTranslations("ExpressModal");

	const [open, setOpen] = useState(false);
	const [selectedAlter, setSelected] = useState<string | null>(null);
	const [token, setToken] = useState<string>("");
	const [nextLoading, setNextLoading] = useState<boolean>(false);
	const [page, setPage] = useState(0);
	const navigate = useNavigate();
	const trpc = useTRPCClient();

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
								<DialogTitle className="pb-3">{t("page0_title")}</DialogTitle>
								<DialogDescription>{t("page0_desc")}</DialogDescription>
								<Separator />
								<AlterInput
									selectedAlter={selectedAlter}
									setSelectedAlter={setSelected}
									disableExpressAlters
								/>
								<DialogFooter>
									<Button
										disabled={selectedAlter === null}
										onClick={() => setPage(1)}
									>
										{t("pagination_next")}
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
								<DialogTitle className="pb-3">{t("page1_title")}</DialogTitle>
								<DialogDescription>{t("page1_desc")}</DialogDescription>
								<Separator />
								<div className="p-4">
									{selectedAlter && <AlterView selectedAlter={selectedAlter} />}
								</div>
								<Stepper className="p-4">
									<StepperItem
										title={t("stepper1_title")}
										description={t("stepper1_desc")}
									>
										<Link
											to="https://discord.com/developers/applications"
											
											target="_blank"
										>
											<Button>{t("stepper1_btn")}</Button>
										</Link>
									</StepperItem>
									<StepperItem
										title={t("stepper1_title")}
										description={t("stepper1_desc")}
									>
										<Input
											placeholder="Bot Token"
											value={token}
											onChange={(e) => setToken(e.target.value)}
										/>
									</StepperItem>
								</Stepper>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setPage(0)}
										disabled={nextLoading}
									>
										{t("pagination_back")}
									</Button>
									<Button
										disabled={nextLoading || !token}
										onClick={async () => {
											setNextLoading(true);

											await trpc.ExpressRouter.createExpressApplication
												.query({
													token,
													alterId: selectedAlter ?? "",
												})
												.catch((e) => {
													toast.error(
														t.rich("error_creating", {
															br: () => <br />,
															message: e.message,
														}),
													);
													setNextLoading(false);
												});

											setNextLoading(false);

											toast.success(t("success"));

											navigate(`/app/settings/express/alter/${selectedAlter}`);
										}}
									>
										{nextLoading && <Spinner />} {t("pagination_next")}
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
