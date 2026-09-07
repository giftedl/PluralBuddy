export function sortObject(
	obj:
		| Record<
				string,
				| string
				| number
				| unknown[]
				| Record<string, string | undefined>
				| Date
				| undefined
				| null
				| boolean
		  >
		| Date
		| unknown[],
) {
	if ("length" in obj || "getDate" in obj) {
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
