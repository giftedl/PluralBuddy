import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

const getMetaTags = async (url: string) => {
  const headers = new Headers();
  headers.set("accept", "text/html,application/xhtml+xml,application/xml");
  const res = await fetch(url, { headers });
  const html = await res.text();
  const document = new DOMParser().parseFromString(html, "text/html");
  const metaTags = document.querySelectorAll("meta");
  const documentMeta = (Array.from(metaTags) as Element[])
    .reduce((acc, meta) => {
      const property = meta.getAttribute("property");
      const name = meta.getAttribute("name");
      const content = meta.getAttribute("content");

      if (!content) return acc;
      if (property) acc[property] = content;
      if (name) acc[name] = content;

      return acc;
    }, {} as Record<string, string>);
  documentMeta.title ??= document.querySelector("title")?.textContent;

  return documentMeta;
};

Deno.serve({ port: 8000 }, async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/meta") {
    const metaTags = await getMetaTags(url.searchParams.get("url"));
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Access-Control-Allow-Origin", "*");
    return new Response(JSON.stringify(metaTags), { status: 200, headers });
  }

  return new Response("not found", { status: 404 });
});
