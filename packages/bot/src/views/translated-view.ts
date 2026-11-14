/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import type { DefaultLocale } from "seyfert";

export class TranslatedView {
  translations: DefaultLocale;
  preferAccessiblity: boolean;

  constructor(translations: DefaultLocale, preferAccessiblity: boolean = false) {
    this.translations = translations;
    this.preferAccessiblity = preferAccessiblity;
  }
}
