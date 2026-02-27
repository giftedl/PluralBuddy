export function fixDiscordHeaders() {
	const rewrittenMarginFlag = `:host > * {
        margin: 0 0 8px !important;
      }`;
	const rewrittenQuoteColorFlag = `* {
	    color: oklab(0.700617 0.00173205 -0.0100245)
	}`;
	const messageTimestampConsecutiveFlag = `.discord-message-body-only-indent {
		width: 70px !important;
		font-size: 11px !important;
	}`;

	const sheet = new CSSStyleSheet();
	const messageTimestampSheet = new CSSStyleSheet();
	const textDisplaySheet = new CSSStyleSheet();
	const colorDisplaySheet = new CSSStyleSheet();

	sheet.insertRule(rewrittenMarginFlag);
	colorDisplaySheet.insertRule(rewrittenQuoteColorFlag);
	messageTimestampSheet.insertRule(messageTimestampConsecutiveFlag)

	for (let element of document.getElementsByTagName("discord-header"))
		if (element.shadowRoot)
			element.shadowRoot.adoptedStyleSheets = [
				...(element.shadowRoot?.adoptedStyleSheets ?? []),
				sheet,
			];
	for (let element of document.getElementsByTagName("discord-message"))
		if (element.shadowRoot)
			element.shadowRoot.adoptedStyleSheets = [
				...(element.shadowRoot?.adoptedStyleSheets ?? []),
				messageTimestampSheet,
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
