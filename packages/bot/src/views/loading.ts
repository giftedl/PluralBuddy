/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Container, TextDisplay } from "seyfert";
import type { TranslationString } from "../lang";
import { emojis } from "../lib/emojis";

export class LoadingView {
	translations: TranslationString;

	constructor(translations: TranslationString) {
		this.translations = translations;
	}

	loadingView() {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(
						`  ${emojis.loading}   ${this.translations.WAITING}`,
					),
				)
				.setColor("#5450fe"),
		];
	}
	loadingViewLongTerm() {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(
						`  ${emojis.loading}   ${this.translations.WAITING_LONG_TERM}`,
					),
				)
				.setColor("#5450fe"),
		];
	}
}
