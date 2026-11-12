/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { DefaultLocale } from "seyfert";

export class TranslatedView {
  translations: DefaultLocale;
  preferAccessiblity: boolean;

  constructor(translations: DefaultLocale, preferAccessiblity: boolean = false) {
    this.translations = translations;
    this.preferAccessiblity = preferAccessiblity;
  }
}
