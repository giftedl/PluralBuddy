import { headers } from "next/headers";
import { ssrLocale } from "@/app/layout";
import { setLocale } from "@/paraglide/runtime";

const paraglideLocale = /PARAGLIDE_LOCALE=(.*)(;|)/;

export async function correctSSRLocale() {
  setLocale((paraglideLocale.exec((await headers()).get("Cookie") ?? "") ?? ["", "en"])[1] as "en");
}
