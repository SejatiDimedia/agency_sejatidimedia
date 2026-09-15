import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInsightSeriesBySlug, getInsightSeriesList } from "@/lib/api/insights";
import InsightSeriesDetailClient from "@/components/insights/InsightSeriesDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = await getInsightSeriesBySlug(slug);

  if (!series) {
    return {
      title: "Seri Tidak Ditemukan | SejatiDimedia",
      description: "Halaman kurikulum seri yang Anda cari tidak ditemukan.",
    };
  }

  return {
    title: `${series.titleId} (Seri Rekayasa) | SejatiDimedia`,
    description: series.descriptionId,
    openGraph: {
      title: `${series.titleId} | SejatiDimedia Engineering Series`,
      description: series.descriptionId,
      url: `https://sejatidimedia.web.id/insights/series/${series.slug}`,
      siteName: "SejatiDimedia",
      images: [
        {
          url: series.coverImage || "/images/insights/laravel_architecture_cover.jpg",
          width: 1200,
          height: 630,
          alt: series.titleId,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: series.titleId,
      description: series.descriptionId,
      images: [series.coverImage || "/images/insights/laravel_architecture_cover.jpg"],
    },
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = await getInsightSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  return <InsightSeriesDetailClient series={series} />;
}
