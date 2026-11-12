"use server";

import { unstable_cache } from "next/cache";
import { api } from "../lib/rpc";

const getAboutMessageContents = unstable_cache(
  async () => {
    const response = await api["about-message-contents"].$get();
    const json = await response.json();

    return json;
  },
  ["about-message-contents"],
  {
    tags: ["about-message-contents"],
    revalidate: 86400,
  },
);

export async function getRealisticAbout() {
  return await getAboutMessageContents();
}
