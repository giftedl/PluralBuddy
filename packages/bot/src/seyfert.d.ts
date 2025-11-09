/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { ParseGlobalMiddlewares, ParseMiddlewares } from "seyfert";
import type { extendedContext } from ".";
import type { middlewares } from "./middleware";

declare module 'seyfert' {
    interface ExtendContext extends ReturnType<typeof extendedContext> {} 

    // Register the middlewares on seyfert types
    interface RegisteredMiddlewares
      extends ParseMiddlewares<typeof middlewares> {}
    interface GlobalMetadata
        extends ParseGlobalMiddlewares<typeof middlewares> {}
}