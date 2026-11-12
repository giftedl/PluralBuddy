import { SolarPicture } from "@/components/solar-picture";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2">
          <Suspense
            fallback={
              <Avatar>
                <AvatarImage src="/image/pfp.png" />
                <AvatarFallback>PluralBuddy</AvatarFallback>
              </Avatar>
            }
          >
            <SolarPicture />
          </Suspense>
          PluralBuddy
        </span>
      ),
    },
  };
}
