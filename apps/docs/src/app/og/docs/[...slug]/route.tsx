import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { generate as DefaultImage } from "@/lib/mono";
import { getPageImageUrl, source } from "@/lib/source";

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<"/og/docs/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="PluralBuddy Docs"
      logo={
        // biome-ignore lint/performance/noImgElement: Skill issue.
        <img
          // @ts-ignore Satori supports using ArrayBuffer's as image src tags
          src={(await readFile(join(process.cwd(), "public/image/pfp.png"))).buffer}
          width={64}
          height={64}
          alt="Solar"
          style={{ borderRadius: "50px" }}
        />
      }
    />,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter Tight",
          data: await readFile(join(process.cwd(), "src/assets/InterTight-Medium.ttf")),
          style: "normal",
        },
      ],
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
