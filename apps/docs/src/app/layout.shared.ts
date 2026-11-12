import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "@/lib/i18n";

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: {
      displayName: "English",
    },
    es: {
      displayName: "Spanish",
    },
    de: {
      displayName: "German",
    },
    pt: {
      displayName: "Portuguese",
    },
    no: {
      displayName: "Norwegian",
    },
    ru: {
      displayName: "Russian",
    },
  });

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    // different props based on `locale`
  };
}
