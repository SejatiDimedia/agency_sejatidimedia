import { createClient } from "next-sanity";
import { homePageQuery } from "./queries";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-11";

export const isSanityConfigured = !!projectId;

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

// Default high-fidelity Indonesian/English copywriting from current static landing page
export const DEFAULT_COPYWRITING = {
  heroTitle: "Embrace the future of digital engineering with our high-fidelity product software craftsmanship.",
  heroSubtitle: "Providing Comprehensive Solutions Tailored to Your Needs.",
  contactTagline: "Your technical parameters were integrated directly into the SejatiDImedia rendering queue.",
  processesTitle: "Providing Comprehensive Solutions Tailored to Your Needs.",
};

export async function getHomePageCopy() {
  if (!isSanityConfigured || !sanityClient) {
    return DEFAULT_COPYWRITING;
  }
  try {
    const data = await sanityClient.fetch(homePageQuery);
    return data || DEFAULT_COPYWRITING;
  } catch (error) {
    console.warn("Sanity fetch failed, falling back to static copywriting:", error);
    return DEFAULT_COPYWRITING;
  }
}
