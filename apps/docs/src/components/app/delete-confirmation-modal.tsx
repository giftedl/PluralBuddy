import { JSX, ReactNode, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/shadcn-button";
import { Trash } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "fumadocs-core/utils/use-media-query";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle } from "../ui/drawer";

export function DeleteConfirmationModal({
	open,
	setOpen,
	requiredDeletionText,
	title,
	description,
	onDelete,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
	requiredDeletionText: string;
	title: string;
	description: ReactNode;
	onDelete: () => Promise<void>;
}) {
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState("");
	const t = useTranslations("DeleteComponent");
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="min-w-[700px]">
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
					<Input
						className="w-full"
						placeholder={t("placeholder", {
							requiredDeletionText,
						})}
                        value={value}
                        onChange={e => setValue(e.target.value)}
					/>
				<DialogFooter>
					<Button
						variant="destructive"
						onClick={async () => {
							setLoading(true);
							await onDelete();
							setLoading(false);
							setOpen(false);
						}}
						disabled={value !== requiredDeletionText || loading}
					>
						{loading ? <Spinner /> : <Trash />} {t("btn_label")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerContent className="px-4 overflow-y-auto">
				<DrawerTitle>{title}</DrawerTitle>
				<DrawerDescription>{description}</DrawerDescription>
					<Input
						className="w-full"
						placeholder={t("placeholder", {
							requiredDeletionText,
						})}
                        value={value}
                        onChange={e => setValue(e.target.value)}
					/>
				<DrawerFooter>
					<Button
						variant="destructive"
						onClick={async () => {
							setLoading(true);
							await onDelete();
							setLoading(false);
							setOpen(false);
						}}
						disabled={value !== requiredDeletionText || loading}
					>
						{loading ? <Spinner /> : <Trash />} {t("btn_label")}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
