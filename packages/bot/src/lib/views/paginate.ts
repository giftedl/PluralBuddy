import { ActionRow, Button, Container, type BaseComponentBuilder, type DefaultLocale } from "seyfert";
import { InteractionIdentifier } from "../interaction-ids";

type ExtractKeys<T> = T extends object
    ? {
        [K in keyof T & string]:
        | K
        | (T[K] extends object ? `${K}.${ExtractKeys<T[K]>}` : K);
    }[keyof T & string]
    : never;

export default async function paginateComponents<K>(
    list: Record<ExtractKeys<typeof InteractionIdentifier>, (data: K) => Promise<BaseComponentBuilder[]>>,
    data: K,
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

        return result;
    }


    if (correspondingFunction === undefined)
        return null;

    return [...(await correspondingFunction[1](data)), new Container().setComponents(
        new ActionRow().setComponents(

            new Button()
                .setCustomId(getFullId(orderedList[page - 2]?.[0]) ?? "disabled")
                .setDisabled(orderedList[page - 2] === undefined)
                .setLabel(lang.PAGINATION_PREVIOUS_PAGE),
                
            new Button()
                .setCustomId(getFullId(orderedList[page]?.[0]) ?? "disabled")
                .setDisabled(orderedList[page] === undefined)
                .setLabel(lang.PAGINATION_NEXT_PAGE)

        )
    )]
}