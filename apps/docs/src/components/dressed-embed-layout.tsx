import { render } from "@dressed/react";
import { APIMessageComponent } from "discord-api-types/v10";
import { headers } from "next/headers";
import { userAgent } from "next/server";

export async function DressedEmbedLayout({ children }: { children: React.ReactNode }) {
  const renderedContents = await new Promise<APIMessageComponent[]>((r) =>
    render(children, (components) => r(components as APIMessageComponent[])),
  );

  return (
    <script id="discord:component-embed" type="application/json">
      {JSON.stringify({ component: renderedContents[0] })}
    </script>
  );
}
