/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { TranslationString } from "../lang";

export class TranslatedView {
    translations: TranslationString;

    constructor(translations: TranslationString) {
        this.translations = translations;
    }
    
}