import { getPageImage, source } from "@/lib/source";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "@/components/layout/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { Separator } from "@/components/ui/separator";
import { Feedback } from "@/components/feedback/client";
import posthog, { PostHog } from "posthog-js";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			tableOfContent={{
				style: "clerk",
			}}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<Separator />
			<DocsBody>
				<MDX
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
			<Feedback
				onSendAction={async (feedback) => {
					"use server";

					posthog.init(process.env.POSTHOG_API_KEY ?? "", {
						api_host: "https://us.i.posthog.com",
					});

					posthog.capture("on_rate_docs", feedback);

					return { githubUrl: "https://github.com/giftedl/PluralBuddy" };
				}}
			/>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(
	props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: `${page.data.title} | PluralBuddy`,
		description: page.data.description,
		openGraph: {
			images: getPageImage(page).url,
		},
	};
}
