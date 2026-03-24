import { getUserById } from "@/types/user";
import { client } from "..";
import { CacheFrom } from "seyfert";

const language = async (id: string) => {
	try {
	let data = (await client.cache.i18n.get(id))?.l;

	if (data === undefined) {
		data = (await getUserById(id)).userLang;
		await client.cache.i18n.set(CacheFrom.Gateway, id, { l: data });
	}

	return data;} catch (_) {
		return "en";
	}
};

export const getLanguageByUserId = async (id: string) =>
	client.t(await language(id)).get(await language(id));
