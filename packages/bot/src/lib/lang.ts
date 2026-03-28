import { getUserById } from "@/types/user";
import { client } from "..";
import { CacheFrom } from "seyfert";

export const langMemoryCache: Record<string, string> = {};

export async function language<T extends boolean | undefined>(id: string, noCache?: T): Promise<T extends true ? null | string : string> {
	try {
		let data = langMemoryCache[id] ?? (await client.cache.i18n.get(id))?.l;

		if (data === undefined) {
			if (noCache)
				return null as T extends true ? null | string : string;
			data = (await getUserById(id)).userLang ?? "en";
			try {
				await client.cache.i18n.set(CacheFrom.Gateway, id, { l: data });
				langMemoryCache[id] = data;

			} catch (e) {
				console.error(e)
			}
		}

		return data;
	} catch (e) {
		console.error(e)
		if (noCache)
			return null as T extends true ? null | string : string;
		return "en";
	}
};

export const getLanguageByUserId = async (id: string) =>
	client.t(await language(id, false)).get(await language(id, false));
