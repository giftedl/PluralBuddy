// Source - https://stackoverflow.com/a/76163982

function convert(x: number) {
	let h = ~~(x / 3600),
		m = ~~((x - h * 3600) / 60),
		s = x - h * 3600 - m * 60;
	let words = ["hour", "minute", "second"];
	return [h, m, s]
		.map((x, i) => (!x ? "" : `${x} ${words[i]}${x !== 1 ? "s" : ""}`))
		.filter((x) => x)
		.join(", ")
		.replace(/,([^,]*)$/, " and$1");
}

export default convert;
