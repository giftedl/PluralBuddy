/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

export function extractTenorId(url: string): string | null {
    const tenorUrlRegex = /https?:\/\/tenor\.com\/view\/.+?-(\d+)/;
    const match = url.match(tenorUrlRegex);
    return match?.[1] ?? null;
}

export async function getGifLink(url: string) {
    const meta = await fetch(
        `${process.env.LINK_SCRAPER_API}?url=${encodeURIComponent(url)}`,
        { signal: AbortSignal.timeout(3000) },
    );
    const json = (await meta.json()) as Record<string, unknown>;

    return (json?.["og:image"] as string).replace("https://media1.tenor.com/m/", "https://media.tenor.com/");
}

