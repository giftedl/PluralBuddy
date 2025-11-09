/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Container, createMiddleware } from "seyfert";
import { middlewareIssue } from "../lib/middleware-issue";

export const blacklistUserMiddleware = createMiddleware<void>(async (middle) => {
    const pluralUser = await middle.context.retrievePUser()

    if (pluralUser.blacklisted) {
      return middlewareIssue("ERROR_USER_BLACKLISTED", middle);
    }

  middle.next();
});