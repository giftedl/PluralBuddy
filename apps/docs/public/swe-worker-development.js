/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/.bun/@serwist+next@9.5.11+4dfa722264fff7ad/node_modules/@serwist/next/dist/sw-entry-worker.mjs":
/*!*************************************************************************************************************************!*\
  !*** ../../node_modules/.bun/@serwist+next@9.5.11+4dfa722264fff7ad/node_modules/@serwist/next/dist/sw-entry-worker.mjs ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n//#region src/sw-entry-worker.ts\nself.onmessage = async (ev) => {\n\tswitch (ev.data.type) {\n\t\tcase \"__START_URL_CACHE__\": {\n\t\t\tconst url = ev.data.url;\n\t\t\tconst response = await fetch(url);\n\t\t\tif (!response.redirected) return (await caches.open(\"start-url\")).put(url, response);\n\t\t\treturn Promise.resolve();\n\t\t}\n\t\tcase \"__FRONTEND_NAV_CACHE__\": {\n\t\t\tconst url = ev.data.url;\n\t\t\tconst pagesCache = await caches.open(\"pages\");\n\t\t\tif (!!await pagesCache.match(url, { ignoreSearch: true })) return;\n\t\t\tconst page = await fetch(url);\n\t\t\tif (!page.ok) return;\n\t\t\tpagesCache.put(url, page.clone());\n\t\t\treturn Promise.resolve();\n\t\t}\n\t\tdefault: return Promise.resolve();\n\t}\n};\n//#endregion\n\n\n//# sourceMappingURL=sw-entry-worker.mjs.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vQHNlcndpc3QrbmV4dEA5LjUuMTErNGRmYTcyMjI2NGZmZjdhZC9ub2RlX21vZHVsZXMvQHNlcndpc3QvbmV4dC9kaXN0L3N3LWVudHJ5LXdvcmtlci5tanMiLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxvQkFBb0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1U7O0FBRVYiLCJzb3VyY2VzIjpbIi9Vc2Vycy9naWZ0ZWRseS9Eb2N1bWVudHMvUGx1cmFsQnVkZHkvbm9kZV9tb2R1bGVzLy5idW4vQHNlcndpc3QrbmV4dEA5LjUuMTErNGRmYTcyMjI2NGZmZjdhZC9ub2RlX21vZHVsZXMvQHNlcndpc3QvbmV4dC9kaXN0L3N3LWVudHJ5LXdvcmtlci5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIHNyYy9zdy1lbnRyeS13b3JrZXIudHNcbnNlbGYub25tZXNzYWdlID0gYXN5bmMgKGV2KSA9PiB7XG5cdHN3aXRjaCAoZXYuZGF0YS50eXBlKSB7XG5cdFx0Y2FzZSBcIl9fU1RBUlRfVVJMX0NBQ0hFX19cIjoge1xuXHRcdFx0Y29uc3QgdXJsID0gZXYuZGF0YS51cmw7XG5cdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XG5cdFx0XHRpZiAoIXJlc3BvbnNlLnJlZGlyZWN0ZWQpIHJldHVybiAoYXdhaXQgY2FjaGVzLm9wZW4oXCJzdGFydC11cmxcIikpLnB1dCh1cmwsIHJlc3BvbnNlKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0Y2FzZSBcIl9fRlJPTlRFTkRfTkFWX0NBQ0hFX19cIjoge1xuXHRcdFx0Y29uc3QgdXJsID0gZXYuZGF0YS51cmw7XG5cdFx0XHRjb25zdCBwYWdlc0NhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oXCJwYWdlc1wiKTtcblx0XHRcdGlmICghIWF3YWl0IHBhZ2VzQ2FjaGUubWF0Y2godXJsLCB7IGlnbm9yZVNlYXJjaDogdHJ1ZSB9KSkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgcGFnZSA9IGF3YWl0IGZldGNoKHVybCk7XG5cdFx0XHRpZiAoIXBhZ2Uub2spIHJldHVybjtcblx0XHRcdHBhZ2VzQ2FjaGUucHV0KHVybCwgcGFnZS5jbG9uZSgpKTtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHR9XG5cdFx0ZGVmYXVsdDogcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXHR9XG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQge307XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXN3LWVudHJ5LXdvcmtlci5tanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../node_modules/.bun/@serwist+next@9.5.11+4dfa722264fff7ad/node_modules/@serwist/next/dist/sw-entry-worker.mjs\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				if (!originalFactory) {
/******/ 					document.location.reload();
/******/ 					return;
/******/ 				}
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["../../node_modules/.bun/@serwist+next@9.5.11+4dfa722264fff7ad/node_modules/@serwist/next/dist/sw-entry-worker.mjs"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;