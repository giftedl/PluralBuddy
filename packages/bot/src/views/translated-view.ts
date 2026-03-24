/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { DefaultLocale } from "seyfert";

export class TranslatedView {
    translations: DefaultLocale;

    constructor(translations: DefaultLocale) {
        this.translations = translations;
    }
    
}