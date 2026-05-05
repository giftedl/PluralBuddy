/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
	CacheFirst,
	CacheOnly,
	ExpirationPlugin,
	NetworkFirst,
	Serwist,
    StaleWhileRevalidate,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	precacheOptions: {
		ignoreURLParametersMatching: [/.*/],
        fallbackToNetwork: true
	},
	runtimeCaching: [
		{
			matcher: ({ url }) => url.pathname.startsWith("/app"),
			handler: new NetworkFirst({
				cacheName: "app-pages",
				plugins: [
				],
			}),
		},
		{
			matcher: ({ url }) => url.pathname.startsWith("/_next/"),
			handler: new NetworkFirst({
				cacheName: "next-assets",
				plugins: [
				],
			}),
		},
        {
			matcher: ({ url }) => url.pathname === "/favicon.ico",
			handler: new NetworkFirst({
				cacheName: "next-assets",
				plugins: [
				],
			}),
        },
		...defaultCache,
	],
	fallbacks: {
		entries: [
			{
				url: "/manifest.json",
				matcher({ request }) {
					// Or whatever else you want to check for in a request.
					return request.destination === "document";
				},
			},
			{
				url: "/app/onboarding",
				matcher({ request }) {
					// Or whatever else you want to check for in a request.
					return request.destination === "document";
				},
			},
		],
	},
});

const urlsToCache = ["/app/onboarding", "/manifest.json"] as const;

self.addEventListener("install", (event) => {
	event.waitUntil(
		Promise.all(
			urlsToCache.map((entry) => {
				const request = serwist.handleRequest({
					request: new Request(entry),
					event,
				});
				return request;
			}),
		),
	);
});


self.addEventListener("fetch", async (event) => {
	const url = new URL(event.request.url);
    const cache = await caches.open(serwist.precacheStrategy.cacheName);

    if (url.pathname.startsWith("/app/"))
	console.log("hello", url);
    console.log(cache)

	if (url.pathname.startsWith("/api/") && event && url.origin === location.origin) {
		const tryReq = await fetch(event.request);

        if (!tryReq.ok)
            event.respondWith(Response.json(null))
        
	}
	if (url.origin === location.origin && url.pathname.startsWith("/app")) {
        const cacheKey = serwist.getPrecacheKeyForUrl("/app/onboarding");
        console.log(cacheKey)
		if (cacheKey) {
			event.respondWith(
				(async () => (await cache.match(cacheKey)) ?? Response.error())(),
			);
		}
	}
});

serwist.addEventListeners();
