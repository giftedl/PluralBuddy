
export function sortObject(
	obj: Record<string, string | number | unknown[]> | unknown[],
) {
	if ("length" in obj) {
		return obj;
	}

	return Object.keys(obj)
		.sort()
		.reduce((sorted: Record<string, unknown>, key) => {
			sorted[key] =
				typeof obj[key] === "object" && obj[key] !== null
					? sortObject(obj[key])
					: obj[key];
			return sorted;
		}, {});
}
