import {
  ArrowUpRight,
  BadgeCheckIcon,
  Ban,
  BookOpen,
  ChevronRightIcon,
  CircleUser,
  Code,
  Info,
  Link2,
  SquareArrowOutUpRight,
  TrainFront,
  Webhook,
} from "lucide-react";
import { motion } from "motion/react";
import NextLink from "next/link";
import { JSX, ReactElement } from "react";
import { Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { DynamicPageTitle } from "../dynamic-title";

const pages = [
  { separate: "Account" },
  { title: "Profile", href: "/app/settings/account", icon: CircleUser },
  { title: "Social", href: "/app/settings/social", icon: Ban },
  {
    title: "Authorized Apps",
    href: "/app/settings/authorized-apps",
    icon: BadgeCheckIcon,
  },
  { separate: "Developers" },
  { title: "Webhooks", href: "/app/settings/webhooks", icon: Webhook },
  {
    title: "OAuth Applications",
    href: "/app/settings/developers-v2",
    icon: Code,
  },
  {
    title: "API Documentation",
    href: "/docs/pluralbuddy/oauth-apps",
    icon: BookOpen,
    external: true,
  },
  { separate: "Product" },
  {
    title: "PluralBuddy Express",
    href: "/app/settings/express",
    icon: TrainFront,
  },
  { title: "About PluralBuddy", href: "/app/settings/about", icon: Info },
];

export function IndexSettingsAppPage() {
  return (
    <main className="flex w-full flex-1 flex-col gap-3 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
      <DynamicPageTitle title="Settings • PluralBuddy App" />
      <Card className="w-full">
        <CardContent>
          <Breadcrumb className="text-left">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Settings</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardContent>
      </Card>
      {pages.map((page) =>
        "separate" in page ? (
          <Marker key={page.separate} variant="separator" className="mt-6">
            <MarkerContent>{page.separate}</MarkerContent>
          </Marker>
        ) : (
          <PageBtn page={page} key={page.title} />
        ),
      )}
    </main>
  );
}

function PageBtn({ page }: { page: (typeof pages)[2] }) {
  const LinkComponent =
    page.external === true
      ? ({ to, children }: { to: string; children: any }) => (
          <NextLink href={to} className="w-full">
            {children}
          </NextLink>
        )
      : ({ to, children }: { to: string; children: any }) => (
          <Link to={to} className="w-full hover:bg-muted rounded-lg">
            {children}
          </Link>
        );

  if (!("separate" in page))
    return (
      <LinkComponent to={page.href}>
        <Item variant="outline" size="sm" key={page.title}>
          <ItemMedia>
            <page.icon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{page.title}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <motion.div initial={{ x: 0 }} whileHover={{ x: 3 }}>
              {page.external === true ? (
                <ArrowUpRight className="size-4" />
              ) : (
                <ChevronRightIcon className="size-4" />
              )}
            </motion.div>
          </ItemActions>
        </Item>
      </LinkComponent>
    );
  return null;
}
