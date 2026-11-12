import { Dithering, GodRays } from "@paper-design/shaders-react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/shadcn-button";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { DynamicPageTitle } from "../../dynamic-title";

export function AboutPage() {
  const { resolvedTheme } = useTheme();
  const GitHubIcon = resolvedTheme === "dark" ? GithubDark : GithubLight;

  return (
    <>
      <main className="flex w-full flex-1 flex-col mx-auto gap-6 md:md:px-4 max-md:px-2 pt-18 items-center max-w-250 mb-3">
        <DynamicPageTitle title="About PluralBuddy • PluralBuddy App" />
        <Card className="w-full">
          <CardContent>
            <Breadcrumb className="text-left">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/app/settings/about">About PluralBuddy</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>
      </main>

      <div className="w-full h-full min-h-screen p-4">
        <div className="relative">
          <Dithering
            height={720}
            colorBack="#000000000"
            colorFront="#ed4b9b"
            className="absolute z-0 rounded-xl border top-0 h-180 w-full"
            shape="ripple"
            type="4x4"
            size={2.4}
            speed={2}
            scale={1.56}
            offsetX={0}
            offsetY={0.8}
          />
          <div className="absolute flex justify-between flex-col items-center z-10 w-full p-4 space-y-2">
            <div className="space-y-2 max-w-150">
              <Card className=" bg-background/60 backdrop-blur-xl h-full w-full">
                <CardContent className="text-center">
                  <CardTitle>PluralBuddy – the fast plurality bot</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-center w-full justify-center">
                    v26.1.1
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className=" bg-background/60  backdrop-blur-xl h-full w-full">
                <CardContent className="text-center">
                  <CardTitle className="text-xl">
                    Created by{" "}
                    <Link className="text-primary" href="https://giftedly.dev">
                      giftedly 💝
                    </Link>{" "}
                    with a TON of TypeScript.
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-center w-full justify-center">
                    PluralBuddy is licensed under the MIT License.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className=" bg-background/90  backdrop-blur-xl h-full w-full">
                <CardContent>
                  <CardTitle>Credits</CardTitle>
                  <CardDescription>
                    PluralBuddy would not be possible without these people.
                  </CardDescription>

                  <Item variant="outline" className="mt-4">
                    <ItemMedia>
                      <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background">
                        <Avatar className="hidden sm:flex">
                          <AvatarImage src="https://github.com/giftedl.png" alt="@giftedl" />
                          <AvatarFallback>GI</AvatarFallback>
                        </Avatar>
                        <Avatar className="hidden sm:flex">
                          <AvatarImage
                            src="https://github.com/LTappleseed.png"
                            alt="@LTappleseed"
                          />
                          <AvatarFallback>LT</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarImage
                            src="https://avatars.githubusercontent.com/in/15368?s=64&v=4"
                            alt="@github-actions[bot]"
                          />
                          <AvatarFallback>GH</AvatarFallback>
                        </Avatar>
                        <Avatar>
                          <AvatarImage src="https://github.com/Stjernesys.png" alt="@Stjernesys" />
                          <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                      </div>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Contributors</ItemTitle>
                      <ItemDescription>PluralBuddy is OSS; anyone can contribute.</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Link href="https://github.com/giftedl/pluralbuddy" target="_blank">
                        <Button variant="outline">
                          <GitHubIcon />
                        </Button>
                      </Link>
                    </ItemActions>
                  </Item>
                  <Accordion type="single" className="mt-2 rounded-lg border">
                    <AccordionItem value="hard_times" className="border-b px-4 last:border-b-0">
                      <AccordionTrigger>to those going through hard times:</AccordionTrigger>
                      <AccordionContent className="h-full" asChild>
                        <div className="h-full flex flex-col">
                          <p className="block mb-1!">
                            i'm so sorry. sometimes, living in this world, even when its cruel, or
                            rough, can be hard. sometimes, there are people who hate your mere
                            existance. i bet you're an awesome person, even behind the screen.{" "}
                            <br /> <br />
                            if you're ever having thoughts of self-harm or suicide, i recommend
                            asking for help by{" "}
                            <Link
                              href="https://en.wikipedia.org/wiki/List_of_suicide_crisis_lines"
                              className="text-primary"
                            >
                              calling for a hotline in your country
                            </Link>
                            . things <i>will</i> get better, i promise. 💝
                          </p>
                          <Link
                            href="https://checkpoint.carrd.co/"
                            target="_blank"
                            className="mt-1"
                          >
                            <Button variant="outline">mental health checkpoint</Button>
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="friends" className="border-b px-4 last:border-b-0">
                      <AccordionTrigger>to all of my friends:</AccordionTrigger>
                      <AccordionContent className="h-full">
                        thank you so much. you know who you all are. i wouldn't be alive to this day
                        if it wasn't for all of you. every single one of you and especially my
                        partner means the world to me, in more ways then you all would ever know.
                        thank you for giving me the clarity to let me work on long-standing projects
                        like this. thank you for being there at my lowest when i really,{" "}
                        <i>really</i> needed it.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="k" className="border-b px-4 last:border-b-0">
                      <AccordionTrigger>to k:</AccordionTrigger>
                      <AccordionContent className="h-full">
                        thank you for being the best friend ever. even if you are gone now, i will
                        miss you deeply for every day you are gone. i hope you're okay 💗
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
