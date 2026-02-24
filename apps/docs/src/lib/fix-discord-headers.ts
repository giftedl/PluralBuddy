export function fixDiscordHeaders() {
	const rewrittenMarginFlag = `:host > * {
        margin: 0 0 8px !important;
      }`;
	const rewrittenContainerBorderFlag = `.discord-left-border {
		width: 8px !important;
	}`;
	const rewrittenQuoteColorFlag = `* {
	    color: oklab(0.700617 0.00173205 -0.0100245)
	}`;
	
	const sheet = new CSSStyleSheet();
	const textDisplaySheet = new CSSStyleSheet();
	const colorDisplaySheet = new CSSStyleSheet();
	const verifiedAuthorTagSheet = new CSSStyleSheet();

	sheet.insertRule(rewrittenMarginFlag);
	textDisplaySheet.insertRule(rewrittenContainerBorderFlag);
	colorDisplaySheet.insertRule(rewrittenQuoteColorFlag);

	for (let element of document.getElementsByTagName("discord-header"))
		if (element.shadowRoot)
			element.shadowRoot.adoptedStyleSheets = [
				...(element.shadowRoot?.adoptedStyleSheets ?? []),
				sheet,
			];

	for (let element of document.getElementsByTagName("discord-container"))
		if (element.shadowRoot) {
			element.shadowRoot.adoptedStyleSheets = [
				...(element.shadowRoot?.adoptedStyleSheets ?? []),
				textDisplaySheet,
			];
		}
	for (let element of document.getElementsByTagName("discord-quote"))
		if (element.shadowRoot) {
			element.shadowRoot.adoptedStyleSheets = [
				...(element.shadowRoot?.adoptedStyleSheets ?? []),
				colorDisplaySheet,
			];
		}
}
