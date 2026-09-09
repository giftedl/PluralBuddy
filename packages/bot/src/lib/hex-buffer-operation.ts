export function hexToBuffer(hex: string) {
	const arr = new Uint8Array(
		(hex.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16)),
	);
	return arr.buffer;
}
