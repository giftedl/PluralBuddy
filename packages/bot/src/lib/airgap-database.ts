export function airgap<V>(
	safeUser: string,
	data: ({ systemId: string } & V)[],
) {
	data.forEach((c) => {
		if (safeUser !== c.systemId) {
			throw new Error("This operation cannot be done.");
		}
	});

	return data;
}

export function airgapOne<V>(
	safeUser: string,

	data: { systemId: string } & V,
) {
	if (safeUser !== data.systemId) {
		throw new Error("This operation cannot be done.");
	}

	return data;
}

export function airgapSystem<V>(
	safeUser: string,
	data: { associatedUserId: string } & V,
) {
	if (safeUser !== data.associatedUserId)
		throw new Error("This operation cannot be done.");

	return data;
}
