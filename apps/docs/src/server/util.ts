export function stripId(obj: any) {
	if (!obj) return null;

	let { _id, ...ret } = obj;

	if (ret.token) {
		const { token, ...newo } = ret;

		ret = newo;
	}

	return ret;
}

export type Expressified<T> = T & { isExpressified: boolean };