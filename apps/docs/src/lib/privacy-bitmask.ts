/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { AlterProtectionFlags, SystemProtectionFlags, TagProtectionFlags } from "plurography";

export function combine(
	...perms: (SystemProtectionFlags | AlterProtectionFlags | TagProtectionFlags)[]
): number {
	return perms.reduce((mask, p) => mask | p, 0);
}

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


export function has(
	perm: SystemProtectionFlags | AlterProtectionFlags | TagProtectionFlags,
	mask?: number,
): boolean {
	return ((mask ?? 0) & perm) !== 0;
}
