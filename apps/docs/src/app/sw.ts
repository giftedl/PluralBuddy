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
	runtimeCaching: [
		{
			matcher: ({ url }) => url.pathname.startsWith("/app"),
			handler: new NetworkFirst({
				cacheName: "app-pages",
				plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 })],
				networkTimeoutSeconds: 5,
			}),
		},
		{
			matcher: ({ url }) => url.pathname.startsWith("/_next/"),
			handler: new CacheFirst({
				cacheName: "next-assets",
				plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 })],
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

const urlsToCache = ["/_next/", "/app/onboarding", "/manifest.json"] as const;

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

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/api/") && url.origin === location.origin) {
    return Response.json(null);
  }
})

serwist.addEventListeners();
