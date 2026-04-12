const generatedKey = await crypto.subtle.generateKey(
	{
		name: "AES-GCM",
		length: 256,
	},
	true,
	["encrypt", "decrypt"],
);

const exportedKey = await crypto.subtle.exportKey("raw", generatedKey);

console.log(Buffer.from(exportedKey).toHex())