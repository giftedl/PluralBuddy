import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { PostHog } from "posthog-node";
import { OpenAPIPage } from "@/components/api-page";
import { Feedback } from "@/components/feedback/client";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "@/components/layouts/docs/page";
import { Separator } from "@/components/ui/separator";
import { openapi } from '@/lib/openapi';
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/[lang]/docs/[[...slug]]">) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();
	console.log(page.data.toc)

	const MDX = page.data.body;

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			tableOfContent={{
				style: "normal",
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

						APIPage: async (props) => (
							<OpenAPIPage {...await openapi.preloadOpenAPIPage(page)} {...props} />
						),
					})}
				/>
			</DocsBody>
			<Feedback
				onSendAction={async (feedback) => {
					"use server";

					const posthog = new PostHog(process.env.POSTHOG_API_KEY ?? "", {
						host: "https://us.i.posthog.com",
						flushAt: 1, // flush immediately in serverless environment
						flushInterval: 0, // same
					});

					await posthog.captureImmediate({
						event: "on_rate_docs",
						properties: feedback,
					});

					after(() => posthog.shutdown());

					return { githubUrl: "https://github.com/giftedl/PluralBuddy" };
				}}
			/>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();
	const image = ['/og/docs', ...(params.slug ?? []), 'image.png'].join('/');

	return {
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			images: image,
		},
		twitter: {
			card: 'summary_large_image',
			images: image,
		},
	};
}
