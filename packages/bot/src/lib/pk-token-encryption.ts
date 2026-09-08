export async function decryptExpressToken(iv: string, token: string) {
	const key = process.env.EXPRESS_DECRYPTION_KEY ?? "";

	const importedKey = await crypto.subtle.importKey(
		"raw",
		Uint8Array.fromHex(key),
		"AES-GCM",
		true,
		["encrypt", "decrypt"],
	);

	const decryptedData = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: Buffer.from(iv, "hex").buffer },
		importedKey,
		Buffer.from(token, "hex").buffer,
	);

	return Buffer.from(decryptedData).toString();
}
