/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Container, TextDisplay } from "seyfert";
import type { TranslationString } from "../lang";
import { TranslatedView } from "./translated-view";
import { emojis } from "../lib/emojis";

export class AlertView extends TranslatedView {
    successViewCustom(string: string) {
        return [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`  ${emojis.check}   ${string}`)
                )
                .setColor("#4cc270")
        ]
    }

    successView(translationKey: keyof TranslationString) {
        return [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`  ${emojis.check}   ${this.translations[translationKey]}`)
                )
                .setColor("#4cc270")
        ]
    }


    errorViewCustom(string: string) {
        return [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`  ${emojis.x}   ${string}`)
                )
                .setColor("#B70000")
        ]
    }

    errorView(translationKey: keyof TranslationString) {
        return [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`  ${emojis.x}   ${this.translations[translationKey]}`)
                )
                .setColor("#B70000")
        ]
    }

    questionView(translationKey: keyof TranslationString) {
        return [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`  ${emojis.circleQuestion}   ${this.translations[translationKey]}`)
                )
                .setColor("#1190FF")
        ]

    }
}