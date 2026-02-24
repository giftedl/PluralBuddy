export function fixDiscordHeaders() {
	const rewrittenMarginFlag = `:host > * {
        margin: 0 0 8px !important;
      }`;
	const sheet = new CSSStyleSheet();

	sheet.insertRule(rewrittenMarginFlag);

	for (let element of document.getElementsByTagName("discord-header"))
		if (element.shadowRoot)
			element.shadowRoot.adoptedStyleSheets = [
				...(element.shadowRoot?.adoptedStyleSheets ?? []),
				sheet,
			];
}
