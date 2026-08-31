/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname.startsWith("/c/")) {
			return Response.redirect(`https://img.pbc.giftedly.dev/${pathname.slice(3)}`, 308)
		}
		if (pathname.startsWith("/p/")) {
			return Response.redirect(`https://img.pb.giftedly.dev/${pathname.slice(3)}`, 308);
		}

		return Response.redirect(`https://pb.giftedly.dev/${pathname}`, 308);
	},
} satisfies ExportedHandler<Env>;
