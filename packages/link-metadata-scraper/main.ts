import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";

const getMetaTags = async (url: string) => {
  try {
    const headers = new Headers();
    headers.set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
    headers.set("user-agent", "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)")
    const res = await fetch(url, { headers });
    const html = await res.text();
    const document = new DOMParser().parseFromString(html, "text/html");
    const metaTags = document.querySelectorAll("meta");
    const linkTags = document.querySelectorAll("link");

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

    const icons = (Array.from(linkTags) as Element[])
      .filter(v => v.getAttribute("rel")?.includes("icon"))
      .map((c) => {
        const href = c.getAttribute("href");
        if (!href) return undefined;
        try {
          // Try constructing absolute URL (will throw if already absolute or invalid base)
          return new URL(href, url).toString();
        } catch {
          // If URL construction fails, just return the original href
          return href;
        }
      })
      .filter((icon): icon is string => !!icon);

    const titleTag = document.querySelector("title");
    if (titleTag) documentMeta.title = titleTag.textContent;

    return {...documentMeta, icons};
  } catch (err) {
    console.error(err);
  }
};


Deno.serve({ port: 8000 }, async (request: Request): Promise<Response> => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Access-Control-Allow-Origin", "*");
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/meta") {
    const urlToFetch = url.searchParams.get("url");

    if (!urlToFetch) {
      return new Response(
        JSON.stringify({ error: "missing url query param" }),
        { status: 400, headers },
      );
    }

    const metaTags = await getMetaTags(urlToFetch);
    return new Response(
      JSON.stringify(metaTags ?? { error: "something went wrong" }),
      { status: metaTags ? 200 : 500, headers },
    );
  }

  if (request.method === "GET" && url.pathname === "/") {
    return new Response("OK", { status: 200, headers });
  }

  return new Response("not found", { status: 404, headers });
});

console.log("`HTTP server running. Access it at: http://localhost:8000/`");
