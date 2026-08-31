export function getPipedContentsAsPromise() {
	return new Promise<string>((re, r) => {
		let data = "";

		process.stdin.on("readable", () => {
			let chunk;
			while (null !== (chunk = process.stdin.read())) {
				data += chunk;
			}
		});

		process.stdin.on("end", () => {
            re(data)
		});
	});
}
