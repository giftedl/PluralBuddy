import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import type { JSX } from "react/jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import { type BundledLanguage, codeToHast } from "shiki/bundle/web";

export async function highlight(code: string, lang: BundledLanguage, theme: string) {
	const out = await codeToHast(code, {
		lang,
		theme,
	});

	return toJsxRuntime(out, {
		Fragment,
		jsx,
		jsxs,
	}) as JSX.Element;
}
