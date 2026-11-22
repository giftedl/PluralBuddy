import { Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenuItem } from "../ui/dropdown-menu-v2";
import { useTheme } from "next-themes";

export function ColorSchemeMenuItems() {
  const { setTheme } = useTheme();

  return (
    <>
      <DropdownMenuItem className="flex items-center gap-1.5" onClick={() => setTheme("system")}>
        <Monitor className="size-4 stroke-muted-foreground" /> System
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-1.5" onClick={() => setTheme("dark")}>
        <Moon className="size-4 stroke-muted-foreground" /> Dark
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-1.5" onClick={() => setTheme("light")}>
        <Sun className="size-4 stroke-muted-foreground" /> Light
      </DropdownMenuItem>
    </>
  );
}
