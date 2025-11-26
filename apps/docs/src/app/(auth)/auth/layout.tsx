/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Suspense } from "react";

export default function Layout({ children }: LayoutProps<'/'>) {
    return <Suspense>{children}</Suspense>
}