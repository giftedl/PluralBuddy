/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Container, TextDisplay, type AnyContext, type DefaultLocale, type StopFunction } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import type { TranslationString } from "../lang";
import { AlertView } from "../views/alert";

export async function middlewareIssue(
    string: keyof DefaultLocale,
    ctx: {
        context: AnyContext, 
        stop: StopFunction
    }
) {
    const translations = await ctx.context.userTranslations();

    ctx.context.ephemeral({
        components: new AlertView(await ctx.context.userTranslations()).errorView(string),
        flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
    })

    // always use en_us for console logs
    return ctx.stop(translations[string])
}