import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api/glio-projects';
import { getInsights } from '@/lib/api/insights';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sejatidimedia.web.id';

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects();
    projectRoutes = (projects || []).map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.endDate ? new Date(p.endDate) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Failed to load projects for sitemap', e);
  }

  let insightRoutes: MetadataRoute.Sitemap = [];
  try {
    const insights = await getInsights();
    insightRoutes = (insights || []).map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: new Date(i.publishedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (e) {
    console.error('Failed to load insights for sitemap', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...projectRoutes,
    ...insightRoutes,
  ];
}
