/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { Suspense } from "react";

export default function Layout({ children }: LayoutProps<"/">) {
  return <Suspense>{children}</Suspense>;
}
