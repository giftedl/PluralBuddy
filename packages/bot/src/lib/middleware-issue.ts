/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Container, TextDisplay, type AnyContext, type StopFunction } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { TranslationString } from "../lang";
import { AlertView } from "../views/alert";
import { translations } from "../lang/en_us";

export function middlewareIssue(
    string: keyof TranslationString,
    ctx: {
        context: AnyContext, 
        stop: StopFunction
    }
) {
    ctx.context.ephemeral({
        components: new AlertView(ctx.context.userTranslations()).errorView(string),
        flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
    })

    // always use en_us for console logs
    return ctx.stop(translations[string])
}