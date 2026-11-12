"use client";

import { useEffect, useState } from "react";
import { Banner } from "./banner";
import Link from "next/link";
import { Button } from "./ui/shadcn-button";
import { X } from "lucide-react";

export function AdjustableBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const bool = localStorage.getItem("adj-banner_jul-31-on");
    if (bool === "false") setOpen(false);
    else setOpen(true);
  });

  if (open)
    return (
      <Banner
        className="flex items-center justify-between backdrop-blur-xl bg-background/30"
        variant="rainbow"
        rainbowColors={[
          "rgba(255,100,0, 0.5)",
          "rgba(255,100,0, 0.5)",
          "transparent",
          "rgba(255,100,0, 0.5)",
          "transparent",
          "rgba(255,100,0, 0.5)",
          "transparent",
        ]}
      >
        <span className="justify-center">
          Updated Terms of Service & Privacy Policy (July 31st).{" "}
          <Link href="/docs/policies/terms" className="text-primary underline">
            Please read.
          </Link>
        </span>
        <Button
          className="justify-end"
          variant="secondary"
          onClick={() => {
            setOpen(false);
            localStorage.setItem("adj-banner_jul-31-on", "false");
          }}
        >
          <X />
        </Button>
      </Banner>
    );

  return null;
}
