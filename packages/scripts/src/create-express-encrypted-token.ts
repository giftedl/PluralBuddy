import { parseArgs } from "util";

const { values } = parseArgs({
	args: Bun.argv,
	options: {
		token: {
			type: "string",
		},
		key: {
			type: "string",
		},
	},
	strict: true,
	allowPositionals: true,
});

function bufferToHex(buffer: ArrayBuffer) {
	return Array.from(new Uint8Array(buffer))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}

const token = values.token ?? "";
const key = values.key ?? "";

const importedKey = await crypto.subtle.importKey(
	"raw",
	Uint8Array.fromHex(key),
	"AES-GCM",
	true,
	["encrypt", "decrypt"],
);

const iv = crypto.getRandomValues(new Uint8Array(16));
const encrypted = await crypto.subtle.encrypt(
	{ name: "AES-GCM", iv },
	importedKey,
	Buffer.from(token),
);

console.log(bufferToHex(iv.buffer), bufferToHex(encrypted));
