import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import StatisWebView, { PublicStaticWebItem } from "./StatisWebView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Web & Landing Page | SejatiDimedia",
  description:
    "Koleksi website company profile, landing page, dan situs web statis karya SejatiDimedia.",
};

export default async function StatisWebPage() {
  let items: PublicStaticWebItem[] = [];

  try {
    const records = await prisma.staticWebProject.findMany({
      where: { isPublished: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        category: true,
        liveUrl: true,
        thumbnailUrl: true,
      },
    });
    items = records;
  } catch (error) {
    console.error("Failed to fetch static web items:", error);
  }

  return <StatisWebView items={items} />;
}
