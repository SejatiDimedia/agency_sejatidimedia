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
  heroTitle: "Software Developer Independen — Membangun Website, Aplikasi, dan Sistem Backend yang Siap Diandalkan.",
  heroSubtitle: "Berbekal pengalaman sebagai Software Developer di industri manufaktur, saya membangun produk digital dengan kode custom, arsitektur yang rapi, dan komunikasi langsung — tanpa perantara.",
  contactTagline: "Parameter proyek Anda telah diterima secara langsung. Saya akan mempelajari kebutuhan Anda dan menghubungi Anda dalam waktu 12 jam.",
  processesTitle: "Proses Kerja Terstruktur untuk Hasil Terbaik",
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
