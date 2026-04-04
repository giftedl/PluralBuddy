import { JSX, useState } from "react";
import { JsonViewer } from "@/components/json-viewer";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useTranslations } from "next-intl";

export function JSONModal({
	data,
	open,
    setOpen,
    rootName
}: {
	data: any;
    open: boolean;
    setOpen: (open: boolean) => void;
    rootName: string;
}) {
    const t = useTranslations("RawJSONModal")

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="min-w-fit">
                <DialogTitle>{t("title")}</DialogTitle>
                <DialogDescription>{t("desc")}</DialogDescription>
				<JsonViewer data={data} rootName="alter" defaultExpanded={1} className="max-h-[600px] w-[800px] overflow-y-auto" />
			</DialogContent>
		</Dialog>
	);
}
