import { AlterProtectionFlags } from "./alter";
import { SystemProtectionFlags } from "./system";
import { TagProtectionFlags } from "./tag";

export function listFromMaskSystems(mask: number): SystemProtectionFlags[] {
  return Object.values(SystemProtectionFlags)
    .filter((v): v is number => typeof v === "number")
    .filter((v) => (mask & v) !== 0)
    .map((v) => v as SystemProtectionFlags);
}

export function listFromMaskAlters(mask: number): AlterProtectionFlags[] {
  return Object.values(AlterProtectionFlags)
    .filter((v): v is number => typeof v === "number")
    .filter((v) => (mask & v) !== 0)
    .map((v) => v as AlterProtectionFlags);
}

export function listFromMaskTags(mask: number): TagProtectionFlags[] {
  return Object.values(TagProtectionFlags)
    .filter((v): v is number => typeof v === "number")
    .filter((v) => (mask & v) !== 0)
    .map((v) => v as TagProtectionFlags);
}
