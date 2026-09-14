import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInsightBySlug, getRelatedInsights, getInsights } from "@/lib/api/insights";
import InsightDetailClient from "@/components/insights/InsightDetailClient";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getInsights();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | SejatiDimedia",
      description: "Halaman artikel yang Anda cari tidak ditemukan.",
    };
  }

  return {
    title: `${article.titleId} | SejatiDimedia Insights`,
    description: article.excerptId,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.titleId,
      description: article.excerptId,
      url: `https://sejatidimedia.web.id/insights/${article.slug}`,
      siteName: "SejatiDimedia",
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.titleId,
        },
      ],
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.titleId,
      description: article.excerptId,
      images: [article.coverImage],
    },
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, relatedArticles] = await Promise.all([
    getInsightBySlug(slug),
    getRelatedInsights(slug, 3),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <InsightDetailClient
      article={article}
      relatedArticles={relatedArticles}
    />
  );
}

