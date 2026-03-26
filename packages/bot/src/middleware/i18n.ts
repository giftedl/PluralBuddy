import { language } from "@/lib/lang";
import { createMiddleware } from "seyfert";

export const userLangMiddleware = createMiddleware<void>(async (middle) => {
    const selectedLanguage = await language((middle.context.author ?? middle.context.member).id);

    if (selectedLanguage === null ) {}
});