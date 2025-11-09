/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { TranslationString } from "../lang";
import { SystemProtectionFlags } from "../types/system";

export function combine(...perms: SystemProtectionFlags[]): number {
    return perms.reduce((mask, p) => mask | p, 0);
  }

export function listFromMask(mask: number): SystemProtectionFlags[] {
    return Object.values(SystemProtectionFlags)
      .filter((v): v is number => typeof v === "number")
      .filter(v => (mask & v) !== 0)
      .map(v => v as SystemProtectionFlags);
  }

export function friendlyProtection(translations: TranslationString, flags: SystemProtectionFlags[]): string[] {
    return flags.map((c) => {
        if (c === SystemProtectionFlags.ALTERS)
            return translations.PRIVACY_ALTERS
        if (c === SystemProtectionFlags.NAME)
            return translations.PRIVACY_NAME
        if (c === SystemProtectionFlags.DESCRIPTION)
            return translations.PRIVACY_DESCRIPTION
        if (c === SystemProtectionFlags.TAGS)
            return translations.PRIVACY_TAGS
        if (c === SystemProtectionFlags.DISPLAY_TAG)
            return translations.PRIVACY_DISPLAY_TAG
        if (c === SystemProtectionFlags.AVATAR)
            return translations.PRIVACY_AVATAR
        if (c === SystemProtectionFlags.BANNER)
            return translations.PRIVACY_BANNER

        return translations.PRIVACY_ALTERS
    })
}

export function has(perm: SystemProtectionFlags, mask?: number): boolean {
    return ((mask ?? 0) & perm) !== 0;
  }