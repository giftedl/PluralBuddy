import { useMediaQuery } from "fumadocs-core/utils/use-media-query";
import { JSX, useState } from "react";
import { JsonViewer } from "@/components/json-viewer";
import { m } from "@/paraglide/messages";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer";

export function JSONModal({
  data,
  open,
  setOpen,
  rootName,
}: {
  data: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  rootName: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-fit">
          <DialogTitle>{m["RawJSONModal.title"]()}</DialogTitle>
          <DialogDescription>{m["RawJSONModal.desc"]()}</DialogDescription>
          <JsonViewer
            data={data}
            rootName="alter"
            defaultExpanded={1}
            className="max-h-[600px] w-[800px] overflow-y-auto"
          />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="px-4 pb-4">
        <DrawerTitle>{m["RawJSONModal.title"]()}</DrawerTitle>
        <DrawerDescription className="pb-2">{m["RawJSONModal.desc"]()}</DrawerDescription>

        <JsonViewer
          data={data}
          rootName="alter"
          defaultExpanded={1}
          className="max-h-[600px] w-full overflow-y-auto"
        />
      </DrawerContent>
    </Drawer>
  );
}
