import {
	Button,
	Container,
	Separator as DressedSeparator,
	Section,
	TextDisplay,
} from "@dressed/react";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { PostHog } from "posthog-node";
import { OpenAPIPage } from "@/components/api-page";
import { DressedEmbedLayout } from "@/components/dressed-embed-layout";
import { Feedback } from "@/components/feedback/client";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "@/components/layouts/docs/page";
import { Separator } from "@/components/ui/separator";
import { openapi } from "@/lib/openapi";
import { api } from "@/lib/rpc";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

const getDiscordCommandData = unstable_cache(
	async ({ commandName }) =>
		await (
			await api.commands.$post({
				json: { commandName },
			})
		).json(),
	["commands"],
	{
		tags: ["commands"],
		revalidate: 86400,
	},
);

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
	const searchParams = (await props.searchParams).s
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();
	
	console.log(page.data.toc)
	console.log(searchParams)

	const commandData = page.data["_discord-embed-name"]
		? await getDiscordCommandData({
				commandName: page.data["_discord-embed-name"],
			})
		: null;
	const MDX = page.data.body;

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			tableOfContent={{
				style: "normal",
			}}
		>
			{commandData && (
				<DressedEmbedLayout>
					<Container accent_color={0xfccee8}>
						<Section
							accessory={
								<Button
									url="https://gftl.fyi/discord"
									label="Invite PluralBuddy"
								/>
							}
						>
							<TextDisplay>
								## [**{page.data.title}**](https://pluralbuddy.app/docs/
								{params.slug?.join("/")})
							</TextDisplay>
						</Section>

						<DressedSeparator />

						<TextDisplay>
							{
								page.data.body({
									components: getMDXComponents({}),
								}).props.children[0].props.children
							}
						</TextDisplay>

						{commandData?.subcommands.length > 1 ? (
							<>
								<DressedSeparator />

								<TextDisplay>
									### Sub-commands {"\n"}
									{commandData?.subcommands
										.slice(1)
										.map((v) => ` - </${v.name}:${v.id}> - ${v.description}`)
										.join("\n")}
								</TextDisplay>
							</>
						) : (
							<TextDisplay>{commandData.mention}</TextDisplay>
						)}
					</Container>
				</DressedEmbedLayout>
			)}
			<div className="flex flex-col gap-1">
				<DocsTitle>{page.data.title}</DocsTitle>
				<DocsDescription>{page.data.description}</DocsDescription>
			</div>
			<Separator />
			<DocsBody>
				<MDX
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),

						APIPage: async (props) => (
							<OpenAPIPage
								{...(await openapi.preloadOpenAPIPage(page))}
								{...props}
							/>
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
	const image = ["/og/docs", ...(params.slug ?? []), "image.png"].join("/");

	return {
		title: `${page.data.title} – PluralBuddy`,
		description: page.data.description,
		openGraph: {
			images: image,
		},
		twitter: {
			card: "summary_large_image",
			images: image,
		},
	};
}
