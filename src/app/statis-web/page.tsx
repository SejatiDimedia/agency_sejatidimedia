import type { Metadata } from "next";
import StatisWebView from "./StatisWebView";

export const metadata: Metadata = {
  title: "Web & Landing Page | SejatiDimedia",
  description:
    "Koleksi website company profile, landing page, dan situs web statis karya SejatiDimedia.",
};

export default function StatisWebPage() {
  return <StatisWebView />;
}
