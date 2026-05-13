import { ActionRow, Button, Container, TextDisplay, type BaseComponentBuilder, type DefaultLocale, type TopLevelBuilders } from "seyfert";
import { InteractionIdentifier, InteractionObj } from "../interaction-ids";
import { ButtonStyle } from "seyfert/lib/types";

type ExtractKeys<T> = T extends object
    ? {
        [K in keyof T & string]:
        | K
        | (T[K] extends object ? `${K}.${ExtractKeys<T[K]>}` : K);
    }[keyof T & string]
    : never;

export default async function paginateComponents<K extends { $?: I } & any, I extends string | undefined >(
    list: Partial<Record<ExtractKeys<typeof InteractionIdentifier>, (data: K & { $translations: DefaultLocale }) => Promise<TopLevelBuilders[]>>>,
    data: Omit<{ $?: string | undefined } & K, "$translations">,
    page: number,
    lang: DefaultLocale
) {
    const orderedList = Object.entries(list);
    const correspondingFunction = orderedList[page - 1];

    const getFullId = (key: string | undefined) => {
        if (key === undefined)
            return undefined;

        const keys = key.split(".");
        let result: any = InteractionIdentifier;

        for (const k of keys) {
            result = result[k];
        }

        return result as InteractionObj<($: string | undefined) => string> | undefined;
    }


    if (correspondingFunction === undefined)
        return [new TextDisplay().setContent("-# Hm. There was an error while loading this pagination component. ")];

    return [...(await correspondingFunction[1]({ ...data, $translations: lang } as K & { $translations: DefaultLocale })) ?? [], new Container().setComponents(
        new ActionRow().setComponents(

            new Button()
                .setCustomId(getFullId(orderedList[page - 2]?.[0])?.create(data.$) ?? "disabled1")
                .setDisabled(orderedList[page - 2] === undefined)
                .setLabel(lang.PAGINATION_PREVIOUS_PAGE)
                .setStyle(ButtonStyle.Secondary),

            new Button()
                .setCustomId(getFullId(orderedList[page]?.[0])?.create(data.$) ?? "disabled2")
                .setDisabled(orderedList[page] === undefined)
                .setLabel(lang.PAGINATION_NEXT_PAGE)
                .setStyle(ButtonStyle.Secondary)

        )
    )]
}