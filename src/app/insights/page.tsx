import { Metadata } from "next";
import { getInsights, getAllCategories } from "@/lib/api/insights";
import InsightsList from "./InsightsList";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Insights & Rekayasa Perangkat Lunak | SejatiDimedia",
  description: "Catatan teknis mendalam tentang arsitektur web, optimasi performa Laravel & Next.js, skalabilitas database, dan standar rekayasa software dari SejatiDimedia.",
  openGraph: {
    title: "Insights & Rekayasa Perangkat Lunak | SejatiDimedia",
    description: "Catatan teknis mendalam tentang arsitektur web, optimasi performa Laravel & Next.js, skalabilitas database, dan standar rekayasa software.",
    url: "https://sejatidimedia.web.id/insights",
    type: "website",
  },
};

export default async function InsightsPage() {
  const [articles, categories] = await Promise.all([
    getInsights(),
    getAllCategories(),
  ]);

  return <InsightsList articles={articles} categories={categories} />;
}
