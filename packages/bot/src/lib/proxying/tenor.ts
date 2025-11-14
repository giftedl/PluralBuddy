/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

export function extractTenorId(url: string): string | null {
    const tenorUrlRegex = /https?:\/\/tenor\.com\/view\/.+?-(\d+)/;
    const match = url.match(tenorUrlRegex);
    return match?.[1] ?? null;
}

export async function getGifLink(url: string) {
    const tenorId = extractTenorId(url);
    if (tenorId === null) return null;

    const response = await fetch(
        `https://tenor.googleapis.com/v2/posts?key=${process.env.TENOR_API_KEY}&ids=${tenorId}`
    );
    const json = (await response.json()) as {
        results?: Array<{
            media_formats?: {
                gif?: {
                    url?: string;
                };
            };
        }>;
    };

    return json?.results?.[0]?.media_formats?.gif?.url ?? null;
}

