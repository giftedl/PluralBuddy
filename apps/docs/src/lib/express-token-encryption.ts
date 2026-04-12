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
		{ name: "AES-GCM", iv: hexToBuffer(iv) },
		importedKey,
		hexToBuffer(token),
	);

	return Buffer.from(decryptedData).toString();
}

function hexToBuffer(hex: string) {
    const arr = new Uint8Array((hex.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16)));
    return arr.buffer;
}
