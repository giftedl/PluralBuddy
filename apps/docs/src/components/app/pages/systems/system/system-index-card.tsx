import type {PSystem} from "plurography";
import {Card, CardContent} from "@/components/ui/card";
import {Tab, TabList, TabPanel, Tabs} from "@/components/ui/tabs";
import {haptic} from "@/lib/haptic/haptic";
import {motion} from "motion/react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {findAndReplace} from "mdast-util-find-and-replace";
import {Empty, EmptyDescription, EmptyHeader, EmptyTitle} from "@/components/ui/empty";
import {useTranslations} from "next-intl";

export function SystemIndexCard({data}: { data: PSystem }) {

    const t = useTranslations();

    return <Card className="mb-3">
        <CardContent>
            <Tabs aria-label="Choose system viewing mode">
                <TabList>

                    <Tab id="f" onClick={() => haptic()}>
                        How you see your system
                    </Tab>
                    <Tab id="i" onClick={() => haptic()}>
                        How others see your system
                    </Tab>
                </TabList>
                <TabPanel id="f">


                    <div className="md:flex pt-6 pb-10">
                        <motion.div className="rounded-xl md:min-w-89 w-full h-full border p-4 grid gap-2"
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 100, y: 0}}
                                    transition={{type: "tween", delay: 0.4}}>
                            <div className="relative h-37.5">
                                {data?.systemBanner ? (
                                    <img
                                        src={data?.systemBanner}
                                        className="w-[320px] h-[120px] rounded-xl z-0 object-cover w-full"
                                        alt={t("alt_banner")}
                                    />
                                ) : (
                                    <div className="bg-[#5865F2] w-full md:min-w-[320px] w-full h-30 rounded-xl absolute" />
                                )}

                                <Avatar className="w-20 h-20 absolute bottom-0 left-2.5 border-6 border-card">
                                    <AvatarImage src={data?.systemAvatar ?? ""} />
                                    <AvatarFallback className="bg-[#5865F2] text-white text-2xl">
                                        {data.systemName[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="bg-card-foreground/10 rounded-xl p-4 grid gap-2">
                                <h1 className="text-[20px] font-bold text-wrap wrap-anywhere">
                                    { data.systemName}
                                </h1>
                                {( data.systemPronouns) && (
                                    <span className="text-wrap wrap-anywhere">
									{ data.systemPronouns}
								</span>
                                )}
                                <Separator className="h-px my-1" />
                                {(
                                    (data.systemDescription ?? "")
                                        .replace(" ", "")
                                        .replace("\n", "") !== ""
                                        ? ( data.systemDescription)
                                        : undefined
                                ) ? (
                                    <span className="text-wrap wrap-anywhere prose text-sm">
									<Markdown
                                        remarkPlugins={[
                                            remarkGfm,
                                            () => {
                                                return (tree: any) => {
                                                    findAndReplace(tree, [
                                                        /__(.*)__/g,
                                                        (_, $1) => {
                                                            return {
                                                                type: "mdxJsxTextElement",
                                                                value: <u>{$1}</u>,
                                                                name: "underlined-text",
                                                                attributes: [],
                                                                children: [],
                                                            };
                                                        },
                                                    ]);
                                                };
                                            },
                                        ]}
                                    >
										{(data.systemDescription ?? "").replaceAll(
                                            "\n",
                                            "\n\n",
                                        )}
									</Markdown>
								</span>
                                ) : (
                                    <Empty className="h-full bg-muted/30">
                                        <EmptyHeader>
                                            <EmptyTitle>It's empty here...</EmptyTitle>
                                            <EmptyDescription className="max-w-xs text-pretty">
                                                This system doesn't have a description!
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </TabPanel>
                <TabPanel id="i">
bye
                </TabPanel>
            </Tabs>
        </CardContent>
    </Card>;
}